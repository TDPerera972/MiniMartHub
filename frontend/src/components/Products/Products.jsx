import React, { useContext, useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Products.css";
import { Heart, ShoppingCart, Zap, Filter, X } from "lucide-react";
import { categoryMap, getCategoryLabel, getCategoryValue } from "../../data/categoryMap";
import { ProductContext } from "../../context/ProductContext";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";

export const Products = ({ limit }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { products = [] } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("default");

  /* Price String එකක් පිරිසිදු කරලා Number එකක් කරගන්නා ශ්‍රිතය */
  const cleanPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(String(priceStr).replace(/Rs\./g, "").replace(/,/g, "").trim()) || 0;
  };

  /* Get category from URL query params */
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    setSelectedCategory(categoryParam || "");
  }, [location.search]);

  /* Filter and sort products (Optimized with useMemo) */
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Category Filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => getCategoryValue(p) === selectedCategory);
    }

    // 2. Price Range Filter
    filtered = filtered.filter((p) => {
      const price = cleanPrice(p.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // 3. Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => cleanPrice(a.price) - cleanPrice(b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => cleanPrice(b.price) - cleanPrice(a.price));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [products, selectedCategory, priceRange.min, priceRange.max, sortBy]);

  const handleCategoryClear = () => {
    setSelectedCategory("");
    navigate("/products");
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("default");
    navigate("/products");
    setShowFilters(false);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    navigate("/checkout");
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  /* Safe discount calculation */
  const getDiscount = (price, oldPrice) => {
    const p = cleanPrice(price);
    const op = cleanPrice(oldPrice);
    if (!op || !p || op <= p) return null;
    const pct = Math.round(((op - p) / op) * 100);
    return pct > 0 ? pct : null;
  };

  const allCategories = Object.keys(categoryMap);

  return (
    <section className="products">
      {/* HEADER */}
      <div className="products-header">
        <div className="header-left">
          <h2>
            {selectedCategory ? `${getCategoryLabel(selectedCategory)} Products` : "Trending Products"}
          </h2>
          <p>
            {selectedCategory
              ? `Browse all ${getCategoryLabel(selectedCategory)} products from trusted sellers`
              : "Discover the latest products from trusted sellers"}
          </p>
        </div>

        <div className="header-right">
          {selectedCategory && (
            <div className="active-filter">
              <span>Category: {getCategoryLabel(selectedCategory)}</span>
              <button onClick={handleCategoryClear}>
                <X size={14} />
              </button>
            </div>
          )}
          <button className="filter-toggle-btn" onClick={() => setShowFilters(true)}>
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* FILTERS OVERLAY */}
      <div
        className={`filters-overlay ${showFilters ? "active" : ""}`}
        onClick={() => setShowFilters(false)}
      >
        <div className="filters-sidebar" onClick={(e) => e.stopPropagation()}>
          <div className="filters-header">
            <h3>Filter Products</h3>
            <button onClick={() => setShowFilters(false)}>×</button>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={categoryMap[cat]}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range (LKR)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: Number(e.target.value) })
                }
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="filter-spacer" />
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      </div>

      {/* NO PRODUCTS */}
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <h3>No Products Found 😢</h3>
          <p>Try searching with another category or keyword.</p>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="products-grid">
        {(limit ? filteredProducts.slice(0, limit) : filteredProducts).map((item) => {
          const discount = getDiscount(item.price, item.oldPrice);
          const numericPrice = cleanPrice(item.price);
          const numericOldPrice = cleanPrice(item.oldPrice);

          return (
            <Link to={`/product/${item.id}`} className="product-link" key={item.id}>
              <div className="product-card">
                {/* IMAGE */}
                <div className="product-image">
                  <img
                    src={item.image || "/api/placeholder/300/300"}
                    alt={item.title}
                  />

                  {/* DISCOUNT BADGE */}
                  {discount && <span className="discount-badge">{discount}% OFF</span>}

                  {/* CATEGORY BADGE */}
                  <span className="category-badge">{item.category}</span>

                  {/* WISHLIST */}
                  <button
                    className={`wishlist-btn ${isInWishlist(item.id) ? "active" : ""}`}
                    onClick={(e) => handleWishlist(e, item)}
                  >
                    <Heart
                      size={18}
                      fill={isInWishlist(item.id) ? "#ff4d6d" : "none"}
                      color={isInWishlist(item.id) ? "#ff4d6d" : "#9ca3af"}
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="product-content">
                  <span className="product-category">{getCategoryLabel(getCategoryValue(item))}</span>
                  <h3>{item.title}</h3>

                  <div className="product-price">
                    <span className="new-price">
                      LKR {numericPrice.toLocaleString()}
                    </span>
                    {numericOldPrice > 0 && (
                      <span className="old-price">
                        LKR {numericOldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="product-meta">
                    {item.rating && (
                      <div className="product-rating">
                        <span className="stars">★</span>
                        <span>{item.rating}</span>
                        <span className="rating-count">({item.reviews || 0})</span>
                      </div>
                    )}
                    {item.weight && <div className="product-weight">Weight: {item.weight}</div>}
                    {item.stock !== undefined && <div className="product-stock">Stock: {item.stock}</div>}
                  </div>

                  <div className="product-buttons">
                    <button className="cart-btn" onClick={(e) => handleAddToCart(e, item)}>
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>
                    <button className="buy-btn" onClick={(e) => handleBuyNow(e, item)}>
                      <Zap size={16} />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* VIEW ALL BUTTON */}
      {limit && filteredProducts.length > 0 && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={() => navigate("/products")}>
            View All Products →
          </button>
        </div>
      )}
    </section>
  );
};