import { useState, useEffect } from 'react';
import api from '../services/api';

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfigs, setSortConfigs] = useState({});

  const handleSort = (storeId, key) => {
    setSortConfigs(prev => {
      const current = prev[storeId] || { key: 'createdAt', direction: 'desc' };
      return {
        ...prev,
        [storeId]: {
          key,
          direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }
      };
    });
  };

  const getSortedRatings = (storeId, ratings) => {
    const config = sortConfigs[storeId] || { key: 'createdAt', direction: 'desc' };
    return [...ratings].sort((a, b) => {
      let valA = a[config.key];
      let valB = b[config.key];

      if (config.key === 'customerName') {
        valA = a.user.name;
        valB = b.user.name;
      } else if (config.key === 'customerEmail') {
        valA = a.user.email;
        valB = b.user.email;
      }

      if (valA < valB) return config.direction === 'asc' ? -1 : 1;
      if (valA > valB) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

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
                    <th style={{padding: '0.5rem', cursor: 'pointer'}} onClick={() => handleSort(store.id, 'customerName')}>
                      Customer Name {sortConfigs[store.id]?.key === 'customerName' ? (sortConfigs[store.id].direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th style={{padding: '0.5rem', cursor: 'pointer'}} onClick={() => handleSort(store.id, 'customerEmail')}>
                      Email {sortConfigs[store.id]?.key === 'customerEmail' ? (sortConfigs[store.id].direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th style={{padding: '0.5rem', cursor: 'pointer'}} onClick={() => handleSort(store.id, 'ratingValue')}>
                      Rating {sortConfigs[store.id]?.key === 'ratingValue' ? (sortConfigs[store.id].direction === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th style={{padding: '0.5rem', cursor: 'pointer'}} onClick={() => handleSort(store.id, 'createdAt')}>
                      Date {(!sortConfigs[store.id] || sortConfigs[store.id]?.key === 'createdAt') ? ((sortConfigs[store.id]?.direction || 'desc') === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedRatings(store.id, store.ratings).map(r => (
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
