import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import logoUnizar from "../assets/logoUnizar.png";
import "bootstrap/dist/css/bootstrap.min.css";

function PrincipalLogin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/explorar');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email es requerido';
    } else if (!/\S+@\S+/.test(email)) {
      newErrors.email = 'Email no válido';
    }

    if (!password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Se valida el formulario
    if (!validateForm()) {
      setValidated(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setLoginError('');
      
      // Se llama a la función de login del AuthContext
      const result = await login(email, password);
      
      if (result.success) {
        navigate("/explorar"); // Se redirige a la página principal de explorar
      } else {

        // Manejo de errores específicos
        const errorMsg = result.error;
        
        if (errorMsg.includes('Usuario no encontrado')) {
          setLoginError('Este email no está registrado en el sistema');
        } else if (errorMsg.includes('Contraseña incorrecta')) {
          setLoginError('Contraseña incorrecta. Inténtalo de nuevo');
        } else if (errorMsg.includes('No tienes sesión activa')) {
          setLoginError('La sesión ha caducado. Por favor, inicia sesión nuevamente');
        } else if (errorMsg.includes('Token inválido o expirado')) {
          setLoginError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
        } else {
          setLoginError(errorMsg || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
      }
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      setLoginError('Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Mensaje de error */}
            {loginError && (
              <Alert variant="danger" className="mb-4">
                <div className="d-flex align-items-center">
                  <strong>Error:</strong>&nbsp;{loginError}
                </div>
              </Alert>
            )}

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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default PrincipalLogin;
