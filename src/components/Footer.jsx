import Container from 'react-bootstrap/Container'
import './footer.css';

function Footer() {
  return (
    <footer expand="lg" className="footer-custom" data-bs-theme="dark">
      <Container fluid>
   <div className="d-flex flex-wrap justify-content-between gap-4">
  <div>
    <h6>Oma sivusto</h6>
    <p className="mb-0 text-secondary small">Kuvaus sivustosta.</p>
  </div>

  <div>
    <h6>Linkit</h6>
    <ul className="list-unstyled mb-0 small">
      <li><a href="/" className="link-light text-decoration-none">Etusivu</a></li>
      <li><a href="/tietoa" className="link-light text-decoration-none">Tietoa</a></li>
      <li><a href="/yhteystiedot" className="link-light text-decoration-none">Yhteystiedot</a></li>
    </ul>
  </div>

  <div>
    <h6>Yhteystiedot</h6>
    <p className="mb-0 text-secondary small">
      Oulu, Suomi<br />
      info@example.com
    </p>
  </div>
</div>
        <hr className="border-secondary" />

        <p className="text-center text-secondary mb-0">
          © 2026 Oma sivusto. Kaikki oikeudet pidätetään.
        </p>
      </Container>
    </footer>
  )
}

export default Footer