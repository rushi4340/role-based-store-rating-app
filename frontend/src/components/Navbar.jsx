import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="text-primary">Store</span>Rate
        </Link>

        <div className="navbar-links">
          {user ? (
            <div className="user-menu">
              <span className="user-badge">{user.role}</span>
              <span className="user-name">Hi, {user.name}</span>
              <Link to="/change-password" className="btn btn-secondary btn-sm" style={{background: 'transparent', border: '1px solid var(--border-color)'}}>
                Change Password
              </Link>
              <button onClick={logout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
