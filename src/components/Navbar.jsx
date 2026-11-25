import { useState, useEffect } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './navbar.css'

const Icon = ({ children }) => (
  <svg
    className="my-navbar-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

const FilmIcon = () => (
  <Icon>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 3v18M17 3v18M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
  </Icon>
)

const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
)

function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const name = user ? user.display_name || user.username : ''
  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="my-navbar">
        <Link className="my-navbar-brand" to="/">
          <FilmIcon />
          Elokuva nettisivu
        </Link>

        <div className="my-navbar-links">
          <NavLink to="/" end>Etusivu</NavLink>
          <NavLink to="/browse">Selaa</NavLink>
          <NavLink to="/groups">Ryhmät</NavLink>
          {user && <NavLink to="/watchlist">Katselulista</NavLink>}
          {user && <NavLink to="/reviews">Omat arvostelut</NavLink>}
        </div>

        <div className="my-navbar-right">
          <Link to="/search" aria-label="Hae elokuvia">
            <SearchIcon />
          </Link>
          {!user && (
            <Link className="btn btn-outline-light btn-sm" to="/login">
              Kirjaudu sisään
            </Link>
          )}
          {user && <span className="my-navbar-username">{name}</span>}
          <button className="my-navbar-btn" type="button" aria-label="Valikko" onClick={() => setOpen(true)}>
            {user ? name.slice(0, 2).toUpperCase() : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fullmenu" role="dialog" aria-modal="true" aria-label="Valikko">
          <div className="my-navbar">
            <Link className="my-navbar-brand" to="/" onClick={close}>
              <FilmIcon />
              Elokuva nettisivu
            </Link>
            <button className="my-navbar-btn" type="button" aria-label="Sulje valikko" onClick={close}>
              ✕
            </button>
          </div>

          <div className="fullmenu-content">
            <div className="fullmenu-column">
              <h2>Elokuvat</h2>
              <Link to="/" onClick={() => setOpen(false)}>Etusivu</Link>
              <Link to="/browse" onClick={() => setOpen(false)}>Selaa elokuvia</Link>
              <Link to="/watchlist" onClick={() => setOpen(false)}>Katselulista</Link>
            </div>

            <div className="fullmenu-column">
              <h2>Yhteisö</h2>
              <Link to="/groups" onClick={close}>Ryhmät</Link>
            </div>

            <div className="fullmenu-column">
              <h2>Oma tili</h2>
              {user ? (
                <>
                  <span>{name}</span>
                  <Link to="/profile" onClick={close}>Oma profiili</Link>
                  <button type="button" onClick={handleLogout}>Kirjaudu ulos</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={close}>Kirjaudu sisään</Link>
                  <Link to="/register" onClick={close}>Rekisteröidy</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar