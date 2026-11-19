import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSearch = (event) => {
    event.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    if (!open) return

    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <nav className="my-navbar">
      <Link className="my-navbar-brand" to="/">
        Elokuva nettisivu
      </Link>

      <form className="my-navbar-search" onSubmit={handleSearch}>
        <input
          className="form-control"
          type="search"
          placeholder="Hae elokuvaa nimellä"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="btn btn-dark" type="submit">
          Hae
        </button>
      </form>

      <div className="my-navbar-actions">
        {user ? (
          <>
            <span className="text-light">{user.display_name || user.username}</span>
            <button className="btn btn-outline-light" type="button" onClick={handleLogout}>
              Kirjaudu ulos
            </button>
          </>
        ) : (
          <Link className="btn btn-outline-light" to="/login">
            Kirjaudu sisään
          </Link>
        )}

        <button
          className="my-navbar-toggler"
          type="button"
          aria-label="Valikko"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {open && (
        <div className="fullmenu" role="dialog" aria-modal="true" aria-label="Valikko">
          <div className="fullmenu-header">
            <Link className="my-navbar-brand" to="/" onClick={() => setOpen(false)}>
              Elokuva nettisivu
            </Link>
            <button
              className="fullmenu-close"
              type="button"
              aria-label="Sulje valikko"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="fullmenu-content">
            <div className="fullmenu-column">
              <h2>Elokuvat</h2>
              <Link to="/" onClick={() => setOpen(false)}>Etusivu</Link>
              <Link to="/browse" onClick={() => setOpen(false)}>Selaa elokuvia</Link>
            </div>

            <div className="fullmenu-column">
              <h2>Yhteisö</h2>
              <Link to="/groups" onClick={() => setOpen(false)}>Ryhmät</Link>
            </div>

            <div className="fullmenu-column">
              <h2>Oma tili</h2>
              {user ? (
                <>
                  <span className="fullmenu-user">{user.display_name || user.username}</span>
                  <button type="button" onClick={handleLogout}>Kirjaudu ulos</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>Kirjaudu sisään</Link>
                  <Link to="/register" onClick={() => setOpen(false)}>Rekisteröidy</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar