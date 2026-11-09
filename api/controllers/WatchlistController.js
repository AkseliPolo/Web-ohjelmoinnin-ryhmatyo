import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist
} from '../models/Watchlist.js'
import { ensureMovie } from '../services/movieCache.js'

const httpError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

const parseId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw httpError(400, 'Virheellinen id')
  return id
}

const getMyWatchlist = async (req, res, next) => {
  try {
    res.status(200).json(await getWatchlist(req.user.id))
  } catch (err) {
    next(err)
  }
}

const checkWatchlist = async (req, res, next) => {
  try {
    const inWatchlist = await isInWatchlist(req.user.id, parseId(req.params.tmdbId))
    res.status(200).json({ inWatchlist })
  } catch (err) {
    next(err)
  }
}

const addMovie = async (req, res, next) => {
  try {
    const tmdbId = parseId(req.params.tmdbId)
    const movieId = await ensureMovie(tmdbId)
    const item = await addToWatchlist(req.user.id, movieId)
    res.status(201).json({ ...item, tmdb_id: tmdbId })
  } catch (err) {
    next(err)
  }
}

const removeMovie = async (req, res, next) => {
  try {
    const removed = await removeFromWatchlist(req.user.id, parseId(req.params.tmdbId))
    if (!removed) throw httpError(404, 'Elokuva ei ole katselulistallasi')
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

export { getMyWatchlist, checkWatchlist, addMovie, removeMovie }
