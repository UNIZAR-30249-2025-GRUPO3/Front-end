import { Routes, Route } from 'react-router-dom';
import PrincipalLogin from './pages/PrincipalLogin';

function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrincipalLogin />} />
    </Routes>
  );
}

export default IndexRoutes;