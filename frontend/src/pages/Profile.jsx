import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import apiFetch from '../utils/apiFetch';
import {
  formatOrderDate,
  formatOrderStatus,
  formatCurrency,
  getProductName,
  getOrderDate,
  getOrderStatusClass,
  formatDeliveryAddress,
  getAccountRoleClass,
  formatAccountRole,
  formatInvoiceNumber,
  getTransactionDetails,
  getOrderItemCount,
} from '../utils/orderHelpers';

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
        const res = await apiFetch('/api/v1/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` },
          loaderMessage: 'Loading your orders...',
        });
        const data = await res.json();
        if (res.ok) {
          const orderList = Array.isArray(data?.orders) ? data.orders : [];
          orderList.sort((a, b) => {
            const dateA = getOrderDate(a)?.getTime() ?? 0;
            const dateB = getOrderDate(b)?.getTime() ?? 0;
            return dateB - dateA;
          });
          setOrders(orderList);
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
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h2>My Profile</h2>
          <p className="profile-meta"><strong>Name:</strong> {user.name}</p>
          <p className="profile-meta"><strong>Email:</strong> {user.email}</p>
          <span className={getAccountRoleClass(user.role)}>
            {formatAccountRole(user.role)}
          </span>
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
          {orders.map((order, orderIndex) => {
            const transaction = getTransactionDetails(order);
            const itemCount = getOrderItemCount(order);

            return (
            <article key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <h4 className="order-card__title">Order #{orderIndex + 1}</h4>
                  <p className="order-card__meta">
                    Placed on <strong>{formatOrderDate(order)}</strong>
                  </p>
                </div>
                <span className={getOrderStatusClass(order.status)}>
                  {formatOrderStatus(order.status)}
                </span>
              </div>

              <div className="order-card__details-grid">
                <section className="order-card__panel" aria-label="Invoice details">
                  <h5 className="order-card__panel-title">Invoice Details</h5>
                  <dl className="order-card__detail-list">
                    <div className="order-card__detail-row">
                      <dt>Invoice No.</dt>
                      <dd>{formatInvoiceNumber(orderIndex)}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Invoice Date</dt>
                      <dd>{formatOrderDate(order)}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Billed To</dt>
                      <dd>{user.name}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Email</dt>
                      <dd>{user.email}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Items</dt>
                      <dd>{itemCount}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Invoice Total</dt>
                      <dd className="order-card__detail-amount">{formatCurrency(order.totalAmount)}</dd>
                    </div>
                  </dl>
                </section>

                <section className="order-card__panel" aria-label="Transaction details">
                  <h5 className="order-card__panel-title">Transaction Details</h5>
                  <dl className="order-card__detail-list">
                    <div className="order-card__detail-row">
                      <dt>Payment Status</dt>
                      <dd>
                        <span className={`order-card__payment-badge order-card__payment-badge--${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Payment Method</dt>
                      <dd>{transaction.method}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Transaction ID</dt>
                      <dd><code className="order-card__code">{transaction.reference}</code></dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Amount Paid</dt>
                      <dd className="order-card__detail-amount">{formatCurrency(order.totalAmount)}</dd>
                    </div>
                    <div className="order-card__detail-row">
                      <dt>Order Status</dt>
                      <dd>{formatOrderStatus(order.status)}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              {Array.isArray(order.items) && order.items.length > 0 && (
                <ul className="order-card__items">
                  {order.items.map((item, itemIndex) => (
                    <li key={`${order._id}-item-${itemIndex}`} className="order-card__item">
                      <span className="order-card__item-rank">{itemIndex + 1}</span>
                      <div className="order-card__item-details">
                        <span className="order-card__item-name">{getProductName(item)}</span>
                        <span className="order-card__item-qty">Qty: {item.qty}</span>
                      </div>
                      <span className="order-card__item-price">{formatCurrency(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {order.address && (
                <p className="order-card__address">
                  <strong>Delivery:</strong> {formatDeliveryAddress(order.address)}
                </p>
              )}

              <div className="order-card__footer">
                <span className="order-card__items-count">
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </span>
                <span className="order-card__total">
                  Total: <strong className="order-total">{formatCurrency(order.totalAmount)}</strong>
                </span>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
