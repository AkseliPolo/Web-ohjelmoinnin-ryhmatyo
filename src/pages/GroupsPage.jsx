import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'
import './groups.css'

const PAGE_SIZE = 20

function GroupsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('all') 
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [groups, setGroups] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  
  useEffect(() => {
    if (!user) return
    let cancelled = false

    setLoading(true)
    setError('')

    const params = new URLSearchParams({ page, limit: PAGE_SIZE })
    if (search) params.set('search', search)
    const path = tab === 'mine' ? '/api/groups/mine' : '/api/groups'

    apiFetch(`${path}?${params}`)
      .then((data) => {
        if (cancelled) return
        setGroups((current) => (page === 1 ? data : [...current, ...data]))
        setHasMore(data.length === PAGE_SIZE)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, tab, search, page])

  const changeTab = (next) => {
    setTab(next)
    setPage(1)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const group = await apiFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim(), description: newDescription.trim() }),
      })
      navigate(`/groups/${group.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRequestJoin = async (groupId) => {
    setError('')
    try {
      await apiFetch(`/api/groups/${groupId}/requests`, { method: 'POST' })
      setGroups((current) =>
        current.map((group) =>
          group.id === groupId ? { ...group, has_pending_request: true } : group
        )
      )
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) {
    return (
      <div className="groups-page">
        <h1 className="h3 mb-3">Keskusteluryhmät</h1>
        <p>Kirjaudu sisään nähdäksesi ryhmät.</p>
        <Link className="btn btn-outline-light" to="/login">Kirjaudu sisään</Link>
      </div>
    )
  }

  return (
    <div className="groups-page">
      <div className="d-flex align-items-center flex-wrap gap-3 mb-4">
        <h1 className="h3 mb-0">Keskusteluryhmät</h1>
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? 'Peruuta' : 'Luo ryhmä'}
        </button>
      </div>

      {showCreate && (
        <form className="group-form mb-4" onSubmit={handleCreate}>
          <h2 className="h5 mb-3">Uusi ryhmä</h2>
          <div className="mb-3">
            <label htmlFor="group-name" className="form-label">Ryhmän nimi</label>
            <input
              id="group-name"
              className="form-control"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="group-description" className="form-label">Kuvaus (valinnainen)</label>
            <textarea
              id="group-description"
              className="form-control"
              rows={3}
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              maxLength={1000}
            />
          </div>
          <button className="btn btn-primary" type="submit">Luo ryhmä</button>
        </form>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className={`btn ${tab === 'all' ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => changeTab('all')}
        >
          Kaikki ryhmät
        </button>
        <button
          type="button"
          className={`btn ${tab === 'mine' ? 'btn-light' : 'btn-outline-light'}`}
          onClick={() => changeTab('mine')}
        >
          Omat ryhmät
        </button>
      </div>

      <input
        className="form-control group-search mb-4"
        type="search"
        placeholder="Hae ryhmiä"
        aria-label="Hae ryhmiä"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {error && <p className="text-danger">{error}</p>}
      {!loading && groups.length === 0 && !error && <p>Ryhmiä ei löytynyt.</p>}

      <div className="group-list">
        {groups.map((group) => (
          <div className="group-card" key={group.id}>
            <div>
              <h2 className="h5 mb-1">{group.name}</h2>
              {group.description && <p className="mb-1">{group.description}</p>}
              <small className="text-secondary">{group.member_count} jäsentä</small>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link className="btn btn-outline-light" to={`/groups/${group.id}`}>
                Avaa
              </Link>
              {!group.is_member && (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={group.has_pending_request}
                  onClick={() => handleRequestJoin(group.id)}
                >
                  {group.has_pending_request ? 'Pyyntö lähetetty' : 'Pyydä liittymistä'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="mt-3">Ladataan...</p>}

      {!loading && hasMore && (
        <button
          type="button"
          className="btn btn-outline-light mt-3"
          onClick={() => setPage(page + 1)}
        >
          Näytä lisää
        </button>
      )}
    </div>
  )
}

export default GroupsPage