import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './watchlist.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function WatchlistCard({ movieId, onRemove, disabled }) {
  const [movie, setMovie] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`${API_URL}/api/movies/${movieId}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Haku epäonnistui'))))
      .then((data) => {
        if (active) setMovie(data)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [movieId])

  const poster = movie?.posterUrl ? (
    <img src={movie.posterUrl} alt={movie.title} />
  ) : (
    <div className="watchlist-no-poster">{failed ? 'Ei saatavilla' : 'Ladataan...'}</div>
  )

  return (
    <div className="watchlist-card">
      <Link to={`/movies/${movieId}`}>
        {poster}
        <p className="watchlist-title">{movie?.title || (failed ? 'Elokuvan tietoja ei saatu' : '')}</p>
      </Link>
      {movie?.year && <small>{movie.year}</small>}
      {onRemove && (
        <div>
          <button
            type="button"
            className="btn btn-link watchlist-remove"
            disabled={disabled}
            onClick={() => onRemove(movieId)}
          >
            Poista listalta
          </button>
        </div>
      )}
    </div>
  )
}

export default WatchlistCard
