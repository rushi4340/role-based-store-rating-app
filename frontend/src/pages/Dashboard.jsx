import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (err) {
      setError('Failed to load stores. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="container dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Explore Stores</h1>
          <p className="dashboard-subtitle">Discover and rate the best stores around you.</p>
        </div>
        
        {user && (user.role === 'ADMIN' || user.role === 'STORE_OWNER') && (
          <button className="btn btn-primary" onClick={() => navigate('/create-store')}>
            + Create New Store
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty-state">No stores found. Check back later!</div>
      ) : (
        <div className="stores-grid">
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-card-header">
                <h3>{store.name}</h3>
                <div className="rating-badge">
                  ⭐ {calculateAverageRating(store.ratings)} 
                  <span className="rating-count">({store.ratings?.length || 0})</span>
                </div>
              </div>
              <div className="store-card-body">
                <p className="store-address">📍 {store.address}</p>
                <p className="store-owner">Owned by: {store.owner?.name}</p>
              </div>
              <div className="store-card-footer">
                <Link to={`/stores/${store.id}`} className="btn btn-secondary btn-sm full-width">
                  View Details & Rate
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
