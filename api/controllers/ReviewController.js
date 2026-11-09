import {
  getReviewsByTmdbId,
  upsertReview,
  updateReview,
  deleteReview
} from '../models/Review.js'
import { ensureMovie } from '../services/movieCache.js'

const httpError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

const validRating = (rating) =>
  Number.isInteger(rating) && rating >= 1 && rating <= 5

// Muuttaa reitin id:n kokonaisluvuksi, virheellinen id antaa 400 eikä kaada kyselyä
const parseId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw httpError(400, 'Virheellinen id')
  return id
}

// GET /api/reviews/movie/:movieId  (movieId = TMDB:n elokuva-id)
const getMovieReviews = async (req, res, next) => {
  try {
    const reviews = await getReviewsByTmdbId(parseId(req.params.movieId))
    res.status(200).json(reviews)
  } catch (err) {
    next(err)
  }
}

// POST /api/reviews/movie/:movieId  (movieId = TMDB:n elokuva-id)
// Lisää arvostelun tai päivittää kirjautuneen käyttäjän vanhan arvostelun
const saveReview = async (req, res, next) => {
  try {
    const tmdbId = parseId(req.params.movieId)
    const { rating, body } = req.body || {}
    if (!validRating(rating)) {
      throw httpError(400, 'Arvosanan pitää olla kokonaisluku 1–5')
    }

    const movieId = await ensureMovie(tmdbId)
    const review = await upsertReview(req.user.id, movieId, rating, body || null)
    res.status(201).json({ ...review, tmdb_id: tmdbId })
  } catch (err) {
    next(err)
  }
}

const editReview = async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
    const { rating, body } = req.body || {}
    if (!validRating(rating)) {
      throw httpError(400, 'Arvosanan pitää olla kokonaisluku 1–5')
    }

    const review = await updateReview(id, req.user.id, rating, body || null)
    if (!review) throw httpError(404, 'Arvostelua ei löytynyt tai se ei ole sinun')
    res.status(200).json(review)
  } catch (err) {
    next(err)
  }
}

const removeReview = async (req, res, next) => {
  try {
    const id = parseId(req.params.id)
    const deleted = await deleteReview(id, req.user.id)
    if (!deleted) throw httpError(404, 'Arvostelua ei löytynyt tai se ei ole sinun')
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

export { getMovieReviews, saveReview, editReview, removeReview }
