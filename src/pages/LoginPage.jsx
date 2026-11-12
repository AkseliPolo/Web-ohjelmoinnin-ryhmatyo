import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: username, password })
   })
    const data = await response.json()

      if (!response.ok) {
        setError(data.error?.message || 'Kirjautuminen epäonnistui')
        return
    }

      login(data.token, data.user)
      navigate('/')
   } catch {
      setError('Palvelimeen ei saatu yhteyttä')
   } finally {
      setLoading(false)
   }
}

  return (
    <div className="auth-card">
      <h1 className="h4 mb-4">Kirjaudu sisään</h1>
 
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="login-username" className="form-label">Käyttäjänimi</label>
          <input
            id="login-username"
            className="form-control"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
 
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">Salasana</label>
          <input
            id="login-password"
            className="form-control"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
 
       <button className="btn btn-primary w-100" type="submit" disabled={loading}>
         {loading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
        </button>
     </form>
      <div className="auth-switch">
        <span>Ei vielä tiliä?</span>
        <Link className="btn btn-outline-light w-100" to="/register">Rekisteröidy</Link>
      </div>
    </div>
  )
}
 
export default LoginPage
 