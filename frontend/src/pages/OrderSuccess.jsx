import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="order-success-card__accent" aria-hidden="true" />

        <div className="order-success-icon-wrap">
          <div className="order-success-icon-ring" aria-hidden="true" />
          <div className="order-success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path className="order-success-check" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <span className="order-success-badge">Order Confirmed</span>

        <h2>Payment Successful!</h2>
        <p className="order-success-lead">
          Thank you for your order. We have securely received your payment and will process your shipment shortly.
        </p>

        <ul className="order-success-steps" aria-label="What happens next">
          <li className="order-success-step order-success-step--done">
            <span className="order-success-step__dot" aria-hidden="true">1</span>
            <span className="order-success-step__label">Payment received</span>
          </li>
          <li className="order-success-step order-success-step--active">
            <span className="order-success-step__dot" aria-hidden="true">2</span>
            <span className="order-success-step__label">Order processing</span>
          </li>
          <li className="order-success-step">
            <span className="order-success-step__dot" aria-hidden="true">3</span>
            <span className="order-success-step__label">Shipped to you</span>
          </li>
        </ul>

        <div className="order-success-actions">
          <Link to="/shop" className="btn order-success-btn-primary">
            Continue Shopping
          </Link>
          <Link to="/profile" className="btn btn-outline order-success-btn-secondary">
            View My Orders
          </Link>
        </div>

        <p className="order-success-note">
          A confirmation has been saved to your account. You can track your order anytime from your profile.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
