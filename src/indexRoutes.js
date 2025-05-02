import { Routes, Route } from 'react-router-dom';
import PrincipalLogin from './pages/PrincipalLogin';
import Explore from './pages/Explore';
import Reservations from './pages/Reservations';
import NotFound from './pages/NotFound';
import PrivateRoute from './privateRoutes';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrincipalLogin />} />
      <Route path="/explorar" element={
        <PrivateRoute>
          <Explore />
        </PrivateRoute>
      } />
      <Route path="/reservas" element={
        <PrivateRoute>
          <Reservations />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default IndexRoutes;
