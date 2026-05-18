import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // We can use the signup endpoint since it does exactly what we need
      // (creating a user with a role). 
      // Wait, signup logs the user in on the backend context?
      // No, signup returns the user. Our AuthContext signup logs them in.
      // So we must use the raw api call so the admin doesn't get logged out!
      await api.post('/auth/signup', formData);
      setSuccess('User created successfully!');
      setFormData({
        name: '', email: '', password: '', address: '', role: 'USER'
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      let message = 'Failed to create user';
      if (err.response?.data?.message) {
        message = Array.isArray(err.response.data.message) 
          ? err.response.data.message[0] 
          : err.response.data.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div className="auth-card" style={{ margin: '0 auto', maxWidth: '500px' }}>
        <div className="auth-header">
          <h2>Create New User</h2>
          <p>Add a new User, Store Owner, or Admin to the system</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="success-banner">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name (Min 20 chars)"
              required
              minLength="20"
              maxLength="60"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8-16 chars, 1 uppercase, 1 special"
              required
              minLength="8"
              maxLength="16"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="City, Country"
              required
              maxLength="400"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">User Role</label>
            <select id="role" value={formData.role} onChange={handleChange}>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <div className="auth-buttons" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary full-width"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary full-width"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
