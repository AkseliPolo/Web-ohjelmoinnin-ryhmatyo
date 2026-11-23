import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import './search.css'

const API_URL = import.meta.env.VITE_API_URL || ''


function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInput(query)
  }, [query])

  useEffect(() => {
    if (!query) {
      setMovies([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`${API_URL}/api/movies/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [query])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <div>
      <form className="d-flex gap-2 mb-4" onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="search"
          placeholder="Hae elokuvaa nimellä"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoFocus
        />
        <button className="btn btn-dark" type="submit">Hae</button>
      </form>

      {query && <h1 className="h4 mb-4">Hakutulokset: "{query}"</h1>}

      {loading && <p>Haetaan...</p>}

      {query && !loading && movies.length === 0 && (
        <p>Hakusanalla ei löytynyt elokuvia.</p>
      )}

      <div className="search-grid">
        {movies.map((movie) => (
          <div className="search-item" key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.posterUrl && (
                <img src={movie.posterUrl} alt={movie.title} />
              )}
              <p className="search-title">{movie.title}</p>
            </Link>
            <small>{movie.year}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage