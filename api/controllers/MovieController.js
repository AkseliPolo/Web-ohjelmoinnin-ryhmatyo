import { getFeaturedMovies, getMovieDetails, searchMovies } from '../services/tmdb.js'

const badRequest = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

const parsePage = (value = 1) => {
  const page = Number(value)
  if (!Number.isInteger(page) || page < 1 || page > 500) throw badRequest('Sivunumero on virheellinen')
  return page
}

const search = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim()
    if (!query) throw badRequest('Hakusana puuttuu')
    res.status(200).json(await searchMovies(query, parsePage(req.query.page)))
  } catch (error) {
    next(error)
  }
}

const getMovie = async (req, res, next) => {
  try {
    if (!/^[1-9]\d*$/.test(req.params.id)) throw badRequest('Elokuvan tunniste on virheellinen')
    res.status(200).json(await getMovieDetails(req.params.id))
  } catch (error) {
    next(error)
  }
}

const featured = async (req, res, next) => {
  try {
    res.status(200).json(await getFeaturedMovies(5))
  } catch (error) {
    next(error)
  }
}

export { search, getMovie, featured }
