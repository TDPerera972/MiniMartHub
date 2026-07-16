import React, { useContext, useCallback, useMemo } from "react";
import "./Categories.css";
import {
  ShoppingBag,
  Shirt,
  Smartphone,
  Home,
  Heart,
  Dumbbell,
  BookOpen,
  Sprout,
  LayoutGrid,
  Baby,
  PawPrint,
  Hammer,
  Paintbrush,
  Apple,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import { categoryMap, getCategoryValue } from "../../data/categoryMap";

const Categories = () => {
  const navigate = useNavigate();
  const { products, selectedCategory, setSelectedCategory } = 
    useContext(ProductContext);

  // Get category details with fallback
  const getCategoryDetails = useCallback((categoryLabel) => {
    if (categoryLabel === "All Categories") {
      return { 
        icon: <LayoutGrid size={42} />, 
        title: "All Categories", 
        color: "#172b78", 
        productCount: products.length,
        value: "All Categories"
      };
    }

    const value = categoryMap[categoryLabel];
    const productCount = products.filter(p => getCategoryValue(p) === value).length;
    
    let icon;
    let color;

    switch (categoryLabel) {
      case "Agriculture & Gardening": icon = <Sprout size={42} />; color = "#2ecc71"; break;
      case "Electronics & Accessories": icon = <Smartphone size={42} />; color = "#3498db"; break;
      case "Home & Kitchen": icon = <Home size={42} />; color = "#27ae60"; break;
      case "Groceries & Food": icon = <Apple size={42} />; color = "#e67e22"; break;
      case "Fashion & Clothing": icon = <Shirt size={42} />; color = "#9b59b6"; break;
      case "Beauty & Personal Care": icon = <Heart size={42} />; color = "#e91e63"; break;
      case "Baby & Kids": icon = <Baby size={42} />; color = "#f06292"; break;
      case "Sports & Fitness": icon = <Dumbbell size={42} />; color = "#f39c12"; break;
      case "Pets & Animal Care": icon = <PawPrint size={42} />; color = "#795548"; break;
      case "Hardware & Tools": icon = <Hammer size={42} />; color = "#607d8b"; break;
      case "Stationery & Books": icon = <BookOpen size={42} />; color = "#16a085"; break;
      case "Handicrafts & Local Products": icon = <Paintbrush size={42} />; color = "#d35400"; break;
      default: 
        icon = <ShoppingBag size={42} />; 
        color = "#95a5a6";
    }
    
    return { icon, title: categoryLabel, color, productCount, value };
  }, [products]);

  // Get categories to display
  const categoriesToDisplay = useMemo(() => {
    return Object.keys(categoryMap).map(label => getCategoryDetails(label));
  }, [getCategoryDetails]);

  const handleCategoryClick = (item) => {
    setSelectedCategory(item.value);
    
    // Navigate to all-products with category filter
    if (item.value === "All Categories") {
      navigate("/products");
    } else {
      navigate(`/products?category=${encodeURIComponent(item.value)}`);
    }
  };

  return (
    <section className="categories">
      <div className="categories-header">
        <h2>Browse Categories</h2>
        <p>Discover products and services from trusted Sri Lankan sellers</p>
      </div>

      <div className="categories-grid">
        {categoriesToDisplay.map((item, index) => (
          <div
            className={`category-card ${
              selectedCategory === item.title ? "active" : ""
            }`}
            key={index}
            onClick={() => handleCategoryClick(item)}
            style={{ '--category-color': item.color }}
          >
            <div className="category-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p className="category-product-count">{item.productCount} Products</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;