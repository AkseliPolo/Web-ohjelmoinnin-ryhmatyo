import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist, itemMovieId } from '../components/useWatchlist'
import '../components/watchlist.css'

const API_URL = import.meta.env.VITE_API_URL || ''

// Hakee yhden elokuvan tiedot (lista tallentaa vain elokuvan id:n)
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
    </div>
  )
}

function WatchlistPage() {
  const { user, items, loading, busy, error, remove } = useWatchlist()

  if (!user) {
    return (
      <div>
        <h1 className="h4 mb-3">Katselulista</h1>
        <p>Kirjaudu sisään nähdäksesi katselulistasi.</p>
        <Link className="btn btn-outline-light" to="/login">Kirjaudu sisään</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="h4 mb-4">
        Katselulista {items.length > 0 && <span className="text-secondary">({items.length})</span>}
      </h1>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading && <p>Ladataan...</p>}

      {!loading && !error && items.length === 0 && (
        <p>
          Katselulistasi on tyhjä. <Link to="/browse">Selaa elokuvia</Link> ja lisää ensimmäinen.
        </p>
      )}

      <div className="watchlist-grid">
        {items.map((item) => (
          <WatchlistCard
            key={itemMovieId(item)}
            movieId={itemMovieId(item)}
            onRemove={remove}
            disabled={busy}
          />
        ))}
      </div>
    </div>
  )
}

export default WatchlistPage