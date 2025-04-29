import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logoUnizar from "../assets/logoUnizar.png";
import { useAuth } from '../authContext';

function PrincipalLogin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  // HABRÁ QUE AÑADIR NUEVAS VERIFICACIONES CON LA API *********
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email es requerido';
    }
    else if (!/\S+@\S+/.test(email)) {
      newErrors.email = 'Email no válido';
    }

    if (!password) {
      newErrors.password = 'Contraseña es requerida';
    }
    else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);

    if (form.checkValidity() && Object.keys(newErrors).length === 0) {
      // FALTA LÓGICA DE AUTENTICACIÓN DEL BACKEND
      login(); // activar sesión
      navigate("/explorar"); // Redirigir a la página principal de explorar
    }

    setValidated(true);
  };

  return (
    <div className="App" style={{ background: 'linear-gradient(to bottom, rgb(33, 37, 41), #000842)' }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '650px', maxWidth: '100vw', padding: '3.5rem' }} className="shadow">
          {/* Logo */}
          <div className="d-flex justify-content-center mb-5">
            <img
              src={logoUnizar}
              alt="Logo Unizar"
              className="img-fluid"
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: "75px"
              }}
            />
          </div>

          <h3 className="text-center mb-4">Iniciar sesión</h3>

          {/* Inicio de sesión con email */}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                isValid={validated && !errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
                isValid={validated && !errors.password}
                required
                minLength={8}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Botón para inicio de sesión con email */}
            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3 mt-3 fw-bold"
              style={{
                height: '50px',
                borderRadius: "30px",
                backgroundColor: "#000842",
                borderColor: "#000842",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                letterSpacing: "0.5px",
                fontSize: "1rem",
              }}
            >
              Iniciar sesión
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default PrincipalLogin;
