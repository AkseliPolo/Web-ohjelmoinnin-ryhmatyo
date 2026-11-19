import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import './reviews.css'

const MAX_LENGTH = 2000

const formatDate = (value) => new Date(value).toLocaleDateString('fi-FI')

export function ReviewForm({ reviews }) {
  const { draft, myReview, saving, error, message, needLogin } = reviews

  if (needLogin) {
    return (
      <div className="review-note">
        <Link to="/login">Kirjaudu sisään</Link> arvostellaksesi elokuvan.
      </div>
    )
  }

  if (!draft) {
    return (
      <>
        {message && <div className="review-note review-success" role="status">{message}</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
      </>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    reviews.save()
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form-head">
        <strong>{myReview ? 'Muokkaa arvosteluasi' : 'Kirjoita arvostelu'}</strong>
        <StarRating value={draft.rating} onChange={reviews.chooseRating} size="sm" label="Arvosana" />
      </div>

      <textarea
        className="form-control"
        rows="4"
        maxLength={MAX_LENGTH}
        placeholder="Mitä pidit elokuvasta? (vapaaehtoinen)"
        aria-label="Arvosteluteksti"
        value={draft.body}
        onChange={(event) => reviews.setBody(event.target.value)}
        autoFocus
      />

      <div className="review-form-foot">
        <small className="text-secondary">{draft.body.length} / {MAX_LENGTH}</small>
        <div className="review-form-actions">
          {myReview && (
            <button className="btn btn-link review-delete" type="button" onClick={reviews.remove} disabled={saving}>
              Poista arvostelu
            </button>
          )}
          <button className="btn btn-outline-secondary" type="button" onClick={reviews.cancel} disabled={saving}>
            Peruuta
          </button>
          <button className="btn review-save" type="submit" disabled={saving}>
            {saving ? 'Tallennetaan...' : 'Tallenna'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
    </form>
  )
}

export function ReviewList({ reviews }) {
  const { reviews: list, user } = reviews

  return (
    <section className="review-list">
      <h2 className="h4">Arvostelut {list.length > 0 && <span className="text-secondary">({list.length})</span>}</h2>

      {list.length === 0 && <p className="text-secondary">Ei vielä arvosteluja. Ole ensimmäinen!</p>}

      {list.map((review) => (
        <article key={review.id} className="review-card">
          <div className="review-card-head">
            <strong>
              {review.display_name || review.username}
              {user && review.user_id === user.id && <span className="review-own"> (sinä)</span>}
            </strong>
            <StarRating value={review.rating} size="sm" />
            <small className="text-secondary">{formatDate(review.updated_at || review.created_at)}</small>
          </div>
          {review.body && <p className="mb-0">{review.body}</p>}
        </article>
      ))}
    </section>
  )
}
