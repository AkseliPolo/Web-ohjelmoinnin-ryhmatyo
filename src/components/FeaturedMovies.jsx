import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './featured.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function FeaturedMovies() {
  const [movies, setMovies] = useState([])
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/movies/featured`)
      .then((response) => response.json())
      .then((data) => setMovies(data))
  }, [])

  const activeId = hoveredId ?? movies[0]?.id

  return (
    <div className="featured">
      <div className="featured-glow" aria-hidden="true">
        {movies.map((movie) => (
          <img
            key={movie.id}
            src={movie.backdropUrl}
            alt=""
            className={movie.id === activeId ? 'active' : ''}
          />
        ))}
      </div>

      <h2 className="h4 mb-3 text-center">Suositeltuja elokuvia</h2>
      <div className="featured-grid">
        {movies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            className="featured-item"
            key={movie.id}
            onMouseEnter={() => setHoveredId(movie.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img src={movie.backdropUrl} alt={movie.title} />
            <p className="featured-title">{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FeaturedMovies