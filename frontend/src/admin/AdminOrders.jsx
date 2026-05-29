import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import apiFetch from '../utils/apiFetch';
import {
  formatOrderDate,
  formatOrderStatus,
  formatCurrency,
  getOrderStatusClass,
  getOrderDate,
  ORDER_STATUSES,
  normalizeOrderStatus,
} from '../utils/orderHelpers';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/v1/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      const orderList = Array.isArray(data?.orders) ? data.orders : [];
      orderList.sort((a, b) => {
        const dateA = getOrderDate(a)?.getTime() ?? 0;
        const dateB = getOrderDate(b)?.getTime() ?? 0;
        return dateB - dateA;
      });
      setOrders(orderList);
    };
    fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    const normalizedStatus = normalizeOrderStatus(status);
    const res = await apiFetch(`/api/v1/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status: normalizedStatus }),
      loaderMessage: 'Updating order status...',
    });
    if (res.ok) {
      setOrders(orders.map(order => order._id === id ? { ...order, status: normalizedStatus } : order));
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-inner">
        <Link to="/admin" className="admin-back-link">← Back to Dashboard</Link>

        <div className="admin-toolbar">
          <div className="admin-toolbar__left">
            <h2>Manage Orders</h2>
            <p className="admin-toolbar__subtitle">
              {orders.length} order{orders.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__title">No orders yet</p>
            <p>Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div className="admin-table-section">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, orderIndex) => (
                    <tr key={order._id}>
                      <td data-label="Order #" className="admin-table__name">#{orderIndex + 1}</td>
                      <td data-label="Customer" className="admin-table__name">{order.user?.name || 'Deleted User'}</td>
                      <td data-label="Total" className="admin-table__price">{formatCurrency(order.totalAmount)}</td>
                      <td data-label="Date">{formatOrderDate(order)}</td>
                      <td data-label="Status">
                        <div className="admin-table__actions">
                          <span className={getOrderStatusClass(order.status)}>
                            {formatOrderStatus(order.status)}
                          </span>
                          <select
                            value={normalizeOrderStatus(order.status)}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            aria-label={`Update status for order ${orderIndex + 1}`}
                          >
                            {ORDER_STATUSES.map(({ value, label }) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
