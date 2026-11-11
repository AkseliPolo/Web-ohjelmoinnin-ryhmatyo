import {
  discoverMovies,
  getFeaturedMovies,
  getGenres,
  getMovieDetails,
  searchMovies
} from '../services/tmdb.js'

const badRequest = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

const isMissing = (value) => value === undefined || value === ''

const isIntBetween = (value, min, max) =>
  Number.isInteger(value) && value >= min && value <= max

const parseOptionalInt = (value, min, max, message) => {
  if (isMissing(value)) return undefined
  const number = Number(value)
  if (!isIntBetween(number, min, max)) throw badRequest(message)
  return number
}

const parsePage = (value = 1) => {
  const page = Number(value)
  if (!isIntBetween(page, 1, 500)) throw badRequest('Sivunumero on virheellinen')
  return page
}

const parseYear = (value) =>
  parseOptionalInt(value, 1900, new Date().getFullYear() + 1, 'Vuosi on virheellinen')

const parseGenre = (value) =>
  parseOptionalInt(value, 1, 1000000, 'Genre on virheellinen')

const parseSort = (value = 'newest') => {
  if (value !== 'newest' && value !== 'oldest') {
    throw badRequest('Järjestys on virheellinen, käytä newest tai oldest')
  }
  return value
}

const search = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim()
    if (!query) throw badRequest('Hakusana puuttuu')
    const page = parsePage(req.query.page)
    const year = parseYear(req.query.year)
    res.status(200).json(await searchMovies(query, page, year))
  } catch (error) {
    next(error)
  }
}

const discover = async (req, res, next) => {
  try {
    const options = {
      genre: parseGenre(req.query.genre),
      year: parseYear(req.query.year),
      sort: parseSort(req.query.sort),
      page: parsePage(req.query.page)
    }
    res.status(200).json(await discoverMovies(options))
  } catch (error) {
    next(error)
  }
}

const genres = async (req, res, next) => {
  try {
    res.status(200).json(await getGenres())
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

export { search, discover, genres, getMovie, featured }