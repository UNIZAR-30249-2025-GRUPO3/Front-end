import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://back-end-sv3z.onrender.com';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Se verifica el estado de autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedAuth = sessionStorage.getItem('isAuthenticated') === 'true';
      const storedRole = sessionStorage.getItem('userRole');
      const storedUserId = sessionStorage.getItem('userId');
      
      setIsAuthenticated(storedAuth);
      setUserRole(storedRole || null);
      setUserId(storedUserId || null);
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data && response.data.user) {

        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userRole', response.data.user.role[0]);
        sessionStorage.setItem('userId', response.data.user.user_id);
        
        setIsAuthenticated(true);
        setUserRole(response.data.user.role[0]);
        setUserId(response.data.user.user_id);
        
        return { success: true };
      }
      
      return { success: false, error: 'Respuesta de login inválida' };

    } catch (error) {
      console.error('Error durante el login:', error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        const specificError = errorData.error || errorData.message || JSON.stringify(errorData);
        return { success: false, error: specificError };
      }
      
      return { success: false, error: 'Error de conexión con el servidor' };

    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await axios.get(`${API_URL}/api/auth/logout`, {
        withCredentials: true
      });

    } catch (error) {

      console.error('Error durante el logout:', error);
    } finally {

      // Se limpian datos de sesión incluso si la llamada API falla
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userId');
      
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userId, 
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
