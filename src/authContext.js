import { createContext, useContext, useState } from 'react';

// Lógica de autenticación para protección de rutas
// DEMOMENTO ASÍ CON sessionStorage, PERO NO ES NADA SEGURO!!!! ********************************

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });

  const login = (role = null) => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    
    if (role) {
      sessionStorage.setItem('userRole', role);
      setUserRole(role);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);

    sessionStorage.removeItem('userRole');
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
