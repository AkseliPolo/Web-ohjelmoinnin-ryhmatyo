import { pool } from './db.js'

const getReviewsByTmdbId = async (tmdbId) => {
  const result = await pool.query(
    `SELECT r.id, r.rating, r.body, r.created_at, r.updated_at,
            u.id AS user_id, u.username, u.display_name
     FROM reviews r
     JOIN movies m ON m.id = r.movie_id
     JOIN users u ON u.id = r.user_id
     WHERE m.tmdb_id = $1
     ORDER BY r.created_at DESC`,
    [tmdbId]
  )
  return result.rows
}

const upsertReview = async (userId, movieId, rating, body) => {
  const result = await pool.query(
    `INSERT INTO reviews (user_id, movie_id, rating, body)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, movie_id)
     DO UPDATE SET rating = EXCLUDED.rating,
                   body = EXCLUDED.body,
                   updated_at = now()
     RETURNING id, user_id, movie_id, rating, body, created_at, updated_at`,
    [userId, movieId, rating, body]
  )
  return result.rows[0]
}

const updateReview = async (id, userId, rating, body) => {
  const result = await pool.query(
    `UPDATE reviews
     SET rating = $1, body = $2, updated_at = now()
     WHERE id = $3 AND user_id = $4
     RETURNING id, user_id, movie_id, rating, body, created_at, updated_at`,
    [rating, body, id, userId]
  )
  return result.rows[0]
}

const deleteReview = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
    [id, userId]
  )
  return result.rowCount > 0
}

export { getReviewsByTmdbId, upsertReview, updateReview, deleteReview }
