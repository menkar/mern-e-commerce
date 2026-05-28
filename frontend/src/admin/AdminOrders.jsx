import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setOrders(orders.map(order => order._id === id ? { ...order, status } : order));
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Orders</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.userId?.name || 'Deleted User'}</td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
