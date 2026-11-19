import { Link } from 'react-router-dom'
import './footer.css'
 
function Footer() {
  return (
    <footer className="footer-custom" data-bs-theme="dark">
      <div>
        <span className="footer-title">Elokuva nettisivu</span>
        <span className="footer-tagline">Elokuvaharrastajien yhteisöpalvelu</span>
      </div>
 
      <nav className="footer-links" aria-label="Alatunniste">
        <Link to="/">Etusivu</Link>
        <Link to="/browse">Selaa elokuvia</Link>
        <Link to="/groups">Ryhmät</Link>
      </nav>
 
      <div className="footer-contact">
        <span className="footer-contact-item">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Oulu, Suomi
        </span>
        <a className="footer-contact-item" href="mailto:info@example.com">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          info@example.com
        </a>
      </div>
 
      <div className="footer-bottom">
        <span>© 2026 Elokuva nettisivu. Kaikki oikeudet pidätetään.</span>
        <span>
          Elokuvatiedot: TMDB. Tämä sivu käyttää TMDB:n rajapintaa, mutta TMDB ei ole
          hyväksynyt tai sertifioinut sitä.
        </span>
      </div>
    </footer>
  )
}
 
export default Footer