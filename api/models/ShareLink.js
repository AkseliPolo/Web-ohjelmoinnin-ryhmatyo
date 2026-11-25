import { pool } from './db.js'

const LINK_COLUMNS = 'id, token, expires_at, max_uses, use_count, revoked, created_at'

// ---- Ryhmien kutsulinkit ----

// Palauttaa syyn, miksi linkki ei kelpaa, tai null jos se on käytettävissä
const getLinkProblem = (link) => {
  if (link.revoked) return 'Kutsulinkki on peruttu'
  if (link.expires_at && new Date(link.expires_at) <= new Date()) {
    return 'Kutsulinkki on vanhentunut'
  }
  if (link.max_uses !== null && link.use_count >= link.max_uses) {
    return 'Kutsulinkki on käytetty loppuun'
  }
  return null
}

const createGroupInviteLink = async (groupId, userId, expiresAt, maxUses) => {
  const result = await pool.query(
    `INSERT INTO share_links (link_type, created_by, group_id, expires_at, max_uses)
     VALUES ('group_invite', $1, $2, $3, $4)
     RETURNING ${LINK_COLUMNS}`,
    [userId, groupId, expiresAt, maxUses]
  )
  return result.rows[0]
}

// Ryhmän voimassa olevat kutsulinkit
const listGroupInviteLinks = async (groupId) => {
  const result = await pool.query(
    `SELECT ${LINK_COLUMNS}
     FROM share_links
     WHERE group_id = $1
       AND link_type = 'group_invite'
       AND revoked = false
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR use_count < max_uses)
     ORDER BY created_at DESC, id DESC`,
    [groupId]
  )
  return result.rows
}

const revokeGroupInviteLink = async (groupId, linkId) => {
  const result = await pool.query(
    `UPDATE share_links
     SET revoked = true
     WHERE id = $1 AND group_id = $2 AND link_type = 'group_invite' AND revoked = false
     RETURNING id`,
    [linkId, groupId]
  )
  return result.rows[0]
}

// Linkin esikatselu: ryhmän tiedot ja kuuluuko katsoja jo ryhmään
const getInviteByToken = async (token, viewerId) => {
  const result = await pool.query(
    `SELECT l.expires_at, l.max_uses, l.use_count, l.revoked,
            g.id AS group_id, g.name, g.description,
            (SELECT COUNT(*) FROM group_members WHERE group_id = g.id)::int AS member_count,
            me.role AS my_role
     FROM share_links l
     JOIN groups g ON g.id = l.group_id
     LEFT JOIN group_members me ON me.group_id = g.id AND me.user_id = $2
     WHERE l.token = $1 AND l.link_type = 'group_invite'`,
    [token, viewerId]
  )
  return result.rows[0]
}

// Liittyminen linkin kautta. Palauttaa { code, ... }:
// not_found | invalid | already_member | joined
const joinViaInvite = async (token, userId) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const linkResult = await client.query(
      `SELECT id, group_id, expires_at, max_uses, use_count, revoked
       FROM share_links
       WHERE token = $1 AND link_type = 'group_invite'
       FOR UPDATE`,
      [token]
    )
    const link = linkResult.rows[0]
    if (!link) {
      await client.query('ROLLBACK')
      return { code: 'not_found' }
    }

    const memberResult = await client.query(
      'SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2',
      [link.group_id, userId]
    )
    if (memberResult.rowCount > 0) {
      await client.query('ROLLBACK')
      return { code: 'already_member', groupId: link.group_id }
    }

    const problem = getLinkProblem(link)
    if (problem) {
      await client.query('ROLLBACK')
      return { code: 'invalid', message: problem }
    }

    await client.query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'member')`,
      [link.group_id, userId]
    )
    await client.query(
      'UPDATE share_links SET use_count = use_count + 1 WHERE id = $1',
      [link.id]
    )

    await client.query('COMMIT')
    return { code: 'joined', groupId: link.group_id }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// ---- Katselulistan jakolinkit ----

const findWatchlistLink = async (userId) => {
  const result = await pool.query(
    `SELECT token, created_at
     FROM share_links
     WHERE created_by = $1
       AND link_type = 'watchlist'
       AND revoked = false
       AND (expires_at IS NULL OR expires_at > now())
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  )
  return result.rows[0] || null
}

const createWatchlistLink = async (userId) => {
  const result = await pool.query(
    `INSERT INTO share_links (link_type, created_by)
     VALUES ('watchlist', $1)
     RETURNING token, created_at`,
    [userId]
  )
  return result.rows[0]
}

const revokeWatchlistLinks = async (userId) => {
  const result = await pool.query(
    `UPDATE share_links
     SET revoked = true
     WHERE created_by = $1
       AND link_type = 'watchlist'
       AND revoked = false`,
    [userId]
  )
  return result.rowCount > 0
}

const findWatchlistOwnerByToken = async (token) => {
  const result = await pool.query(
    `SELECT u.id, u.display_name
     FROM share_links s
     JOIN users u ON u.id = s.created_by
     WHERE s.token = $1
       AND s.link_type = 'watchlist'
       AND s.revoked = false
       AND (s.expires_at IS NULL OR s.expires_at > now())`,
    [token]
  )
  return result.rows[0] || null
}

export {
  // ryhmien kutsulinkit
  getLinkProblem,
  createGroupInviteLink,
  listGroupInviteLinks,
  revokeGroupInviteLink,
  getInviteByToken,
  joinViaInvite,
  // katselulistan jakolinkit
  findWatchlistLink,
  createWatchlistLink,
  revokeWatchlistLinks,
  findWatchlistOwnerByToken
}