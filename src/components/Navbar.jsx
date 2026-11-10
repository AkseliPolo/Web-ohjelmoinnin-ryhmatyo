import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <nav className="my-navbar">
      <a className="my-navbar-brand" href="/">Elokuva nettisivu</a>

      <form className="my-navbar-search" role="search" onSubmit={handleSearch}>
        <input
          className="form-control"
          type="search"
          placeholder="Hae elokuvaa nimellä"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="btn btn-dark" type="submit">Hae</button>
      </form>

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

      {open && (
        <ul className="my-navbar-menu">
          <li><a href="/" onClick={() => setOpen(false)}>Home</a></li>
          <li><a href="/link" onClick={() => setOpen(false)}>Link</a></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;