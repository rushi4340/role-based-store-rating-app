import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './StoreDetails.css';

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Rating State
  const [rating, setRating] = useState(5);
  const [ratingError, setRatingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stores/${id}`);
      setStore(response.data);
    } catch (err) {
      setError('Failed to load store details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    setRatingError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      await api.post('/ratings', {
        storeId: parseInt(id),
        rating: parseInt(rating)
      });
      setSuccessMsg('Rating submitted successfully!');
      fetchStoreDetails(); // Refresh to get new average
    } catch (err) {
      let msg = 'Failed to submit rating';
      if (err.response?.data?.message) {
        msg = typeof err.response.data.message === 'string' 
          ? err.response.data.message 
          : err.response.data.message[0];
      }
      setRatingError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (loading) return <div className="container" style={{paddingTop: '3rem'}}>Loading store details...</div>;
  if (error) return <div className="container" style={{paddingTop: '3rem'}}><div className="auth-error">{error}</div></div>;
  if (!store) return <div className="container" style={{paddingTop: '3rem'}}>Store not found</div>;

  return (
    <div className="container store-details-container animate-fade-in">
      <button className="btn btn-secondary btn-sm back-btn" onClick={() => navigate('/')}>
        &larr; Back to Dashboard
      </button>

      <div className="store-header">
        <h1>{store.name}</h1>
        <div className="store-meta">
          <span className="rating-badge large">
            ⭐ {calculateAverageRating(store.ratings)} 
            <span className="rating-count">({store.ratings?.length || 0} reviews)</span>
          </span>
          <span className="store-owner-badge">By {store.owner?.name}</span>
        </div>
      </div>

      <div className="store-content">
        <div className="store-info-card">
          <h3>Store Information</h3>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Contact Email:</strong> {store.email}</p>
          <p><strong>Listed On:</strong> {new Date(store.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Rating Section */}
        <div className="rating-section">
          <h3>Rate this Store</h3>
          
          {!user ? (
            <div className="login-prompt">
              <p>You must be logged in to rate stores.</p>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>Login to Rate</button>
            </div>
          ) : user.role === 'STORE_OWNER' ? (
            <div className="login-prompt">
              <p>Store Owners cannot rate stores. Switch to a Customer account to rate.</p>
            </div>
          ) : (
            <form onSubmit={handleRate} className="rating-form">
              {ratingError && <div className="auth-error">{ratingError}</div>}
              {successMsg && <div className="success-banner">{successMsg}</div>}
              
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
                <span className="rating-value">{rating} out of 5 stars</span>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
