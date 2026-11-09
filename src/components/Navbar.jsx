import SearchBar from './SearchBar.jsx';
import './navbar.css';
import { useState } from "react";

function navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="my-navbar">
      <a className="my-navbar-brand" href="/">Elokuva nettisivu</a>

      <form className="my-navbar-search" role="search">
        <input className="form-control" type="search" placeholder="Hae elokuvaa nimellä" />
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

export default navbar;