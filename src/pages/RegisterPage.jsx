import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName, email, password })
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error.message)
        return
      }

      navigate('/login')
    } catch {
      setError('Palvelimeen ei saatu yhteyttä')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1 className="h4 mb-4">Rekisteröidy</h1>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="reg-username" className="form-label">Käyttäjänimi</label>
          <input
            id="reg-username"
            className="form-control"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reg-display-name" className="form-label">Näyttönimi</label>
          <input
            id="reg-display-name"
            className="form-control"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reg-email" className="form-label">Sähköposti</label>
          <input
            id="reg-email"
            className="form-control"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reg-password" className="form-label">Salasana</label>
          <input
            id="reg-password"
            className="form-control"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Rekisteröidään...' : 'Rekisteröidy'}
        </button>
      </form>

      <div className="auth-switch">
        <span>Onko sinulla jo tili?</span>
        <Link className="btn btn-outline-light w-100" to="/login">Kirjaudu sisään</Link>
      </div>
    </div>
  )
}

export default RegisterPage