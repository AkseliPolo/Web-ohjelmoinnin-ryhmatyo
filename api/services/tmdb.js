import axios from 'axios'

const TMDB_URL = 'https://api.themoviedb.org/3'
const IMAGE_URL = 'https://image.tmdb.org/t/p/w342'
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280'

const authOptions = () => {
  const key = process.env.TMDB_API_KEY
  if (!key) {
    const error = new Error('TMDB_API_KEY puuttuu .env-tiedostosta')
    error.status = 500
    throw error
  }
  if (key.startsWith('eyJ')) return { headers: { Authorization: `Bearer ${key}` }, params: {} }
  return { headers: {}, params: { api_key: key } }
}

const tmdbGet = async (path, params) => {
  const auth = authOptions()
  try {
    const response = await axios.get(`${TMDB_URL}${path}`, {
      headers: auth.headers,
      params: { language: 'fi-FI', ...params, ...auth.params }
    })
    return response.data
  } catch (error) {
    const notFound = error.response?.status === 404
    const apiError = new Error(notFound ? 'Elokuvaa ei löytynyt' : 'Elokuvatietoja ei saatu haettua')
    apiError.status = notFound ? 404 : 502
    throw apiError
  }
}

const toMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
  overview: movie.overview,
  posterUrl: movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null,
  rating: movie.vote_average
})

const hasNoFinnishTitle = (movie) =>
  movie.title === movie.original_title && movie.original_language !== 'en'

const getListWithTitles = async (path, params) => {
  const [data, english] = await Promise.all([
    tmdbGet(path, params),
    tmdbGet(path, { ...params, language: 'en-US' })
  ])
  const englishTitles = new Map(english.results.map((movie) => [movie.id, movie.title]))
  const results = data.results.map((movie) => (hasNoFinnishTitle(movie)
    ? { ...movie, title: englishTitles.get(movie.id) || movie.title }
    : movie))
  return { ...data, results }
}

const searchMovies = async (query, page) => {
  const data = await getListWithTitles('/search/movie', { query, page })
  return {
    page: data.page,
    totalPages: data.total_pages,
    results: data.results.map(toMovie)
  }
}

const getMovieDetails = async (id) => {
  const movie = await tmdbGet(`/movie/${id}`, {})
  if (hasNoFinnishTitle(movie)) {
    const english = await tmdbGet(`/movie/${id}`, { language: 'en-US' })
    movie.title = english.title
  }
  return {
    ...toMovie(movie),
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name)
  }
}

const shuffle = (items) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const getFeaturedMovies = async (count) => {
  const page = Math.floor(Math.random() * 10) + 1
  const data = await getListWithTitles('/movie/top_rated', { page })
  const withBackdrop = data.results.filter((movie) => movie.backdrop_path)
  return shuffle(withBackdrop).slice(0, count).map((movie) => ({
    ...toMovie(movie),
    backdropUrl: `${BACKDROP_URL}${movie.backdrop_path}`
  }))
}

export { searchMovies, getMovieDetails, getFeaturedMovies }
