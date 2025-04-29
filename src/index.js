import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import IndexRoutes from './indexRoutes';
import { AuthProvider } from './authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <IndexRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
