import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          if (res.status === 401) {
             logout();
             navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusClass = (status) => {
    if (status === 'Delivered') return 'status-badge status-badge--delivered';
    if (status === 'Shipped') return 'status-badge status-badge--shipped';
    return 'status-badge status-badge--pending';
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h2>My Profile</h2>
          <p className="profile-meta"><strong>Name:</strong> {user.name}</p>
          <p className="profile-meta"><strong>Email:</strong> {user.email}</p>
          <span className="profile-badge">Account Type: {user.role.toUpperCase()}</span>
        </div>
        <button type="button" onClick={handleLogout} className="btn btn-logout-profile">Logout</button>
      </div>

      <h3 className="profile-section-title">Order History</h3>
      {loading ? (
        <p className="profile-loading">Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div className="profile-empty">
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div>
                <p>Order ID: <strong>{order._id}</strong></p>
                <p>Placed On: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
                <p>Total: <strong className="order-total">₹{order.totalAmount.toFixed(2)}</strong></p>
              </div>
              <span className={getStatusClass(order.status)}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
