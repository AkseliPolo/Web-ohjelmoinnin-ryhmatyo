import { pool } from './db.js'

// Etsii elokuvan movies-taulusta TMDB:n id:llä (palauttaa oman id:n tai undefined)
const findMovieIdByTmdbId = async (tmdbId) => {
  const result = await pool.query('SELECT id FROM movies WHERE tmdb_id = $1', [tmdbId])
  return result.rows[0]?.id
}

// Tallentaa elokuvan välimuistiksi movies-tauluun (tai päivittää sen) ja palauttaa oman id:n
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

export { findMovieIdByTmdbId, saveMovie }
