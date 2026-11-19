import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './similarMovies.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function SimilarMovies({ movieId }) {
  const [data, setData] = useState({ movieId: null, results: [] })

  useEffect(() => {
    let active = true
    fetch(`${API_URL}/api/movies/${movieId}/recommendations`)
      .then((response) => (response.ok ? response.json() : { results: [] }))
      .then((result) => {
        if (active) setData({ movieId, results: result.results || [] })
      })
      .catch(() => {
        if (active) setData({ movieId, results: [] })
      })
    return () => {
      active = false
    }
  }, [movieId])

  const movies = data.movieId === movieId ? data.results : []

  if (movies.length === 0) return null

  return (
    <section className="similar">
      <h2 className="h4 mb-3">Samankaltaisia elokuvia</h2>
      <div className="similar-row">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`} className="similar-item">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
            ) : (
              <div className="similar-no-poster">Ei kuvaa</div>
            )}
            <span className="similar-title">{movie.title}</span>
            {movie.year && <small className="similar-year">{movie.year}</small>}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SimilarMovies
