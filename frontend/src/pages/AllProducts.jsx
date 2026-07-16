import React, { useContext, useState, useEffect } from "react";
import "./AllProducts.css";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { Heart, ShoppingCart, Zap, ArrowLeft, Filter, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { categoryMap, getCategoryLabel, getCategoryValue } from "../data/categoryMap";
import Navbar from "../components/Navbar/Navbar";

const AllProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    if (categoryParam && categoryParam !== "All Categories") {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("");
    }

    setSearchQuery(searchParam || "");
  }, [location.search]);

  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter((p) => getCategoryValue(p) === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryLabel(getCategoryValue(p)).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price) || 0;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    if (sortBy === "price-low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.title?.localeCompare(b.title));
    } else if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.title?.localeCompare(a.title));
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

  const handleCategoryClear = () => { 
    setSelectedCategory(""); 
    const params = new URLSearchParams(location.search);
    params.delete("category");
    navigate(params.toString() ? `/products?${params.toString()}` : "/products");
  };

  const handleResetFilters = () => {
    setSelectedCategory(""); 
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("default"); 
    setSearchQuery("");
    navigate("/products"); 
    setShowFilters(false);
  };

  const getDiscount = (price, oldPrice) => {
    const p = parseFloat(price);
    const op = parseFloat(oldPrice);
    if (!op || !p || isNaN(op) || isNaN(p) || op <= 0 || p >= op) return null;
    const pct = Math.round(((op - p) / op) * 100);
    return pct > 0 ? pct : null;
  };

  const allCategories = Object.keys(categoryMap);

  const handleWishlistToggle = (item) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const hasActiveFilters = selectedCategory || searchQuery || priceRange.min > 0 || priceRange.max < 100000 || sortBy !== "default";

  return (
    <>
      <Navbar />
      <section className="all-products">
        {/* TOP BAR */}
      <div className="products-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1>{selectedCategory ? `${getCategoryLabel(selectedCategory)} Products` : "All Products"}</h1>
          <p>Showing {filteredProducts.length} products{selectedCategory && ` in ${getCategoryLabel(selectedCategory)}`}</p>
        </div>
        <button className="filter-btn" onClick={() => setShowFilters(true)}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* HERO BANNER */}
      <div className="hero-banner">
        <div className="hero-banner-left">
          <div className="hero-lk-tag">
            <span className="hero-lk-dot"></span> Made in Sri Lanka 🇱🇰
          </div>
          <h2>Shop Local,<br /><span>Support Local</span></h2>
          <p className="hero-banner-desc">
            Authentic products from verified Sri Lankan sellers — fast islandwide delivery.
          </p>
        </div>
      </div>

      {/* ACTIVE FILTERS BAR */}
      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Active:</span>
          {selectedCategory && (
            <div className="filter-chip">
              Category: {getCategoryLabel(selectedCategory)}
              <button onClick={handleCategoryClear}>×</button>
            </div>
          )}
          {searchQuery && (
            <div className="filter-chip">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery("")}>×</button>
            </div>
          )}
          <button className="clear-all-btn" onClick={handleResetFilters}>Clear all</button>
        </div>
      )}

      {/* FILTER MODAL */}
      {showFilters && (
        <div className="filters-modal" onClick={() => setShowFilters(false)}>
          <div className="filters-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="filters-header">
              <h3>Filter Products</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            <div className="filters-body">
              <div className="filter-group">
                <label>Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {allCategories.map((c, i) => (
                    <option key={i} value={categoryMap[c]}>{c}</option>
                  ))}
                </select>
              </div>
              <button className="reset-filters-btn" onClick={handleResetFilters}>Reset All</button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS DISPLAY */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h3>No Products Found 😢</h3>
          <button className="reset-btn" onClick={handleResetFilters}>Clear All</button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((item) => {
            const discount = getDiscount(item.price, item.oldPrice);
            return (
              <div className="product-card" key={item.id}>
                <div className="product-image">
                  <img src={item.image || "/api/placeholder/300/300"} alt={item.title} />
                  
                  {/* Warning 3 Fixed: Discount එකක් තිබ්බොත් Badge එක පෙන්නන්න */}
                  {discount && (
                    <span className="discount-badge">{discount}% OFF</span>
                  )}

                  {/* Warning 2 Fixed: Wishlist Toggle එක වැඩ */}
                  <button
                    className={`wishlist-btn ${isInWishlist(item.id) ? "active" : ""}`}
                    onClick={() => handleWishlistToggle(item)}
                  >
                    <Heart 
                      size={18} 
                      fill={isInWishlist(item.id) ? "#ff4d6d" : "none"}
                      color={isInWishlist(item.id) ? "#ff4d6d" : "#9ca3af"} 
                    />
                  </button>
                </div>
                
                <div className="product-content">
                  <h3>{item.title}</h3>
                  <div className="price">Rs {parseFloat(item.price).toLocaleString()}</div>
                  
                  <div className="product-buttons">
                    <button className="cart-btn" onClick={() => addToCart(item)}>
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    
                    {/* Warning 1 Fixed: 'Zap' Icon එක දාලා Buy Now Button එක හැදුවා */}
                    <button className="buy-btn" onClick={() => { 
                      addToCart(item); 
                      navigate("/checkout"); 
                    }}>
                      <Zap size={14} /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
    </>
  );
};

export default AllProducts;
