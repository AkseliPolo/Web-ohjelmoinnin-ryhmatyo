import { useEffect, useState } from 'react'
import { apiFetch } from '../api'
import './watchlist.css'

const toFullUrl = (path) => `${window.location.origin}${path}`

function WatchlistShare() {
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiFetch('/api/watchlist/share')
      .then((data) => {
        if (active) setLink(data)
      })
      .catch((err) => {
        if (active && err.status !== 404) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const run = async (action) => {
    setBusy(true)
    setError('')
    setCopied(false)
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const createLink = () => run(async () => {
    setLink(await apiFetch('/api/watchlist/share', { method: 'POST' }))
  })

  const revokeLink = () => {
    if (!window.confirm('Lopetetaanko jakaminen? Vanha linkki lakkaa toimimasta.')) return
    run(async () => {
      await apiFetch('/api/watchlist/share', { method: 'DELETE' })
      setLink(null)
    })
  }

  const copyLink = async (event) => {
    const input = event.currentTarget.form.elements.shareUrl
    try {
      await navigator.clipboard.writeText(input.value)
      setCopied(true)
    } catch {
      input.select()
    }
  }

  if (loading) return null

  return (
    <section className="watchlist-share">
      {link ? (
        <form className="watchlist-share-row" onSubmit={(event) => event.preventDefault()}>
          <label className="watchlist-share-label" htmlFor="watchlist-share-url">
            Jakolinkki – kuka tahansa linkin saanut näkee listasi ilman kirjautumista
          </label>
          <input
            id="watchlist-share-url"
            name="shareUrl"
            className="form-control"
            readOnly
            value={toFullUrl(link.path)}
            onFocus={(event) => event.target.select()}
          />
          <button type="button" className="btn watchlist-share-copy" onClick={copyLink} disabled={busy}>
            {copied ? 'Kopioitu!' : 'Kopioi linkki'}
          </button>
          <button type="button" className="btn btn-link watchlist-remove" onClick={revokeLink} disabled={busy}>
            Lopeta jakaminen
          </button>
        </form>
      ) : (
        <button type="button" className="btn watchlist-share-copy" onClick={createLink} disabled={busy}>
          Jaa katselulista linkillä
        </button>
      )}
      {error && <p className="text-danger mt-2 mb-0">{error}</p>}
    </section>
  )
}

export default WatchlistShare
