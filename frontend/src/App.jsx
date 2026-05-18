import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import CreateStore from './pages/CreateStore';
import StoreDetails from './pages/StoreDetails';
import ChangePassword from './pages/ChangePassword';
import CreateUser from './pages/CreateUser';

// Wrapper component to route based on role
const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner

  if (!user) return <Dashboard />; // Public view for guests

  if (user.role === 'ADMIN') return <AdminDashboard />;
  if (user.role === 'STORE_OWNER') return <StoreOwnerDashboard />;
  return <Dashboard />; // Default USER dashboard
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleBasedDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/create-store" element={<CreateStore />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/stores/:id" element={<StoreDetails />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
