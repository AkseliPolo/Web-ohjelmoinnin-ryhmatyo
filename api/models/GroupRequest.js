import { pool } from './db.js'

const createRequest = async (groupId, userId) => {
  const result = await pool.query(
    `INSERT INTO group_join_requests (group_id, user_id)
     VALUES ($1, $2)
     RETURNING id, group_id, user_id, status, created_at`,
    [groupId, userId]
  )
  return result.rows[0]
}

const getPendingRequests = async (groupId) => {
  const result = await pool.query(
    `SELECT r.id, r.status, r.created_at,
            u.id AS user_id, u.username, u.display_name
     FROM group_join_requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.group_id = $1 AND r.status = 'pending'
     ORDER BY r.created_at ASC`,
    [groupId]
  )
  return result.rows
}

const decideRequest = async (groupId, requestId, deciderId, status) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const result = await client.query(
      `UPDATE group_join_requests
       SET status = $1, decided_by = $2, decided_at = now()
       WHERE id = $3 AND group_id = $4 AND status = 'pending'
       RETURNING id, group_id, user_id, status, decided_by, decided_at, created_at`,
      [status, deciderId, requestId, groupId]
    )
    const request = result.rows[0]
    if (!request) {
      await client.query('ROLLBACK')
      return null
    }

    if (status === 'approved') {
      await client.query(
        `INSERT INTO group_members (group_id, user_id, role)
         VALUES ($1, $2, 'member')
         ON CONFLICT (group_id, user_id) DO NOTHING`,
        [groupId, request.user_id]
      )
    }

    await client.query('COMMIT')
    return request
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export { createRequest, getPendingRequests, decideRequest }
