import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './featured.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function FeaturedMovies() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/movies/featured`)
      .then((response) => response.json())
      .then((data) => setMovies(data))
  }, [])

  return (
    <div>
      <h2 className="h4 mb-3 text-center">Suositeltuja elokuvia</h2>
      <div className="featured-grid">
        {movies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            className="featured-item"
            key={movie.id}
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
