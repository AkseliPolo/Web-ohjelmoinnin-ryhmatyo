import { pool } from './db.js'

const createGroup = async (userId, name, description) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const groupResult = await client.query(
      `INSERT INTO groups (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, created_by, created_at`,
      [name, description, userId]
    )
    const group = groupResult.rows[0]
    await client.query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [group.id, userId]
    )
    await client.query('COMMIT')
    return group
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getGroupById = async (groupId, viewerId) => {
  const result = await pool.query(
    `SELECT g.id, g.name, g.description, g.created_at,
            u.id AS creator_id, u.username AS creator_username,
            u.display_name AS creator_display_name,
            (SELECT COUNT(*) FROM group_members WHERE group_id = g.id)::int AS member_count,
            me.role AS my_role,
            EXISTS (
              SELECT 1 FROM group_join_requests r
              WHERE r.group_id = g.id AND r.user_id = $2 AND r.status = 'pending'
            ) AS has_pending_request
     FROM groups g
     LEFT JOIN users u ON u.id = g.created_by
     LEFT JOIN group_members me ON me.group_id = g.id AND me.user_id = $2
     WHERE g.id = $1`,
    [groupId, viewerId]
  )
  return result.rows[0]
}

const groupExists = async (groupId) => {
  const result = await pool.query('SELECT 1 FROM groups WHERE id = $1', [groupId])
  return result.rowCount > 0
}

const listGroups = async (viewerId, { onlyMine, search, limit, offset }) => {
  const result = await pool.query(
    `SELECT g.id, g.name, g.description, g.created_at,
            (SELECT COUNT(*) FROM group_members WHERE group_id = g.id)::int AS member_count,
            me.role AS my_role,
            EXISTS (
              SELECT 1 FROM group_join_requests r
              WHERE r.group_id = g.id AND r.user_id = $1 AND r.status = 'pending'
            ) AS has_pending_request
     FROM groups g
     LEFT JOIN group_members me ON me.group_id = g.id AND me.user_id = $1
     WHERE ($2::boolean = false OR me.role IS NOT NULL)
       AND ($3::text IS NULL OR g.name ILIKE '%' || $3 || '%')
     ORDER BY g.created_at DESC, g.id DESC
     LIMIT $4 OFFSET $5`,
    [viewerId, onlyMine, search, limit, offset]
  )
  return result.rows
}

export { createGroup, getGroupById, groupExists, listGroups }
