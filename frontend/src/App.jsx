import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateStore from './pages/CreateStore';
import StoreDetails from './pages/StoreDetails';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-store" element={<CreateStore />} />
        <Route path="/stores/:id" element={<StoreDetails />} />
      </Routes>
    </>
  );
}

export default App;
