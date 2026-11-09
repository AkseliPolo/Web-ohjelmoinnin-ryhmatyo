import { pool } from './db.js'

<<<<<<< HEAD
const findMovieIdByTmdbId = async (tmdbId) => {
  const result = await pool.query('SELECT id FROM movies WHERE tmdb_id = $1', [tmdbId])
  return result.rows[0]?.id
}

const saveMovie = async ({ tmdbId, title, releaseYear, posterPath }) => {
  const result = await pool.query(
    `INSERT INTO movies (tmdb_id, title, release_year, poster_path)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (tmdb_id)
     DO UPDATE SET title = EXCLUDED.title,
                   release_year = EXCLUDED.release_year,
                   poster_path = EXCLUDED.poster_path,
                   cached_at = now()
     RETURNING id`,
    [tmdbId, title, releaseYear, posterPath]
  )
  return result.rows[0].id
}

=======
// Elokuvan arvostelut TMDB:n id:llä (jos elokuvaa ei ole tietokannassa, tulos on tyhjä lista)
>>>>>>> 3d13352695dc4b77f0e59c9637fd6f15f3fbd02c
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
