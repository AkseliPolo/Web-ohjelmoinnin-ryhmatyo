import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'
import './groups.css'

function JoinGroupPage() {
  const { token } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [invite, setInvite] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!user) return undefined

    let active = true
    apiFetch(`/api/groups/invites/${token}`)
      .then((data) => {
        if (active) setInvite(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token, user])

  const handleJoin = async () => {
    setJoining(true)
    setError('')
    try {
      const result = await apiFetch(`/api/groups/invites/${token}/join`, { method: 'POST' })
      navigate(`/groups/${result.group_id}`)
    } catch (err) {
      setError(err.message)
      setJoining(false)
    }
  }

  if (!user) {
    return (
      <div className="groups-page">
        <h1 className="h3 mb-3">Ryhmäkutsu</h1>
        <p>Kirjaudu sisään liittyäksesi ryhmään.</p>
        <Link
          className="btn btn-outline-light me-2"
          to="/login"
          state={{ from: `/join/${token}` }}
        >
          Kirjaudu sisään
        </Link>
        <Link className="btn btn-link" to="/register">Rekisteröidy</Link>
      </div>
    )
  }

  if (loading) return <p className="groups-page">Ladataan...</p>

  if (!invite) {
    return (
      <div className="groups-page">
        <h1 className="h3 mb-3">Ryhmäkutsu</h1>
        <p className="text-danger">{error || 'Kutsulinkkiä ei löytynyt.'}</p>
        <Link to="/groups">← Kaikki ryhmät</Link>
      </div>
    )
  }

  const { group } = invite

  return (
    <div className="groups-page">
      <h1 className="h3 mb-3">Ryhmäkutsu</h1>

      <div className="group-panel">
        <h2 className="h4">{group.name}</h2>
        {group.description && <p className="group-description">{group.description}</p>}
        <span className="group-badge">{group.member_count} jäsentä</span>

        {error && <p className="text-danger mt-3 mb-0">{error}</p>}

        <div className="mt-4">
          {invite.is_member ? (
            <>
              <p>Olet jo tämän ryhmän jäsen.</p>
              <Link className="btn btn-primary" to={`/groups/${group.id}`}>Avaa ryhmä</Link>
            </>
          ) : invite.valid ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? 'Liitytään...' : 'Liity ryhmään'}
            </button>
          ) : (
            <p className="text-danger mb-0">{invite.reason}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default JoinGroupPage