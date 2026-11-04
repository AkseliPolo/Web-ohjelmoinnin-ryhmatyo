import { pool } from './db.js'

const createUser = async (username, displayName, email, passwordHash) => {
  const result = await pool.query(
    `INSERT INTO users (username, display_name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, display_name, email, created_at`,
    [username, displayName, email, passwordHash]
  )
  return result.rows[0]
}

export { createUser }
