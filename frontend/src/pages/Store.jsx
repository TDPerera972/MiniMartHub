import React, { useContext, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import {
  Star, 
  MapPin, 
  ShoppingBag, 
  Store as StoreIcon, 
  Heart, 
  ShoppingCart,
  Award,
  Percent,
  Filter,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';
import './Store.css';

const Store = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Memoize seller products and seller details
  const { sellerProducts, seller } = useMemo(() => {
    const filteredProducts = products.filter(
      product => String(product.seller?._id) === String(sellerId) || String(product.seller?.id) === String(sellerId)
    );
    const sellerData = filteredProducts[0]?.seller || null;
    return { sellerProducts: filteredProducts, seller: sellerData };
  }, [products, sellerId]);

  // Memoize category count for the seller
  const categoryName = useMemo(() => {
    if (!seller) return '';
    return sellerProducts[0]?.category || seller.category || 'General';
  }, [seller, sellerProducts]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const productsCopy = [...sellerProducts];
    switch(sortBy) {
      case 'newest':
        return productsCopy.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'price-low':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price-high':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'rating':
        return productsCopy.sort((a, b) => b.rating - a.rating);
      default:
        return productsCopy;
    }
  }, [sellerProducts, sortBy]);

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id || product._id)) {
      removeFromWishlist(product.id || product._id);
    } else {
      addToWishlist(product);
    }
  };

  // Handle buy now
  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/cart');
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // If seller not found
  if (!seller) {
    return (
      <div className="store-not-found">
        <div className="not-found-content">
          <StoreIcon className="not-found-icon" />
          <h2>Seller Not Found</h2>
          <p>The seller you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="back-home-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="store-page">
      {/* SECTION 1: Store Header */}
      <div className="store-header">
        <div className="store-header-content">
          <div className="store-logo-container">
            <img 
              src={seller.logo} 
              alt={seller.name} 
              className="store-logo"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150/172b78/FFFFFF?text=Store';
              }}
            />
          </div>
          <div className="store-info">
            <div className="store-name-wrapper">
              <h1 className="store-name">{seller.name}</h1>
              <span className="verified-badge-large">
                <Award size={14} />
                Verified Seller
              </span>
            </div>
            
            <div className="store-rating-location">
              <div className="store-rating">
                <Star className="star-icon" size={16} fill="#fbbf24" />
                <span>{seller.rating}</span>
              </div>
              <div className="store-location">
                <MapPin className="location-icon" size={16} />
                <span>{seller.location}</span>
              </div>
            </div>

            <p className="store-description">{seller.description}</p>

            <div className="store-meta-tags">
              <Link to="#products" className="meta-tag">
                <ShoppingBag className="tag-icon" size={16} />
                {sellerProducts.length} Products
              </Link>
              <span className="meta-tag">
                <StoreIcon className="tag-icon" size={16} />
                {categoryName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Store Statistics */}
      <div className="store-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper products-icon">
            <ShoppingBag size={22} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{sellerProducts.length}</h3>
            <p className="stat-label">PRODUCTS</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper rating-icon">
            <Star size={22} fill="#f59e0b" />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{seller.rating}</h3>
            <p className="stat-label">RATING</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper verified-icon">
            <Award size={22} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{seller.isVerified ? 'Yes' : 'No'}</h3>
            <p className="stat-label">VERIFIED</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper location-icon-stat">
            <MapPin size={22} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number-location">{seller.location}</h3>
            <p className="stat-label">LOCATION</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Store Products */}
      <div className="store-products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">All Products</h2>
          <div className="section-controls">
            <div className="sort-container">
              <button 
                className="sort-trigger"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <Filter size={16} />
                Sort by: {sortBy === 'newest' ? 'Newest First' : 
                          sortBy === 'price-low' ? 'Price: Low to High' :
                          sortBy === 'price-high' ? 'Price: High to Low' :
                          'Top Rated'}
                <ChevronDown size={16} className={`sort-chevron ${showSortDropdown ? 'open' : ''}`} />
              </button>
              {showSortDropdown && (
                <div className="sort-dropdown">
                  <button onClick={() => { setSortBy('newest'); setShowSortDropdown(false); }}>
                    Newest First
                  </button>
                  <button onClick={() => { setSortBy('price-low'); setShowSortDropdown(false); }}>
                    Price: Low to High
                  </button>
                  <button onClick={() => { setSortBy('price-high'); setShowSortDropdown(false); }}>
                    Price: High to Low
                  </button>
                  <button onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }}>
                    Top Rated
                  </button>
                </div>
              )}
            </div>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="no-products-message">
            <p>No products available from this seller.</p>
          </div>
        ) : (
          <>
            <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {sortedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div 
                    className="product-image-wrapper"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300/172b78/FFFFFF?text=Product';
                      }}
                    />
                    {product.discount && (
                      <div className="discount-badge">
                        <Percent className="discount-icon" size={12} />
                        {product.discount}% OFF
                      </div>
                    )}
                    <button 
                      className={`wishlist-btn ${isInWishlist(product.id || product._id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                      aria-label="Add to wishlist"
                    >
                      {isInWishlist(product.id || product._id) ? (
                        <Heart size={18} fill="#ef4444" />
                      ) : (
                        <Heart size={18} />
                      )}
                    </button>
                  </div>

                  <div className="product-details" onClick={() => handleProductClick(product.id)}>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    
                    <div className="product-price-wrapper">
                      <span className="product-price">Rs. {product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                        <span className="product-old-price">Rs. {product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="product-rating-stock">
                      <div className="product-rating">
                        <Star className="star-icon-small" size={14} fill="#fbbf24" />
                        <span>{product.rating}</span>
                      </div>
                      <div className="product-stock">
                        <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="cart-icon" size={16} />
                      Add to Cart
                    </button>
                    <button 
                      className="buy-now-btn"
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination/Product Count */}
            <div className="products-footer">
              <p className="product-count-info">
                Showing 1 to {sortedProducts.length} of {sortedProducts.length} products
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Store;