import { useEffect, useState } from 'react'
import './featured.css'

function FeaturedMovies() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch('/api/movies/featured')
      .then((response) => response.json())
      .then((data) => setMovies(data))
  }, [])

  return (
    <div>
      <h2 className="h4 mb-3 text-center">Suositeltuja elokuvia</h2>
      <div className="featured-grid">
        {movies.map((movie) => (
          <div className="featured-item" key={movie.id}>
            <img src={movie.backdropUrl} alt={movie.title} />
            <p className="featured-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedMovies
