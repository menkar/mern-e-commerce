import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/orderHelpers';

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
        const res = await fetch('/api/v1/analytics', {
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
      <div className="admin-page-inner">
        <header className="admin-hero">
          <div className="admin-hero__brand">
            <img src="/SwapCartLogo.png" alt="Store logo" className="admin-hero__logo" />
            <div className="admin-hero__text">
              <h2>Admin Dashboard</h2>
              <p>Welcome back, <strong>{user?.name}</strong></p>
            </div>
          </div>
          <span className="admin-hero__badge">Admin Panel</span>
        </header>

        {stats ? (
          <div className="admin-stats-grid">
            <div className="admin-stat-card admin-stat-card--orders">
              <span className="admin-stat-card__icon" aria-hidden="true">O</span>
              <h4>Total Orders</h4>
              <div className="admin-stat-value">{stats.totalOrders}</div>
            </div>
            <div className="admin-stat-card admin-stat-card--products">
              <span className="admin-stat-card__icon" aria-hidden="true">P</span>
              <h4>Total Products</h4>
              <div className="admin-stat-value">{stats.totalProducts}</div>
            </div>
            <div className="admin-stat-card admin-stat-card--users">
              <span className="admin-stat-card__icon" aria-hidden="true">U</span>
              <h4>Total Users</h4>
              <div className="admin-stat-value">{stats.totalUsers}</div>
            </div>
            <div className="admin-stat-card admin-stat-card--revenue">
              <span className="admin-stat-card__icon" aria-hidden="true">₹</span>
              <h4>Total Revenue</h4>
              <div className="admin-stat-value">{formatCurrency(stats.totalRevenue)}</div>
            </div>
          </div>
        ) : (
          <div className="admin-loading">Loading metrics</div>
        )}

        <section className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>Administrative Controls</h3>
              <p className="admin-panel__subtitle">Manage products, orders, and users from one place.</p>
            </div>
          </div>
          <div className="admin-actions">
            <button type="button" className="admin-action-btn admin-action-btn--primary" onClick={() => navigate('/admin/add-product')}>
              + Add Product
            </button>
            <button type="button" className="admin-action-btn admin-action-btn--secondary" onClick={() => navigate('/admin/products')}>
              Manage Products
            </button>
            <button type="button" className="admin-action-btn admin-action-btn--secondary" onClick={() => navigate('/admin/orders')}>
              Manage Orders
            </button>
            <button type="button" className="admin-action-btn admin-action-btn--secondary" onClick={() => navigate('/admin/users')}>
              Users Directory
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
