import { pool } from './db.js'

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

export { findWatchlistLink, createWatchlistLink, revokeWatchlistLinks, findWatchlistOwnerByToken }
