import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Auth.css'
 
function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
 
  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: lähetä käyttäjänimi ja salasana taustapalvelulle
    // (esim. fetch(`${API_URL}/api/auth/login`, ...)), kun kirjautuminen on toteutettu.
  }
 
  return (
    <div className="auth-card">
      <h1 className="h4 mb-4">Kirjaudu sisään</h1>
 
      <form onSubmit={handleSubmit}>
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
 
        <button className="btn btn-primary w-100" type="submit">Kirjaudu sisään</button>
      </form>
 
      <div className="auth-switch">
        <span>Ei vielä tiliä?</span>
        <Link className="btn btn-outline-light w-100" to="/register">Rekisteröidy</Link>
      </div>
    </div>
  )
}
 
export default LoginPage
 