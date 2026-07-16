import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { categoryMap } from "../../data/categoryMap";

const Hero = () => {
  const navigate = useNavigate();

  const categories = Object.keys(categoryMap);
  const handleCategoryClick = (category) => {
    const dbValue = categoryMap[category];
    navigate(`/products?category=${encodeURIComponent(dbValue)}`);
  };

  return (
    <section className="hero">
      {/* MAIN BANNER AREA (80%) */}
      <div className="hero-banner-area">
        <div className="hero-banner-main">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1350&q=80"
            alt="Sri Lankan Marketplace"
            className="hero-banner-img"
          />
          <div className="hero-overlay-content">
            <span className="hero-tag">
              Trusted Multi-Vendor Marketplace
            </span>

            <h1>
              Buy & Sell with Trusted <br />
              Sri Lankan Sellers
            </h1>

            <p>
              Join MiniMartHub to shop verified local products or start your own business.
              Experience fast island-wide delivery and secure payments.
            </p>

            <div className="hero-buttons">
              <button
                className="shop-now-btn"
                onClick={() => navigate("/products")}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES SIDEBAR (20%) */}
      <div className="hero-sidebar-area">
        <div className="categories-card">
          <h3>Top Categories</h3>
          <div className="categories-scroll">
            <ul className="category-list">
              {categories.map((category, index) => (
                <li 
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="category-name">{category}</span>
                  <span className="category-arrow">›</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;