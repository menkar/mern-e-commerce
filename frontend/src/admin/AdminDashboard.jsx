import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <img src="/SwapCartLogo.png" alt="Store logo" />
        <h2>Admin Dashboard</h2>
      </div>
      <p className="admin-welcome">Welcome back, <span>{user?.name}</span></p>
      
      {stats ? (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h4>Total Orders</h4>
            <div className="admin-stat-value">{stats.totalOrders}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Total Products</h4>
            <div className="admin-stat-value">{stats.totalProducts}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Total Users</h4>
            <div className="admin-stat-value">{stats.totalUsers}</div>
          </div>
          <div className="admin-stat-card">
            <h4>Total Revenue</h4>
            <div className="admin-stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <div className="admin-loading">Loading metrics...</div>
      )}

      <div className="admin-panel">
        <h3>Administrative Controls</h3>
        <div className="admin-actions">
          <button type="button" className="btn" onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>Manage Products</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/orders')}>Manage Orders</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Users Directory</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
