import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo_landlieben.png'; 
import { Link } from 'react-router-dom';

function CreateNavbar() {
  return (
    <Navbar expand="lg" className="navbar-dark bg-dark" fixed="top">
      <Container>
        {/* Hide brand on small screens */}
        <Navbar.Brand className="d-flex align-items-center" href="/">
             <img
            src={logo}
            height="40px"
            style={{ marginRight: '1rem' }}
            alt="Logo"
          />
          <div className="d-none d-md-block text-light">Sensornetz LAND L(i)EBEN</div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-end">
            <Nav.Link className="text-light" as={Link} to="/">Home</Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/second">Projekt</Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/dashboard">Dashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CreateNavbar;