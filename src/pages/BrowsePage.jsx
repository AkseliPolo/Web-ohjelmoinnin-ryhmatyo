import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PersonPicker from '../components/PersonPicker'
import './search.css'
import './browse.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const TMDB_PAGES_PER_PAGE = 3
const MAX_PAGES = Math.floor(500 / TMDB_PAGES_PER_PAGE)

const MAX_YEAR = new Date().getFullYear()

const EMPTY_FILTERS = {
  q: '',
  genre: '',
  cast: '',
  castName: '',
  crew: '',
  crewName: '',
  yearFrom: '',
  yearTo: '',
  minRating: '',
  sort: 'newest'
}

const DISCOVER_KEYS = ['genre', 'cast', 'crew', 'yearFrom', 'yearTo', 'minRating', 'sort']

const countAdvanced = (filters) =>
  [filters.cast, filters.crew, filters.yearFrom || filters.yearTo, filters.minRating]
    .filter(Boolean).length

const readFilters = (searchParams) => {
  const filters = { ...EMPTY_FILTERS }
  Object.keys(filters).forEach((key) => {
    filters[key] = searchParams.get(key) || EMPTY_FILTERS[key]
  })
  return filters
}

const toUrlParams = (form) => {
  const name = form.q.trim()
  if (name) return { q: name }

  const params = {}
  Object.entries(form).forEach(([key, value]) => {
    if (key !== 'q' && value && !(key === 'sort' && value === 'newest')) {
      params[key] = value
    }
  })
  return params
}

const buildRequest = (filters) => {
  const params = new URLSearchParams()
  if (filters.q) {
    params.set('q', filters.q)
    return { endpoint: 'search', params }
  }
  DISCOVER_KEYS.forEach((key) => {
    if (filters[key]) params.set(key, filters[key])
  })
  return { endpoint: 'discover', params }
}

const fetchJson = async (url) => {
  const response = await fetch(url)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Haku epäonnistui')
  return data
}

