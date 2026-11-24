import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './profile.css'

const API_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
   if (!res.ok) {
    const e = data?.error ?? data?.message
    throw new Error(`${path}: ${typeof e === 'string' ? e : e?.message || JSON.stringify(e) || res.status}`)
  }
  return data
}

function ReviewRow({ review, onChange, onRemove, onError }) {
  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [body, setBody] = useState(review.body || '')

  const save = async () => {
    try {
      const updated = await request(`/api/reviews/${review.id}`, {
        method: 'PUT',
        body: JSON.stringify({ rating, body: body.trim() || null })
      })
      onChange({ ...review, ...updated })
      setEditing(false)
    } catch (err) {
      onError(err.message)
    }
  }

  return (
    <li className="profile-item">
      <Link to={`/movies/${review.tmdb_id}`}>{review.title} ({review.release_year})</Link>
      {editing ? (
        <>
          <select className="form-select mt-2" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
          </select>
          <textarea className="form-control mt-2" rows="3" value={body} onChange={(e) => setBody(e.target.value)} />
          <button className="btn btn-primary btn-sm mt-2 me-2" onClick={save}>Tallenna</button>
          <button className="btn btn-outline-light btn-sm mt-2" onClick={() => setEditing(false)}>Peruuta</button>
        </>
      ) : (
        <>
          <div className="profile-stars">{'★'.repeat(review.rating)}</div>
          {review.body && <p className="mb-1">{review.body}</p>}
          <button className="btn btn-outline-light btn-sm me-2" onClick={() => setEditing(true)}>Muokkaa</button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onRemove(review.id)}>Poista</button>
        </>
      )}
    </li>
  )
}

function ProfilePage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [groups, setGroups] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([request('/api/reviews/mine'), request('/api/groups/mine'), request('/api/watchlist')])
      .then(([r, g, w]) => { setReviews(r); setGroups(g); setWatchlist(w) })
      .catch((err) => setError(err.message))
  }, [user])

  if (!user) return <Navigate to="/login" replace />

  // Poistaa kohteen palvelimelta ja päivittää listan
  const remove = async (path, setList, keep, message) => {
    if (message && !window.confirm(message)) return
    try {
      await request(path, { method: 'DELETE' })
      setList((list) => list.filter(keep))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="profile-page">
      <h1>{user.display_name || user.username}</h1>
      <p className="text-secondary">@{user.username} · {user.email}</p>
        <nav className="profile-links">
      <Link to="/browse">Selaa elokuvia</Link>
      <Link to="/groups">Ryhmät</Link>
      <Link to="/watchlist">Katselulista</Link>
      </nav>
      {error && <div className="alert alert-danger">{error}</div>}

      <h2>Omat arvostelut ({reviews.length}) <Link className="profile-more" to="/reviews">Näytä kaikki</Link></h2>
      <ul className="profile-list">
        {reviews.map((r) => (
          <ReviewRow
            key={r.id}
            review={r}
            onChange={(u) => setReviews((l) => l.map((x) => (x.id === u.id ? u : x)))}
            onRemove={(id) => remove(`/api/reviews/${id}`, setReviews, (x) => x.id !== id, 'Poistetaanko arvostelu?')}
            onError={setError}
          />
        ))}
      </ul>

     <h2>Ryhmäjäsenyydet ({groups.length}) <Link className="profile-more" to="/groups">Selaa ryhmiä</Link></h2>
      <ul className="profile-list">
        {groups.map((g) => (
          <li key={g.id} className="profile-item profile-row">
            <Link to={`/groups/${g.id}`}>{g.name}</Link>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => remove(`/api/groups/${g.id}/members/me`, setGroups, (x) => x.id !== g.id, `Poistutaanko ryhmästä "${g.name}"?`)}
            >Poistu</button>
          </li>
        ))}
      </ul>

      <h2>Katselulista ({watchlist.length}) <Link className="profile-more" to="/watchlist">Avaa lista</Link></h2>
      <ul className="profile-list">
        {watchlist.map((m) => (
          <li key={m.tmdb_id} className="profile-item profile-row">
            <Link to={`/movies/${m.tmdb_id}`}>{m.title} ({m.release_year})</Link>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => remove(`/api/watchlist/${m.tmdb_id}`, setWatchlist, (x) => x.tmdb_id !== m.tmdb_id)}
            >Poista</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfilePage