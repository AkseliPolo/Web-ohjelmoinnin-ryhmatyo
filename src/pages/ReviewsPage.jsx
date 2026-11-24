import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api'
import { useAuth } from '../context/AuthContext'

function ReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(!!user)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    apiFetch('/api/reviews/mine')
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <p>
        <Link to="/login">Kirjaudu sisään</Link> nähdäksesi omat arvostelusi.
      </p>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 className="h4 mb-4">Omat arvostelut</h1>

      {loading && <p>Haetaan...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p>Et ole vielä kirjoittanut arvosteluja.</p>
      )}

      {reviews.map((review) => (
        <div
          key={review.id}
          className="mb-3 p-3"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <Link to={`/movies/${review.tmdb_id}`} className="fw-semibold">
              {review.title}
              {review.release_year && ` (${review.release_year})`}
            </Link>
            <span style={{ color: '#a78bfa' }}>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </span>
          </div>
          {review.body && <p className="mb-1 mt-2">{review.body}</p>}
          <small className="text-secondary">
            {new Date(review.created_at).toLocaleDateString('fi-FI')}
          </small>
        </div>
      ))}
    </div>
  )
}

export default ReviewsPage