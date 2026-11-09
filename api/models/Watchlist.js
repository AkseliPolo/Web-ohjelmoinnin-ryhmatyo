import { pool } from './db.js'

// Käyttäjän katselulista elokuvien tietoineen (uusin ensin)
const getWatchlist = async (userId) => {
  const result = await pool.query(
    `SELECT m.id, m.tmdb_id, m.title, m.release_year, m.poster_path, w.added_at
     FROM watchlist_items w
     JOIN movies m ON m.id = w.movie_id
     WHERE w.user_id = $1
     ORDER BY w.added_at DESC`,
    [userId]
  )
  return result.rows
}

// Lisää elokuvan listalle. Jos se on jo listalla, mitään ei muuteta (added_at säilyy).
const addToWatchlist = async (userId, movieId) => {
  const result = await pool.query(
    `INSERT INTO watchlist_items (user_id, movie_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, movie_id)
     DO UPDATE SET added_at = watchlist_items.added_at
     RETURNING user_id, movie_id, added_at`,
    [userId, movieId]
  )
  return result.rows[0]
}

// Poistaa elokuvan listalta TMDB:n id:llä. Palauttaa true, jos jotain poistettiin.
const removeFromWatchlist = async (userId, tmdbId) => {
  const result = await pool.query(
    `DELETE FROM watchlist_items
     WHERE user_id = $1
       AND movie_id = (SELECT id FROM movies WHERE tmdb_id = $2)`,
    [userId, tmdbId]
  )
  return result.rowCount > 0
}

// Onko elokuva käyttäjän listalla? (TMDB:n id:llä)
const isInWatchlist = async (userId, tmdbId) => {
  const result = await pool.query(
    `SELECT 1
     FROM watchlist_items w
     JOIN movies m ON m.id = w.movie_id
     WHERE w.user_id = $1 AND m.tmdb_id = $2`,
    [userId, tmdbId]
  )
  return result.rowCount > 0
}

export { getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }
