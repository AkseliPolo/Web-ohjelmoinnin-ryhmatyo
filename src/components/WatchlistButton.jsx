import { Link } from 'react-router-dom'
import { useWatchlist } from './useWatchlist'
import './watchlist.css'

function WatchlistButton({ movieId }) {
  const { user, loading, busy, error, has, add, remove } = useWatchlist()

  if (!user) {
    return (
      <Link className="btn btn-outline-light watchlist-toggle" to="/login">
        + Lisää katselulistalle
      </Link>
    )
  }

  const inList = has(movieId)

  return (
    <div className="watchlist-toggle-wrap">
      <button
        type="button"
        className={`btn watchlist-toggle${inList ? ' is-on' : ''}`}
        aria-pressed={inList}
        disabled={loading || busy}
        onClick={() => (inList ? remove(movieId) : add(movieId))}
      >
        {inList ? '✓ Katselulistalla' : '+ Lisää katselulistalle'}
      </button>
      {error && <small className="text-danger d-block mt-1" role="alert">{error}</small>}
    </div>
  )
}

export default WatchlistButton