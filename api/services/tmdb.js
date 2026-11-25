import axios from 'axios'

const TMDB_URL = 'https://api.themoviedb.org/3'
const IMAGE_URL = 'https://image.tmdb.org/t/p/w342'
const BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280'

const SORTS = {
  newest: 'primary_release_date.desc',
  oldest: 'primary_release_date.asc'
}

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

const toPageResult = (data) => ({
  page: data.page,
  totalPages: Math.min(data.total_pages, 500),
  results: data.results.map(toMovie)
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

const searchMovies = async (query, page, year) => {
  const data = await getListWithTitles('/search/movie', {
    query,
    page,
    primary_release_year: year
  })
  return toPageResult(data)
}

const today = () => new Date().toISOString().slice(0, 10)

const releaseDateRange = (yearFrom, yearTo) => {
  const now = today()
  const end = yearTo ? `${yearTo}-12-31` : now
  return {
    'primary_release_date.gte': yearFrom ? `${yearFrom}-01-01` : undefined,
    'primary_release_date.lte': end < now ? end : now
  }
}

const discoverMovies = async ({ genre, year, yearFrom, yearTo, cast, crew, minRating, sort, page }) => {
  const data = await getListWithTitles('/discover/movie', {
    with_genres: genre,
    with_cast: cast,
    with_crew: crew,
    'vote_average.gte': minRating,
    primary_release_year: year,
    sort_by: SORTS[sort],
    page,
    ...releaseDateRange(yearFrom, yearTo),
    'vote_count.gte': 50
  })
  return toPageResult(data)
}

const PROFILE_URL = 'https://image.tmdb.org/t/p/w185'

const searchPeople = async (query) => {
  const data = await tmdbGet('/search/person', { query })
  return data.results.slice(0, 8).map((person) => ({
    id: person.id,
    name: person.name,
    department: person.known_for_department,
    profileUrl: person.profile_path ? `${PROFILE_URL}${person.profile_path}` : null
  }))
}

const getGenres = async () => {
  const data = await tmdbGet('/genre/movie/list', {})
  return data.genres
}

const findTrailer = (videos) => {
  const trailer = videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
  return trailer ? trailer.key : null
}

const getMovieDetails = async (id) => {
  const movie = await tmdbGet(`/movie/${id}`, {
    append_to_response: 'videos',
    include_video_language: 'fi,en'
  })
  if (hasNoFinnishTitle(movie)) {
    const english = await tmdbGet(`/movie/${id}`, { language: 'en-US' })
    movie.title = english.title
  }
  return {
    ...toMovie(movie),
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name),
    trailerKey: findTrailer(movie.videos.results),
    backdropUrl: movie.backdrop_path ? `${BACKDROP_URL}${movie.backdrop_path}` : null
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

const getRecommendations = async (id) => {
  const recommended = await getListWithTitles(`/movie/${id}/recommendations`, {})
  if (recommended.results.length > 0) {
    return { source: 'recommendations', results: recommended.results.slice(0, 20).map(toMovie) }
  }
  const similar = await getListWithTitles(`/movie/${id}/similar`, {})
  return { source: 'similar', results: similar.results.slice(0, 20).map(toMovie) }
}

const getPopularMovies = async () => {
  const data = await getListWithTitles('/movie/popular', {})
  return data.results.slice(0, 10).map(toMovie)
}

const getLatestMovies = async () => {
  const data = await getListWithTitles('/movie/now_playing', { region: 'FI' })
  return data.results
    .filter((movie) => movie.release_date)
    .sort((a, b) => b.release_date.localeCompare(a.release_date))
    .slice(0, 10)
    .map((movie) => ({ ...toMovie(movie), releaseDate: movie.release_date }))
}

const getPopularPeople = async () => {
  const data = await tmdbGet('/person/popular', {})
  return data.results
    .filter((person) => person.known_for_department === 'Acting')
    .slice(0, 10)
    .map((person) => ({
      id: person.id,
      name: person.name,
      profileUrl: person.profile_path ? `${PROFILE_URL}${person.profile_path}` : null,
      knownFor: (person.known_for || []).map((work) => work.title || work.name).filter(Boolean).slice(0, 3)
    }))
}

export {
  searchMovies,
  discoverMovies,
  getGenres,
  getMovieDetails,
  getFeaturedMovies,
  searchPeople,
  getRecommendations,
  getPopularMovies,
  getLatestMovies,
  getPopularPeople
}