import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoUnizarBlanco from '../assets/logoUnizarBlanco.png';

const CustomNavbar = () => {
  return (
    <Navbar
      bg="custom"
      expand="lg"
      className="px-3 py-1"
      style={{ backgroundColor: '#000842', zIndex: 1050 }}
    >
      <Navbar.Brand as={Link} to="/explorar" className="d-flex align-items-center">
        <img
          src={LogoUnizarBlanco}
          alt="LogoUnizar"
          className="d-inline-block align-top mt-1"
          style={{ height: '32px', width: 'auto', maxWidth: '100%' }}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-white">
        <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
      </Navbar.Toggle>

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto ms-lg-4">
          <div className="d-lg-none border-top border-secondary mt-2"></div>

          {/* Enlaces de navegación*/}
          <Nav.Link as={Link} to="/explorar" className="text-white mx-3">
            Explorar
          </Nav.Link>
          <Nav.Link as={Link} to="/reservas" className="text-white mx-3">
            Ver reservas
          </Nav.Link>

          <div className="d-lg-none border-top border-secondary mb-2"></div>
        </Nav>

        <Form className="d-flex ps-3 ps-lg-0">
          <Button
            as={Link}
            to="/"
            variant="light"
            size="sm"
            className="text-dark fw-bold mt-3 mt-lg-0 mb-2 mb-lg-0 ms-lg-2"
            style={{ minWidth: '120px', borderRadius: "25px" }}
          >
            Cerrar sesión
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
