import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import WatchlistCard from '../components/WatchlistCard'
import '../components/watchlist.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function SharedWatchlistPage() {
  const { token } = useParams()
  const [state, setState] = useState({ token: null, data: null, error: '' })

  useEffect(() => {
    let active = true
    fetch(`${API_URL}/api/shared/watchlist/${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error?.message || 'Listan haku epäonnistui')
        return data
      })
      .then((data) => {
        if (active) setState({ token, data, error: '' })
      })
      .catch((err) => {
        if (active) setState({ token, data: null, error: err.message })
      })
    return () => {
      active = false
    }
  }, [token])

  if (state.token !== token) return <p>Ladataan...</p>

  if (state.error) {
    return (
      <div>
        <h1 className="h4 mb-3">Jaettu katselulista</h1>
        <div className="alert alert-danger" role="alert">{state.error}</div>
        <Link to="/browse">Selaa elokuvia</Link>
      </div>
    )
  }

  const { owner, movies } = state.data

  return (
    <div>
      <h1 className="h4 mb-1">Jaettu katselulista</h1>
      <p className="text-secondary mb-4">
        {owner} · {movies.length} {movies.length === 1 ? 'elokuva' : 'elokuvaa'}
      </p>

      {movies.length === 0 && <p>Listalla ei ole vielä elokuvia.</p>}

      <div className="watchlist-grid">
        {movies.map((movie) => (
          <WatchlistCard key={movie.tmdb_id} movieId={String(movie.tmdb_id)} />
        ))}
      </div>
    </div>
  )
}

export default SharedWatchlistPage
