import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css'; // Reusing auth styles for forms

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/stores', formData);
      navigate('/'); // Go back to dashboard on success
    } catch (err) {
      let message = 'Failed to create store';
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          message = err.response.data.message[0];
        } else {
          message = err.response.data.message;
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div className="auth-card" style={{ margin: '0 auto' }}>
        <div className="auth-header">
          <h2>Create New Store</h2>
          <p>Add a new store to the platform</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Store Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Super Mart"
              required
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Store Contact Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@store.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Physical Address</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, City"
              required
              minLength="10"
              rows="3"
            />
          </div>

          <div className="auth-buttons" style={{ marginTop: '1.5rem' }}>
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
              {isLoading ? 'Creating...' : 'Create Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStore;
