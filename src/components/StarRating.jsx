import { useState } from 'react'
import './reviews.css'

const LABELS = ['', 'Huono', 'Välttävä', 'Ok', 'Hyvä', 'Erinomainen']

function StarRating({ value = 0, onChange, size = 'lg', label = 'Arvosana' }) {
  const [hover, setHover] = useState(0)
  const readOnly = !onChange
  const shown = hover || value

  if (readOnly) {
    return (
      <span className={`stars stars-${size}`} role="img" aria-label={`${value} / 5 tähteä`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= value ? 'star is-on' : 'star'}>★</span>
        ))}
      </span>
    )
  }

  return (
    <div className="stars-input">
      <div
        className={`stars stars-${size}`}
        role="radiogroup"
        aria-label={label}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} / 5 – ${LABELS[n]}`}
            title={LABELS[n]}
            className={n <= shown ? 'star is-on' : 'star'}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(n)}
          >
            ★
          </button>
        ))}
      </div>
      <span className="stars-label">{shown ? LABELS[shown] : ''}</span>
    </div>
  )
}

export default StarRating
