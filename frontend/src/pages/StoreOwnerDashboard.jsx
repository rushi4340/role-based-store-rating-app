import { useState, useEffect } from 'react';
import api from '../services/api';

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stores/owner/dashboard');
      if (Array.isArray(res.data)) {
        setStores(res.data);
      } else {
        setStores([]);
      }
    } catch (err) {
      console.error('Failed to load owner dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '3rem'}}>Loading owner dashboard...</div>;

  return (
    <div className="container animate-fade-in" style={{paddingTop: '3rem'}}>
      <h1>Store Owner Dashboard</h1>
      <p style={{color: 'var(--text-secondary)', marginBottom: '3rem'}}>Manage your stores and view ratings from customers.</p>

      {stores.length === 0 ? (
        <div className="empty-state">You haven't created any stores yet.</div>
      ) : (
        stores.map(store => (
          <div key={store.id} className="store-card" style={{marginBottom: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2>{store.name}</h2>
              <div className="rating-badge large">
                ⭐ {store.averageRating} <span className="rating-count">({store.totalRatings})</span>
              </div>
            </div>

            <h3>Recent Ratings</h3>
            {store.ratings.length === 0 ? (
              <p style={{color: 'var(--text-secondary)'}}>No ratings yet.</p>
            ) : (
              <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                    <th style={{padding: '0.5rem'}}>Customer Name</th>
                    <th style={{padding: '0.5rem'}}>Email</th>
                    <th style={{padding: '0.5rem'}}>Rating</th>
                    <th style={{padding: '0.5rem'}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {store.ratings.map(r => (
                    <tr key={r.ratingId} style={{borderBottom: '1px solid var(--border-color)'}}>
                      <td style={{padding: '0.5rem'}}>{r.user.name}</td>
                      <td style={{padding: '0.5rem'}}>{r.user.email}</td>
                      <td style={{padding: '0.5rem', color: 'var(--warning-color)'}}>
                        {'★'.repeat(r.ratingValue)}{'☆'.repeat(5 - r.ratingValue)}
                      </td>
                      <td style={{padding: '0.5rem'}}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
