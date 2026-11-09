import { getMovieDetails } from './tmdb.js'
import { findMovieIdByTmdbId, saveMovie } from '../models/Movie.js'

const httpError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

// Muuntaa TMDB-palvelun vastauksen movies-taulun riviksi.
// Jos tmdb.js palauttaa kentät eri nimillä, muuta nämä rivit.
const toMovieRow = (tmdbId, details) => {
  const title = details?.title ?? details?.name
  if (!title) throw httpError(502, 'Elokuvan tietoja ei saatu TMDB:stä')

  const date = details.release_date ?? details.releaseDate ?? ''
  const year = Number(String(date).slice(0, 4)) || details.release_year || details.year || null

  return {
    tmdbId,
    title,
    releaseYear: Number.isInteger(year) ? year : null,
    posterPath: details.poster_path ?? details.posterPath ?? null
  }
}

// Palauttaa elokuvan oman id:n ja tallentaa elokuvan ensin tietokantaan, jos sitä ei vielä ole.
// Käytetään sekä arvosteluissa että katselulistassa.
const ensureMovie = async (tmdbId) => {
  const existingId = await findMovieIdByTmdbId(tmdbId)
  if (existingId) return existingId

  const details = await getMovieDetails(String(tmdbId))
  return saveMovie(toMovieRow(tmdbId, details))
}

export { ensureMovie }
