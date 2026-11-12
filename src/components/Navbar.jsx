import { useState } from 'react'
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
        <ul className="my-navbar-menu">
          <li>
            <Link to="/" onClick={() => setOpen(false)}>Etusivu</Link>
          </li>
          {user ? (
            <li>
              <a href="/" onClick={(event) => { event.preventDefault(); handleLogout() }}>
                Kirjaudu ulos
              </a>
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={() => setOpen(false)}>
                Kirjaudu sisään
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}

export default Navbar