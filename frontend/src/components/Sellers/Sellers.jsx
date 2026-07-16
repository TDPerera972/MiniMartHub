import React, { useContext, useMemo } from "react";
import "./Sellers.css";
import { Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";

const Sellers = ({ limit }) => {
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);

  // Generate unique sellers list from products
  const sellers = useMemo(() => {
    // Create a map to store unique sellers by id
    const sellerMap = new Map();

    products.forEach((product) => {
      const sellerId = product.seller?.id || product.seller?._id;
      if (sellerId) {
        
        // If seller doesn't exist in map, add them
        if (!sellerMap.has(sellerId)) {
          sellerMap.set(sellerId, {
            id: sellerId,
            name: product.seller.name || "Unknown Seller",
            rating: product.seller.rating || 0,
            image: (product.seller.image || product.seller.logo || "/sellers/default-seller.png").replace(/^\.\/?/, "/"),
            category: product.category || "General",
            products: 1,
            isTopSeller: (product.seller.rating || 0) >= 4.7
          });
        } else {
          // Increment product count for existing seller
          const existingSeller = sellerMap.get(sellerId);
          existingSeller.products += 1;
          // Update rating if needed (keep the latest or average - we'll keep the seller's rating)
          existingSeller.rating = product.seller.rating || existingSeller.rating;
          existingSeller.isTopSeller = (existingSeller.rating || 0) >= 4.7;
        }
      }
    });

    // Convert map to array and sort by product count (highest first) or rating
    return Array.from(sellerMap.values()).sort((a, b) => b.products - a.products);
  }, [products]);

  const displayedSellers = limit ? sellers.slice(0, limit) : sellers;

  return (
    <section className="sellers">
      {/* HEADER */}
      <div className="sellers-header">
        <h2>Popular Sellers</h2>
        <p>Connect with trusted sellers and service providers</p>
      </div>

      {/* GRID */}
      <div className="sellers-grid">
        {displayedSellers.map((seller) => (
          <div className="seller-card" key={seller.id}>

            {/* IMAGE */}
            <div className="seller-image">
              <img
                src={seller.image}
                alt={seller.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/sellers/default-seller.png";
                }}
              />
            </div>

            {/* TOP SELLER BADGE */}
            {seller.isTopSeller && <span className="seller-badge">Top Seller</span>}

            {/* CONTENT */}
            <div className="seller-content">
              <div className="seller-store-row">
                <div className="seller-avatar">{seller.name.charAt(0)}</div>
                <h3>{seller.name}</h3>
              </div>
              <p>{seller.category}</p>

              <div className="seller-meta">
                <div className="seller-rating">
                  <Star className="star-icon" size={12} fill="currentColor" />
                  {seller.rating.toFixed(1)}
                </div>
                <span className="seller-products">{seller.products} Products</span>
              </div>

              <button onClick={() => navigate(`/store/${seller.id}`)}>Visit Store</button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW ALL BUTTON */}
      {limit && sellers.length > limit && (
        <div className="view-all-sellers-container">
          <button className="view-all-sellers-btn" onClick={() => navigate("/sellers")}>
            View All Sellers <ArrowRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Sellers;