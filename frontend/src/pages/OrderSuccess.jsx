// OrderSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';
import logo from "../assets/images/logo.png";

const OrderSuccess = () => {
  const navigate = useNavigate();

  // Sample order data - in real app, this would come from API/state
  const orderData = {
    orderId: 'MMH-2026-07-02-001',
    paymentMethod: 'Credit Card (Visa ending in 4242)',
    deliveryCharge: 'LKR 250.00',
    estimatedDelivery: 'July 5, 2026',
    status: 'Confirmed'
  };

  return (
    <div className="success-page">
      <div className="success-card">
        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="MiniMartHub Logo" className="brand-logo" />
        </div>

        {/* Success Icon with Animation */}
        <div className="icon-wrapper">
          <div className="success-icon">
            <svg viewBox="0 0 52 52" className="checkmark">
              <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check" />
            </svg>
          </div>
        </div>

        {/* Heading & Message */}
        <h1 className="thank-you-heading">Thank You for Your Order!</h1>
        <p className="success-message">
          Your order has been placed successfully. We'll send you a confirmation email shortly.
        </p>

        {/* Order Details */}
        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Order ID</span>
            <span className="detail-value order-id">{orderData.orderId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Payment Method</span>
            <span className="detail-value">{orderData.paymentMethod}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Delivery Charge</span>
            <span className="detail-value">{orderData.deliveryCharge}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Estimated Delivery</span>
            <span className="detail-value">{orderData.estimatedDelivery}</span>
          </div>
          <div className="detail-row status-row">
            <span className="detail-label">Order Status</span>
            <span className="detail-value status-badge">{orderData.status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;