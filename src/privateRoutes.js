import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
