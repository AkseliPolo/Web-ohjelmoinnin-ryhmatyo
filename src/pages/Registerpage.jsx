import { useState } from 'react'
import { Link } from 'react-router-dom'
import './auth.css'
 
function RegisterPage() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: lähetä tiedot taustapalvelulle
    // (esim. fetch(`${API_URL}/api/auth/register`, ...)), kun rekisteröityminen on toteutettu.
  }
 
  return (
    <div className="auth-card">
      <h1 className="h4 mb-4">Rekisteröidy</h1>
 
      <form onSubmit={handleSubmit}>
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
 
        <button className="btn btn-primary w-100" type="submit">Rekisteröidy</button>
      </form>
 
      <div className="auth-switch">
        <span>Onko sinulla jo tili?</span>
        <Link className="btn btn-outline-light w-100" to="/login">Kirjaudu sisään</Link>
      </div>
    </div>
  )
}
 
export default RegisterPage
 