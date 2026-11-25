import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './toplists.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const TABS = [
  { key: 'popular', label: 'Top 10 suosituinta elokuvaa', path: '/api/movies/popular' },
  { key: 'people', label: 'Top 10 suosituinta näyttelijää', path: '/api/movies/people/popular' },
  { key: 'latest', label: 'Top 10 uusinta elokuvaa', path: '/api/movies/latest' }
]

function TopLists() {
  const [active, setActive] = useState(TABS[0].key)
  const [cache, setCache] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (cache[active]) return
    const tab = TABS.find((t) => t.key === active)
    let cancelled = false
    setError('')
    fetch(`${API_URL}${tab.path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Haku epäonnistui'))))
      .then((data) => !cancelled && setCache((c) => ({ ...c, [active]: data })))
      .catch((err) => !cancelled && setError(err.message))
    return () => { cancelled = true }
  }, [active, cache])

  const items = cache[active]

  return (
    <section className="toplists">
      <div className="toplists-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={tab.key === active ? 'active' : ''}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="text-danger">{error}</p>}
      {!items && !error && <p className="text-secondary">Ladataan...</p>}

      {items && (
        <ol className="toplists-grid">
          {items.map((item, i) =>
            active === 'people' ? (
              <li key={item.id} className="toplists-card">
                <span className="toplists-rank">{i + 1}</span>
                {item.profileUrl
                  ? <img src={item.profileUrl} alt={item.name} />
                  : <div className="toplists-noimg" />}
                <strong>{item.name}</strong>
                {item.knownFor.length > 0 && <small>{item.knownFor.join(', ')}</small>}
              </li>
            ) : (
              <li key={item.id}>
                <Link to={`/movies/${item.id}`} className="toplists-card">
                  <span className="toplists-rank">{i + 1}</span>
                  {item.posterUrl
                    ? <img src={item.posterUrl} alt={item.title} />
                    : <div className="toplists-noimg" />}
                  <strong>{item.title}</strong>
                  <small>{item.year}</small>
                </Link>
              </li>
            )
          )}
        </ol>
      )}
    </section>
  )
}

export default TopLists