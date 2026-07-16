import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import "./Navbar.css";

import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { CartContext } from "../../context/CartContext";
import { ProductContext } from "../../context/ProductContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  /* MOBILE MENU STATE */
  const [mobileMenu, setMobileMenu] = useState(false);
  
  /* SEARCH SUGGESTIONS VISIBILITY */
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  /* CONTEXTS */
  const { cartItems, totalItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { products = [] } = useContext(ProductContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  /* SEARCH SUGGESTIONS LOGIC */
  const suggestions = searchTerm.length > 0
    ? products.filter((product) =>
        product.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  /* HANDLE SEARCH */
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      setMobileMenu(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenu(false);
  };

  /* CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* CLOSE MOBILE MENU ON DESKTOP RESIZE */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenu) {
        setMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenu]);

  /* PREVENT BODY SCROLL WHEN MOBILE MENU OPEN */
  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenu]);

  return (
    <nav className="custom-navbar">
      
      {/* 1. LOGO SECTION */}
      <Link to="/" className="navbar-logo" onClick={() => setMobileMenu(false)}>
        <div className="logo-icon-box">M</div>
        <span className="logo-brand-text">MiniMartHub</span>
      </Link>

      {/* 2. DESKTOP SEARCH BAR */}
      <div className="navbar-search-wrapper" ref={searchRef}>
        <div className="search-input-container">
          <div className="search-icon-inside">
            <Search size={16} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search for products, brands, categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSearch} className="search-action-btn">
            Search
          </button>
        </div>

        {/* SEARCH SUGGESTIONS DROPDOWN */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-dropdown-box">
            <div className="dropdown-header-title">Popular Products</div>
            {suggestions.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="dropdown-item-link"
                onClick={() => {
                  setSearchTerm("");
                  setShowSuggestions(false);
                }}
              >
                <Search size={14} className="dropdown-item-icon" />
                <span>{product.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. DESKTOP UTILITY LINKS */}
      <div className="navbar-desktop-links">
        {/* Help */}
        <Link to="/help" className="nav-item-stack">
          <HelpCircle size={20} strokeWidth={2.5} />
          <span className="nav-item-label">Help</span>
        </Link>

        {/* Wishlist */}
        <Link to="/wishlist" className="nav-item-stack relative-badge">
          <Heart size={20} />
          <span className="nav-item-label">Wishlist</span>
          {wishlistItems.length > 0 && (
            <span className="navbar-notification-badge">{wishlistItems.length}</span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="nav-item-stack relative-badge">
          <div className="cart-icon-wrapper">
            <ShoppingCart size={20} />
            {(totalItems || cartItems.length) > 0 && (
              <span className="navbar-notification-badge">
                {totalItems || cartItems.length}
              </span>
            )}
          </div>
          <span className="nav-item-label">Cart</span>
        </Link>

        {/* Profile Avatar */}
        <Link to="/profile" className="profile-avatar-square">
          <User size={18} className="profile-svg-color" />
        </Link>

        {/* Login / Signup or User Info + Logout */}
        {isAuthenticated ? (
          <div className="auth-user-info">
            <span className="auth-user-name">{user?.name || "User"}</span>
          </div>
        ) : (
          <Link to="/auth" className="auth-action-btn">
            Login /<br />Signup
          </Link>
        )}
      </div>

      {/* 4. MOBILE HAMBURGER BUTTON */}
      <button className="navbar-mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
        {mobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 5. MOBILE MENU SIDEBAR DRAWERS */}
      <div className={`navbar-mobile-drawer ${mobileMenu ? "drawer-open" : ""}`}>
        <div className="mobile-search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSearch}><Search size={18} /></button>
        </div>

        <hr className="drawer-divider" />

        {/* Mobile User Info when authenticated */}
        {isAuthenticated && (
          <>
            <div className="drawer-user-info">
              <User size={20} />
              <span>{user?.name || "User"}</span>
            </div>
            <hr className="drawer-divider" />
          </>
        )}

        <Link to="/help" onClick={() => setMobileMenu(false)} className="drawer-link">
          <HelpCircle size={20} /> Help Center
        </Link>

        <Link to="/wishlist" onClick={() => setMobileMenu(false)} className="drawer-link drawer-flex-row">
          <div className="drawer-icon-label"><Heart size={20} /> Wishlist</div>
          {wishlistItems.length > 0 && <span className="drawer-badge">{wishlistItems.length}</span>}
        </Link>

        <Link to="/cart" onClick={() => setMobileMenu(false)} className="drawer-link drawer-flex-row">
          <div className="drawer-icon-label"><ShoppingCart size={20} /> Cart</div>
          {(totalItems || cartItems.length) > 0 && <span className="drawer-badge">{totalItems || cartItems.length}</span>}
        </Link>

        <Link to="/profile" onClick={() => setMobileMenu(false)} className="drawer-link">
          <User size={20} /> My Profile
        </Link>

        {!isAuthenticated && (
          <Link to="/auth" onClick={() => setMobileMenu(false)} className="drawer-auth-btn">
            Login / Signup
          </Link>
        )}
      </div>

      {/* MOBILE OVERLAY */}
      {mobileMenu && <div className="navbar-mobile-overlay" onClick={() => setMobileMenu(false)} />}
    </nav>
  );
};

export default Navbar;