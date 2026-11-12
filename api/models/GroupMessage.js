import { pool } from './db.js'

const getMessages = async (groupId, limit, beforeId) => {
  const result = await pool.query(
    `SELECT m.id, m.body, m.created_at,
            u.id AS user_id, u.username, u.display_name
     FROM group_messages m
     LEFT JOIN users u ON u.id = m.user_id
     WHERE m.group_id = $1
       AND ($2::bigint IS NULL OR m.id < $2)
     ORDER BY m.id DESC
     LIMIT $3`,
    [groupId, beforeId, limit]
  )
  return result.rows
}

const createMessage = async (groupId, userId, body) => {
  const result = await pool.query(
    `WITH m AS (
       INSERT INTO group_messages (group_id, user_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, body, created_at
     )
     SELECT m.id, m.body, m.created_at,
            u.id AS user_id, u.username, u.display_name
     FROM m
     JOIN users u ON u.id = m.user_id`,
    [groupId, userId, body]
  )
  return result.rows[0]
}

export { getMessages, createMessage }
