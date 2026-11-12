import { pool } from './db.js'

const getMemberRole = async (groupId, userId) => {
  const result = await pool.query(
    'SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2',
    [groupId, userId]
  )
  return result.rows[0]?.role
}

const getMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT u.id AS user_id, u.username, u.display_name, gm.role, gm.joined_at
     FROM group_members gm
     JOIN users u ON u.id = gm.user_id
     WHERE gm.group_id = $1
     ORDER BY (gm.role = 'admin') DESC, gm.joined_at ASC`,
    [groupId]
  )
  return result.rows
}

const leaveGroup = async (groupId, userId) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const own = await client.query(
      `SELECT role FROM group_members
       WHERE group_id = $1 AND user_id = $2
       FOR UPDATE`,
      [groupId, userId]
    )
    if (own.rowCount === 0) {
      await client.query('ROLLBACK')
      return 'not_member'
    }

    const counts = await client.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE role = 'admin')::int AS admins
       FROM group_members
       WHERE group_id = $1`,
      [groupId]
    )
    const { total, admins } = counts.rows[0]
    const isAdmin = own.rows[0].role === 'admin'

    if (isAdmin && admins === 1 && total > 1) {
      await client.query('ROLLBACK')
      return 'last_admin'
    }

    if (total === 1) {
      await client.query('DELETE FROM groups WHERE id = $1', [groupId])
      await client.query('COMMIT')
      return 'group_deleted'
    }

    await client.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    )
    await client.query('COMMIT')
    return 'left'
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export { getMemberRole, getMembers, leaveGroup }
