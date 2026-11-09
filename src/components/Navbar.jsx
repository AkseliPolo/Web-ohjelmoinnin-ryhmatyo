import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SearchBar from './SearchBar.jsx';
import './navbar.css';

function navbar() {
  return (
    <Navbar expand="lg" className="navbar-custom" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#home">Elokuva nettisivu</Navbar.Brand>

        <div className="flex-grow-1 mx-2" style={{ maxWidth: 400 }}>
          <SearchBar />
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default navbar;