const pageNumbers = (current, total) => {
  const pages = []
  for (let page = 1; page <= total; page++) {
    const nearCurrent = Math.abs(page - current) <= 2
    if (page === 1 || page === total || nearCurrent) {
      pages.push(page)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }
  return pages
}

function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramsKey = searchParams.toString()
  const page = Number(searchParams.get('page')) || 1

  const [form, setForm] = useState(() => readFilters(searchParams))
  const [showMore, setShowMore] = useState(() => countAdvanced(readFilters(searchParams)) > 0)

  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const nameSearch = Boolean(form.q.trim())
  const advancedCount = countAdvanced(form)

  useEffect(() => {
    setForm(readFilters(new URLSearchParams(paramsKey)))
  }, [paramsKey])

  useEffect(() => {
    fetch(`${API_URL}/api/movies/genres`)
      .then((response) => response.json())
      .then((data) => setGenres(Array.isArray(data) ? data : []))
      .catch(() => setGenres([]))
  }, [])

  useEffect(() => {
    const currentParams = new URLSearchParams(paramsKey)
    const currentPage = Number(currentParams.get('page')) || 1
    const { endpoint, params } = buildRequest(readFilters(currentParams))

    const firstTmdbPage = (currentPage - 1) * TMDB_PAGES_PER_PAGE + 1
    const requests = []
    for (let i = 0; i < TMDB_PAGES_PER_PAGE; i++) {
      params.set('page', firstTmdbPage + i)
      requests.push(fetchJson(`${API_URL}/api/movies/${endpoint}?${params}`))
    }

    let active = true
    setLoading(true)
    setError('')
    Promise.all(requests)
      .then((pages) => {
        if (!active) return
        const seen = new Set()
        const results = pages
          .flatMap((data) => data.results)
          .filter((movie) => !seen.has(movie.id) && seen.add(movie.id))
        const tmdbTotal = pages[0].totalPages || 1
        setMovies(results)
        setTotalPages(Math.min(Math.ceil(tmdbTotal / TMDB_PAGES_PER_PAGE), MAX_PAGES))
      })
      .catch((err) => {
        if (!active) return
        setMovies([])
        setTotalPages(1)
        setError(err.message || 'Palvelimeen ei saatu yhteyttä')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [paramsKey])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const selectPerson = (field) => (person) => {
    setForm({
      ...form,
      [field]: person ? String(person.id) : '',
      [`${field}Name`]: person ? person.name : ''
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSearchParams(toUrlParams(form))
  }

  const handleClear = () => {
    setForm(EMPTY_FILTERS)
    setSearchParams({})
  }

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <h1 className="h4 mb-3">Selaa elokuvia</h1>

      <form className="browse-filters" onSubmit={handleSubmit}>
        <div className="browse-main">
          <input
            className="form-control browse-name"
            type="search"
            name="q"
            placeholder="Hae nimellä"
            aria-label="Elokuvan nimi"
            value={form.q}
            onChange={handleChange}
          />

          <select
            className="form-control browse-select"
            name="genre"
            aria-label="Genre"
            value={form.genre}
            onChange={handleChange}
            disabled={nameSearch}
          >
            <option value="">Kaikki genret</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <select
            className="form-control browse-select"
            name="sort"
            aria-label="Järjestys"
            value={form.sort}
            onChange={handleChange}
            disabled={nameSearch}
          >
            <option value="newest">Uusimmat ensin</option>
            <option value="oldest">Vanhimmat ensin</option>
          </select>

          <div className="browse-actions">
            <button
              className="btn btn-outline-secondary"
              type="button"
              aria-expanded={showMore}
              aria-controls="browse-more"
              onClick={() => setShowMore(!showMore)}
            >
              Lisää suodattimia{advancedCount > 0 && ` (${advancedCount})`}
              <span className="browse-chevron" aria-hidden="true">{showMore ? '▴' : '▾'}</span>
            </button>
            <button className="btn btn-link browse-clear" type="button" onClick={handleClear}>
              Tyhjennä
            </button>
            <button className="btn browse-submit" type="submit">Hae</button>
          </div>
        </div>

        {showMore && (
          <div className="browse-more" id="browse-more">
            <PersonPicker
              placeholder="Näyttelijä"
              personName={form.castName}
              onSelect={selectPerson('cast')}
              disabled={nameSearch}
            />

            <PersonPicker
              placeholder="Ohjaaja / tekijä"
              personName={form.crewName}
              onSelect={selectPerson('crew')}
              disabled={nameSearch}
            />

            <div className={`form-control browse-years${nameSearch ? ' is-disabled' : ''}`}>
              <input
                type="number"
                name="yearFrom"
                placeholder="Vuodesta"
                aria-label="Julkaistu vuodesta"
                min="1900"
                max={MAX_YEAR}
                value={form.yearFrom}
                onChange={handleChange}
                disabled={nameSearch}
              />
              <span aria-hidden="true">–</span>
              <input
                type="number"
                name="yearTo"
                placeholder="Vuoteen"
                aria-label="Julkaistu vuoteen"
                min="1900"
                max={MAX_YEAR}
                value={form.yearTo}
                onChange={handleChange}
                disabled={nameSearch}
              />
            </div>

            <select
              className="form-control browse-select"
              name="minRating"
              aria-label="Vähimmäisarvosana"
              value={form.minRating}
              onChange={handleChange}
              disabled={nameSearch}
            >
              <option value="">Kaikki arvosanat</option>
              <option value="5">Arvosana 5+</option>
              <option value="6">Arvosana 6+</option>
              <option value="7">Arvosana 7+</option>
              <option value="8">Arvosana 8+</option>
            </select>
          </div>
        )}
      </form>

      {nameSearch && (
        <p className="browse-hint">Nimellä haettaessa muut suodattimet eivät ole käytössä.</p>
      )}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading ? (
        <p>Haetaan...</p>
      ) : (
        <>
          {!error && movies.length === 0 && <p>Elokuvia ei löytynyt.</p>}

          <div className="browse-grid">
            {movies.map((movie) => (
              <div className="search-item" key={movie.id}>
                <Link to={`/movies/${movie.id}`}>
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} />
                  ) : (
                    <div className="browse-no-poster">Ei kuvaa</div>
                  )}
                  <p className="search-title">{movie.title}</p>
                </Link>
                <small>{movie.year}</small>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <nav className="browse-pagination" aria-label="Sivut">
          <button
            className="btn btn-outline-dark"
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => goToPage(page - 1)}
          >
            Edellinen
          </button>

          {pageNumbers(page, totalPages).map((item, index) =>
            item === '...' ? (
              <span key={`dots-${index}`} className="browse-dots">…</span>
            ) : (
              <button
                key={item}
                type="button"
                className={item === page ? 'btn btn-dark' : 'btn btn-outline-dark'}
                aria-current={item === page ? 'page' : undefined}
                disabled={loading}
                onClick={() => goToPage(item)}
              >
                {item}
              </button>
            )
          )}

          <button
            className="btn btn-outline-dark"
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => goToPage(page + 1)}
          >
            Seuraava
          </button>
        </nav>
      )}
    </div>
  )
}

export default BrowsePage
