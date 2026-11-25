import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'
import './groups.css'

const displayName = (person) => person.display_name || person.username || 'Tuntematon'
const initial = (person) => displayName(person).charAt(0).toUpperCase()

const inviteUrl = (link) => `${window.location.origin}/join/${link.token}`

const describeLink = (link) => {
  const expires = link.expires_at
    ? `voimassa ${new Date(link.expires_at).toLocaleDateString('fi-FI')} asti`
    : 'ei vanhene'
  const uses = link.max_uses
    ? `käytetty ${link.use_count} / ${link.max_uses}`
    : `käytetty ${link.use_count} kertaa`
  return `${expires}, ${uses}`
}

function GroupPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const chatRef = useRef(null)

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [requests, setRequests] = useState([])
  const [links, setLinks] = useState([])
  const [linkDays, setLinkDays] = useState('7')
  const [copiedId, setCopiedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const isMember = Boolean(group?.is_member)
  const isAdmin = group?.my_role === 'admin'

  
  const loadAll = useCallback(async () => {
    try {
      const data = await apiFetch(`/api/groups/${id}`)
      setGroup(data)

      if (data.is_member) {
        const [memberList, messageList] = await Promise.all([
          apiFetch(`/api/groups/${id}/members`),
          apiFetch(`/api/groups/${id}/messages`),
        ])
        setMembers(memberList)
        setMessages(messageList)
        const admin = data.my_role === 'admin'
        setRequests(admin ? await apiFetch(`/api/groups/${id}/requests`) : [])
        setLinks(admin ? await apiFetch(`/api/groups/${id}/invite-links`) : [])
      } else {
        setMembers([])
        setMessages([])
        setRequests([])
        setLinks([])
      }
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (user) loadAll()
  }, [user, loadAll])

  
  useEffect(() => {
    if (!isMember) return
    const timer = setInterval(() => {
      apiFetch(`/api/groups/${id}/messages`)
        .then(setMessages)
        .catch(() => {})
    }, 10000)
    return () => clearInterval(timer)
  }, [id, isMember])

  
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages.length])

  const handleRequestJoin = async () => {
    setError('')
    try {
      await apiFetch(`/api/groups/${id}/requests`, { method: 'POST' })
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDecide = async (requestId, status) => {
    setError('')
    try {
      await apiFetch(`/api/groups/${id}/requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }), // 'approved' tai 'rejected'
      })
      await loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateLink = async () => {
    setError('')
    try {
      await apiFetch(`/api/groups/${id}/invite-links`, {
        method: 'POST',
        body: JSON.stringify(linkDays ? { expiresInDays: Number(linkDays) } : {}),
      })
      setLinks(await apiFetch(`/api/groups/${id}/invite-links`))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRevokeLink = async (linkId) => {
    if (!window.confirm('Perutaanko kutsulinkki? Sillä ei voi enää liittyä.')) return
    setError('')
    try {
      await apiFetch(`/api/groups/${id}/invite-links/${linkId}`, { method: 'DELETE' })
      setLinks(await apiFetch(`/api/groups/${id}/invite-links`))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(link))
      setCopiedId(link.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError('Linkin kopiointi epäonnistui, kopioi se käsin kentästä.')
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    setError('')
    try {
      await apiFetch(`/api/groups/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      })
      setText('')
      setMessages(await apiFetch(`/api/groups/${id}/messages`))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLeave = async () => {
    if (!window.confirm('Haluatko varmasti poistua ryhmästä?')) return
    setError('')
    try {
      await apiFetch(`/api/groups/${id}/members/me`, { method: 'DELETE' })
      navigate('/groups')
    } catch (err) {
      setError(err.message)
    }
  }

  
  const isOwn = (message) =>
    (user?.username != null && message.username === user.username) ||
    (user?.id != null && (message.user_id ?? message.author_id) === user.id)


  const formatTime = (value) => {
    if (!value) return ''
    const date = new Date(value)
    const isToday = date.toDateString() === new Date().toDateString()
    return isToday
      ? date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleString('fi-FI', {
          day: 'numeric',
          month: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
  }

  if (!user) {
    return (
      <div className="groups-page">
        <p>Kirjaudu sisään nähdäksesi ryhmän.</p>
        <Link className="btn btn-outline-light" to="/login">Kirjaudu sisään</Link>
      </div>
    )
  }

  if (loading) return <p className="groups-page">Ladataan...</p>

  if (!group) {
    return (
      <div className="groups-page">
        <Link to="/groups">← Kaikki ryhmät</Link>
        <p className="text-danger mt-3">{error || 'Ryhmää ei löytynyt.'}</p>
      </div>
    )
  }

  return (
    <div className="groups-page">
      <Link to="/groups">← Kaikki ryhmät</Link>

      {/* Ryhmän otsikko */}
      <div className="group-header">
        <h1 className="h2 mb-2">{group.name}</h1>
        {group.description && <p className="group-description">{group.description}</p>}
        <div className="d-flex flex-wrap gap-2">
          <span className="group-badge">{group.member_count} jäsentä</span>
          {isMember && (
            <span className="group-badge">{isAdmin ? 'Ylläpitäjä' : 'Jäsen'}</span>
          )}
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {/* Ei-jäsen: chat ei näy, vain liittymispyyntö */}
      {!isMember && (
        <div className="group-panel group-join">
          <p className="mb-0">Ryhmän keskustelu näkyy vain jäsenille.</p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={group.has_pending_request}
            onClick={handleRequestJoin}
          >
            {group.has_pending_request ? 'Pyyntö lähetetty' : 'Pyydä liittymistä'}
          </button>
        </div>
      )}

      {isMember && (
        <div className="group-detail-layout">
          {/* Chat */}
          <section className="group-panel group-chat">
            <h2 className="group-panel-title">Keskustelu</h2>

            <div className="chat-box" ref={chatRef}>
              {messages.length === 0 && (
                <div className="chat-empty">
                  <p className="mb-1">Ei viestejä vielä</p>
                  <small>Kirjoita ensimmäinen viesti alla olevaan kenttään.</small>
                </div>
              )}
              {messages.map((message) => {
                const own = isOwn(message)
                return (
                  <div key={message.id} className={`chat-row ${own ? 'own' : ''}`}>
                    {!own && <span className="avatar">{initial(message)}</span>}
                    <div className="chat-bubble">
                      {!own && <span className="chat-author">{displayName(message)}</span>}
                      <p className="mb-0">{message.body}</p>
                      <span className="chat-time">{formatTime(message.created_at)}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <form className="chat-form" onSubmit={handleSend}>
              <input
                className="form-control"
                placeholder="Kirjoita viesti"
                aria-label="Viesti"
                maxLength={4000}
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={!text.trim()}>
                Lähetä
              </button>
            </form>
          </section>

          {/* Sivupalkki */}
          <aside className="group-side">
            {/* Liittymispyynnöt näkyvät vain ryhmän adminille */}
            {isAdmin && (
              <section className="group-panel">
                <h2 className="group-panel-title">
                  Liittymispyynnöt
                  {requests.length > 0 && <span className="count-badge">{requests.length}</span>}
                </h2>
                {requests.length === 0 && (
                  <p className="text-secondary mb-0">Ei avoimia pyyntöjä.</p>
                )}
                {requests.map((request) => (
                  <div className="person-row" key={request.id}>
                    <span className="avatar">{initial(request)}</span>
                    <span className="person-name">{displayName(request)}</span>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleDecide(request.id, 'approved')}
                      >
                        Hyväksy
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleDecide(request.id, 'rejected')}
                      >
                        Hylkää
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Kutsulinkit näkyvät vain ryhmän adminille */}
            {isAdmin && (
              <section className="group-panel">
                <h2 className="group-panel-title">Kutsulinkit</h2>
                <p className="text-secondary small">
                  Jaa linkki, niin sen avaava kirjautunut käyttäjä liittyy ryhmään.
                </p>

                <div className="d-flex gap-2 mb-3">
                  <select
                    className="form-select form-select-sm"
                    aria-label="Linkin voimassaoloaika"
                    value={linkDays}
                    onChange={(event) => setLinkDays(event.target.value)}
                  >
                    <option value="1">1 päivä</option>
                    <option value="7">7 päivää</option>
                    <option value="30">30 päivää</option>
                    <option value="">Ei vanhene</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary text-nowrap"
                    onClick={handleCreateLink}
                  >
                    Luo linkki
                  </button>
                </div>

                {links.length === 0 && (
                  <p className="text-secondary mb-0">Ei voimassa olevia linkkejä.</p>
                )}
                {links.map((link) => (
                  <div className="mb-3" key={link.id}>
                    <input
                      className="form-control form-control-sm mb-1"
                      readOnly
                      aria-label="Kutsulinkki"
                      value={inviteUrl(link)}
                      onFocus={(event) => event.target.select()}
                    />
                    <small className="text-secondary d-block mb-1">{describeLink(link)}</small>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleCopyLink(link)}
                      >
                        {copiedId === link.id ? 'Kopioitu!' : 'Kopioi'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRevokeLink(link.id)}
                      >
                        Peru
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="group-panel">
              <h2 className="group-panel-title">Jäsenet</h2>
              {members.map((member) => (
                <div className="person-row" key={member.user_id ?? member.id ?? member.username}>
                  <span className="avatar">{initial(member)}</span>
                  <span className="person-name">{displayName(member)}</span>
                  {member.role === 'admin' && <span className="group-badge">admin</span>}
                </div>
              ))}
            </section>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger leave-button"
              onClick={handleLeave}
            >
              Poistu ryhmästä
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default GroupPage