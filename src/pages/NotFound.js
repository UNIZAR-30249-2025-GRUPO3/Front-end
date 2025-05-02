import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NotFound() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
      <div className="text-center">
        {/* Mensaje de error */}
        <div className="mb-4 text-start mx-auto" style={{ maxWidth: '500px' }}>
          <h1 className="fs-4 text-dark mb-2">
            <span className="fw-medium">404.</span> Página no encontrada.
          </h1>
          <p className="text-secondary">
            La URL solicitada <code className="bg-light px-1">{path}</code> no se encontró en este servidor.
          </p>
        </div>
        
        {/* Boton para volver al incio */}
        <div className="mt-4">
          <Link to="/" className="text-decoration-none text-primary">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
