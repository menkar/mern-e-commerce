import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="order-success-icon" aria-hidden="true">✓</div>
        <h2>Payment Successful!</h2>
        <p>
          Thank you for your order. We have securely received your payment and will process your shipment shortly.
        </p>
        <Link to="/shop" className="btn">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
