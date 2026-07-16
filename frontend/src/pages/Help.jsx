import React from "react";
import { useNavigate } from "react-router-dom";
import "./Help.css";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="help-container">

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <div className="help-header">
        <h1>Help & Support</h1>
        <p>
          Need assistance? We are here to help you.
        </p>
      </div>

      <div className="help-grid">

        <div className="help-card">
          <h3>🛒 How to Place an Order?</h3>
          <p>
            Browse products, add items to your cart,
            proceed to checkout and confirm your order.
          </p>
        </div>

        <div className="help-card">
          <h3>📦 Track Your Order</h3>
          <p>
            Visit the Orders page and check the current
            status of your order.
          </p>
        </div>

        <div className="help-card">
          <h3>🏪 Become a Seller</h3>
          <p>
            Go to the Become Seller page and submit your
            business information.
          </p>
        </div>

        <div className="help-card">
          <h3>🔐 Account Issues</h3>
          <p>
            Reset your password or update your profile
            details from Settings.
          </p>
        </div>

      </div>

      <div className="contact-section">
        <h2>Contact Support</h2>

        <p>Email: support@minimarthub.lk</p>
        <p>Phone: +94 71 234 5678</p>

        <button className="contact-btn">
          Contact Support
        </button>
      </div>

    </div>
  );
};

export default Help;