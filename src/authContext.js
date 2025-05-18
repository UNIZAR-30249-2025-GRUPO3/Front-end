import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://back-end-sv3z.onrender.com';
const AuthContext = createContext();

// Configurar axios para incluir el token en todas las solicitudes
const setupAxiosInterceptors = (token) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Se verifica el estado de autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');
      
      if (storedToken) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
        setUserRole(storedRole || null);
        setUserId(storedUserId || null);
        
        setupAxiosInterceptors(storedToken);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
      }
      
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
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        const user = response.data.user;

        // Guardar token y datos de usuario en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.role[0]);
        localStorage.setItem('userId', user.user_id);
        
        // Actualizar estado
        setAuthToken(token);
        setIsAuthenticated(true);
        setUserRole(user.role[0]);
        setUserId(user.user_id);
        
        setupAxiosInterceptors(token);
        
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
    } catch (error) {
      console.error('Error durante el logout:', error);
    } finally {
      // Limpiar datos de autenticación
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      setAuthToken(null);
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      setIsLoading(false);
    }
  };

  // Función para comprobar si el token ha expirado
  const isTokenExpired = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Comprobar si el token ha expirado
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        logout();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error al verificar la expiración del token:', e);
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      userId, 
      authToken,
      login, 
      logout,
      isLoading,
      isTokenExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
