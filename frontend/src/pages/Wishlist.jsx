import React, { useContext, useEffect, useState } from "react";
import "./Wishlist.css";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [animatedItemId, setAnimatedItemId] = useState(null);

  // Animation for page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Show notification with animation
  const showToastNotification = (message, isError = false) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  // Move to cart with animation
  const handleMoveToCart = (item) => {
    setAnimatedItemId(item.id);
    addToCart(item);
    showToastNotification(`✨ ${item.title.substring(0, 30)} added to cart!`);
    
    setTimeout(() => {
      setAnimatedItemId(null);
    }, 500);
  };

  // Remove from wishlist with animation
  const handleRemoveItem = (id, title) => {
    removeFromWishlist(id);
    showToastNotification(`🗑️ Removed from wishlist`, true);
  };

  // Get greeting based on wishlist count
  const getWishlistGreeting = () => {
    if (wishlistItems.length === 0) return "Your wishlist is waiting ✨";
    if (wishlistItems.length === 1) return "You have 1 saved treasure! 💎";
    if (wishlistItems.length <= 3) return "Great choices! 🎯";
    return "Amazing collection! 🌟";
  };

  return (
    <section className="wishlist-page">
      {/* Toast Notification */}
      {showNotification && (
        <div className="wishlist-toast">
          <div className="toast-content">
            <Sparkles size={18} />
            <span>{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="wishlist-header">
        <button className="wishlist-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
          <span>Back</span>
        </button>

        <div className="header-content">
          <div className="header-icon">
            <Heart size={32} fill="#ff4757" stroke="#ff4757" />
          </div>
          <div>
            <h1>
              My Wishlist
              <span className="wishlist-count-badge">{wishlistItems.length}</span>
            </h1>
            <p className="wishlist-greeting">{getWishlistGreeting()}</p>
          </div>
        </div>

        {wishlistItems.length > 0 && (
          <div className="header-stats">
            <div className="stat">
              <Star size={16} />
              <span>Saved Items</span>
              <strong>{wishlistItems.length}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-animation">
            <div className="floating-heart">
              <Heart size={80} strokeWidth={1.5} />
            </div>
            <div className="floating-heart-2">
              <Heart size={40} fill="#ff4757" stroke="#ff4757" />
            </div>
            <div className="floating-heart-3">
              <Heart size={60} strokeWidth={1} />
            </div>
          </div>
          <h2>Your wishlist is empty 😢</h2>
          <p>Save your favorite products here and they'll appear in this list.</p>
          <button className="wishlist-shop-btn" onClick={() => navigate("/")}>
            <ShoppingCart size={18} />
            Continue Shopping
            <TrendingUp size={16} />
          </button>
        </div>
      ) : (
        <>
          {/* Wishlist Grid */}
          <div className="wishlist-grid">
            {wishlistItems.map((item, index) => (
              <div
                className={`wishlist-card ${animatedItemId === item.id ? "card-removing" : ""}`}
                key={item.id}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image Section */}
                <div className="wishlist-image">
                  <img src={item.image} alt={item.title} />
                  <div className="image-overlay"></div>
                  
                  {/* Remove Button */}
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => handleRemoveItem(item.id, item.title)}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Favorite Badge */}
                  <div className="favorite-badge">
                    <Heart size={12} fill="#ff4757" stroke="#ff4757" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="wishlist-content">
                  <div className="content-header">
                    <span className="wishlist-category">{item.category}</span>
                    <div className="rating">
                      <Star size={14} fill="#ffd700" stroke="#ffd700" />
                      <span>4.5</span>
                    </div>
                  </div>

                  <h3>{item.title}</h3>

                  <div className="price-section">
                    <div className="wishlist-price">{item.price}</div>
                    {item.originalPrice && (
                      <div className="original-price">{item.originalPrice}</div>
                    )}
                    {item.discount && <div className="discount-badge">-{item.discount}%</div>}
                  </div>

                  <div className="wishlist-stock">
                    <div className={`stock-indicator ${item.stock > 0 ? "in-stock" : "out-stock"}`}>
                      <span className="stock-dot"></span>
                      {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="wishlist-buttons">
                    <button
                      className="wishlist-cart-btn"
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.stock === 0}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="wishlist-bottom-bar">
            <div className="bottom-content">
              <div className="total-info">
                <Heart size={20} fill="#ff4757" stroke="#ff4757" />
                <span>{wishlistItems.length} items in wishlist</span>
              </div>
              <button className="add-all-btn" onClick={() => navigate("/")}>
                Browse More Products
                <TrendingUp size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Wishlist;