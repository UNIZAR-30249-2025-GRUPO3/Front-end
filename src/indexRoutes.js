import { Routes, Route } from 'react-router-dom';
import PrincipalLogin from './pages/PrincipalLogin';
import Explore from './pages/Explore';
import Reservations from './pages/Reservations';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrincipalLogin />} />
      <Route path="/explorar" element={<Explore />} />
      <Route path="/reservas" element={<Reservations />} />
    </Routes>
  );
}

export default IndexRoutes;
