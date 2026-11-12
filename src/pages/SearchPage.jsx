import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import './search.css'

const API_URL = import.meta.env.VITE_API_URL || ''


function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/api/movies/search?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results || [])
        setLoading(false)
      })
  }, [query])

  if (loading) {
    return <p>Haetaan...</p>
  }

  return (
    <div>
      <h1 className="h4 mb-4">Hakutulokset: "{query}"</h1>

      {movies.length === 0 && <p>Hakusanalla ei löytynyt elokuvia.</p>}

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
