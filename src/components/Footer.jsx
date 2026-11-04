import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Footer() {
  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Oma sivusto</h5>
            <p className="mb-0 text-secondary">
              Lyhyt kuvaus sivustosta tai projektista.
            </p>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <h5>Linkit</h5>
            <ul className="list-unstyled mb-0">
              <li><a href="/" className="text-light text-decoration-none">Etusivu</a></li>
              <li><a href="/tietoa" className="text-light text-decoration-none">Tietoa</a></li>
              <li><a href="/yhteystiedot" className="text-light text-decoration-none">Yhteystiedot</a></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>Yhteystiedot</h5>
            <p className="mb-0 text-secondary">
              Oulu, Suomi<br />
              info@example.com
            </p>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <p className="text-center text-secondary mb-0">
          © 2026 Oma sivusto. Kaikki oikeudet pidätetään.
        </p>
      </Container>
    </footer>
  )
}

export default Footer