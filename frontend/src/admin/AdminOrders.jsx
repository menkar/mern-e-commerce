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
  getProductName,
  formatDeliveryAddress,
  ORDER_STATUSES,
  normalizeOrderStatus,
} from '../utils/orderHelpers';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/v1/orders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        const orderList = Array.isArray(data?.orders) ? data.orders : [];
        orderList.sort((a, b) => {
          const dateA = getOrderDate(a)?.getTime() ?? 0;
          const dateB = getOrderDate(b)?.getTime() ?? 0;
          return dateB - dateA;
        });
        setOrders(orderList);
      } finally {
        setLoading(false);
      }
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
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: normalizedStatus } : order
        )
      );
    }
  };

  const getItemCount = (order) =>
    Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0)
      : 0;

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

        {loading ? (
          <p className="admin-orders-loading">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty__title">No orders yet</p>
            <p>Orders will appear here once customers start purchasing.</p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {orders.map((order, orderIndex) => (
              <article key={order._id} className="admin-order-card">
                <div className="admin-order-card__header">
                  <div className="admin-order-card__heading">
                    <h3 className="admin-order-card__title">Order #{orderIndex + 1}</h3>
                    <p className="admin-order-card__meta">
                      Placed on <strong>{formatOrderDate(order)}</strong>
                    </p>
                  </div>
                  <div className="admin-order-card__status-wrap">
                    <span className={getOrderStatusClass(order.status)}>
                      {formatOrderStatus(order.status)}
                    </span>
                    <select
                      className="admin-order-card__status-select"
                      value={normalizeOrderStatus(order.status)}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      aria-label={`Update status for order ${orderIndex + 1}`}
                    >
                      {ORDER_STATUSES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-order-card__customer">
                  <div>
                    <span className="admin-order-card__label">Customer</span>
                    <p className="admin-order-card__customer-name">
                      {order.user?.name || 'Deleted User'}
                    </p>
                  </div>
                  {order.user?.email && (
                    <div>
                      <span className="admin-order-card__label">Email</span>
                      <p className="admin-order-card__customer-email">{order.user.email}</p>
                    </div>
                  )}
                </div>

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="admin-order-card__items-section">
                    <h4 className="admin-order-card__section-title">Order Items</h4>
                    <div className="admin-order-items-table-wrap">
                      <table className="admin-order-items-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, itemIndex) => (
                            <tr key={`${order._id}-item-${itemIndex}`}>
                              <td data-label="#">{itemIndex + 1}</td>
                              <td data-label="Product" className="admin-order-items-table__name">
                                {getProductName(item)}
                              </td>
                              <td data-label="Qty">{item.qty}</td>
                              <td data-label="Unit Price">{formatCurrency(item.price)}</td>
                              <td data-label="Subtotal" className="admin-order-items-table__subtotal">
                                {formatCurrency(item.price * item.qty)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {order.address && (
                  <div className="admin-order-card__address">
                    <span className="admin-order-card__label">Shipping Address</span>
                    <p>{formatDeliveryAddress(order.address)}</p>
                  </div>
                )}

                <div className="admin-order-card__footer">
                  <div className="admin-order-card__footer-meta">
                    <span>{getItemCount(order)} item{getItemCount(order) !== 1 ? 's' : ''}</span>
                    {order.paymentId && (
                      <span className="admin-order-card__payment">
                        Payment: <code>{order.paymentId}</code>
                      </span>
                    )}
                  </div>
                  <p className="admin-order-card__total">
                    Total: <strong>{formatCurrency(order.totalAmount)}</strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
