import { Routes, Route } from 'react-router-dom';
import PrincipalLogin from './pages/PrincipalLogin';
import Explore from './pages/Explore';
import Reservations from './pages/Reservations';
import NotFound from './pages/NotFound';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrincipalLogin />} />
      <Route path="/explorar" element={<Explore />} />
      <Route path="/reservas" element={<Reservations />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default IndexRoutes;
