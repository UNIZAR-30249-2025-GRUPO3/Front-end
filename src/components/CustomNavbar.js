import React, { useState } from 'react';
import { Navbar, Nav, Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import LogoUnizarBlanco from '../assets/logoUnizarBlanco.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomNavbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

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
            onClick={handleLogout}
            variant="light"
            size="sm"
            className="text-dark fw-bold mt-3 mt-lg-0 mb-2 mb-lg-0 ms-lg-2"
            style={{ minWidth: '120px', borderRadius: "25px" }}
            disabled={isLoggingOut || !isAuthenticated}
          >
            {isLoggingOut ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                  style={{ width: '0.8rem', height: '0.8rem' }}
                />
                <span>Saliendo...</span>
              </>
            ) : (
              'Cerrar sesión'
            )}
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
