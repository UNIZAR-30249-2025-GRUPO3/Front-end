import { Routes, Route } from 'react-router-dom';
import PrincipalLogin from './pages/PrincipalLogin';
import Explore from './pages/Explore';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrincipalLogin />} />
      <Route path="/explorar" element={<Explore />} />
    </Routes>
  );
}

export default IndexRoutes;
