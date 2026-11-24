import { Link } from 'react-router-dom'
import { useWatchlist, itemMovieId } from '../components/useWatchlist'
import WatchlistCard from '../components/WatchlistCard'
import WatchlistShare from '../components/WatchlistShare'
import '../components/watchlist.css'

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

      <WatchlistShare />

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