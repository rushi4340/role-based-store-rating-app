import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for users
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userSortConfig, setUserSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Filters for stores
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortConfig, setStoreSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleUserSort = (key) => {
    let direction = 'asc';
    if (userSortConfig.key === key && userSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setUserSortConfig({ key, direction });
  };

  const handleStoreSort = (key) => {
    let direction = 'asc';
    if (storeSortConfig.key === key && storeSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setStoreSortConfig({ key, direction });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSearch, userRole]);

  useEffect(() => {
    fetchStores();
  }, [storeSearch]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users', {
        params: { search: userSearch, role: userRole }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores', {
        params: { search: storeSearch }
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const sortedUsers = [...users].sort((a, b) => {
    let valA = a[userSortConfig.key];
    let valB = b[userSortConfig.key];
    if (userSortConfig.key === 'storeRating') {
      valA = a.storeRating || 0;
      valB = b.storeRating || 0;
    }
    if (valA < valB) return userSortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return userSortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedStores = [...stores].sort((a, b) => {
    let valA = a[storeSortConfig.key];
    let valB = b[storeSortConfig.key];
    if (storeSortConfig.key === 'ownerName') {
        valA = a.owner?.name || '';
        valB = b.owner?.name || '';
    } else if (storeSortConfig.key === 'avgRating') {
        valA = parseFloat(calculateAverageRating(a.ratings));
        valB = parseFloat(calculateAverageRating(b.ratings));
    }
    if (valA < valB) return storeSortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return storeSortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading && users.length === 0) return <div className="container" style={{paddingTop: '3rem'}}>Loading admin dashboard...</div>;

  return (
    <div className="container animate-fade-in" style={{paddingTop: '3rem'}}>
      <h1>System Administrator Dashboard</h1>
      
      {/* Stats Cards */}
      <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap'}}>
        <div className="store-card" style={{flex: '1 1 200px'}}>
          <h3>Total Users</h3>
          <p style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.totalUsers}</p>
        </div>
        <div className="store-card" style={{flex: '1 1 200px'}}>
          <h3>Total Stores</h3>
          <p style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.totalStores}</p>
        </div>
        <div className="store-card" style={{flex: '1 1 200px'}}>
          <h3>Total Ratings</h3>
          <p style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>{stats.totalRatings}</p>
        </div>
      </div>

      {/* Users Table */}
      <div style={{marginTop: '4rem'}}>
        <h2>Manage Users</h2>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
          <input 
            type="text" 
            placeholder="Search Name/Email/Address..." 
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{flex: 1}}
          />
          <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          <Link to="/create-user" className="btn btn-primary" style={{whiteSpace: 'nowrap'}}>
            + Add New User
          </Link>
        </div>
        
        <div className="store-card" style={{overflowX: 'auto'}}>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleUserSort('name')}>
                  Name {userSortConfig.key === 'name' ? (userSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleUserSort('email')}>
                  Email {userSortConfig.key === 'email' ? (userSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleUserSort('role')}>
                  Role {userSortConfig.key === 'role' ? (userSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleUserSort('address')}>
                  Address {userSortConfig.key === 'address' ? (userSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleUserSort('storeRating')}>
                  Store Rating {userSortConfig.key === 'storeRating' ? (userSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(u => (
                <tr key={u.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                  <td style={{padding: '1rem 0.5rem'}}>{u.name}</td>
                  <td style={{padding: '1rem 0.5rem'}}>{u.email}</td>
                  <td style={{padding: '1rem 0.5rem'}}><span className="user-badge">{u.role}</span></td>
                  <td style={{padding: '1rem 0.5rem'}}>{u.address.substring(0, 30)}...</td>
                  <td style={{padding: '1rem 0.5rem'}}>{u.storeRating ? `⭐ ${u.storeRating}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stores Table */}
      <div style={{marginTop: '4rem', marginBottom: '4rem'}}>
        <h2>Manage Stores</h2>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
          <input 
            type="text" 
            placeholder="Search Name/Address..." 
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
            style={{flex: 1, minWidth: '200px'}}
          />
          <Link to="/create-store" className="btn btn-primary" style={{whiteSpace: 'nowrap'}}>
            + Add New Store
          </Link>
        </div>
        
        <div className="store-card" style={{overflowX: 'auto'}}>
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleStoreSort('name')}>
                  Store Name {storeSortConfig.key === 'name' ? (storeSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleStoreSort('ownerName')}>
                  Owner {storeSortConfig.key === 'ownerName' ? (storeSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleStoreSort('address')}>
                  Address {storeSortConfig.key === 'address' ? (storeSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{padding: '1rem 0.5rem', cursor: 'pointer'}} onClick={() => handleStoreSort('avgRating')}>
                  Avg Rating {storeSortConfig.key === 'avgRating' ? (storeSortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map(s => (
                <tr key={s.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                  <td style={{padding: '1rem 0.5rem'}}>{s.name}</td>
                  <td style={{padding: '1rem 0.5rem'}}>{s.owner?.name}</td>
                  <td style={{padding: '1rem 0.5rem'}}>{s.address.substring(0, 30)}...</td>
                  <td style={{padding: '1rem 0.5rem'}}>⭐ {calculateAverageRating(s.ratings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
