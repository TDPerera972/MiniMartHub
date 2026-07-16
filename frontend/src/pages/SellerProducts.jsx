import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { user, isSeller } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (!isSeller) {
      navigate("/profile");
      return;
    }

    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/products/my-products");
        if (response.data && response.data.success) {
          setProducts(response.data.products);
        }
      } catch (err) {

        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [user, isSeller, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await api.delete(`/api/products/${id}`);
        if (response.data.success) {
          setProducts(products.filter((p) => p._id !== id));
          alert("Product deleted successfully");
        }
      } catch (error) {

        alert(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Seller Products</h1>
      <p>Manage your products here.</p>

      <button onClick={() => navigate("/add-product")} style={{ marginBottom: "20px" }}>
        Add New Product
      </button>

      {loading ? (
        <div style={{ padding: "30px 0" }}>Loading your products...</div>
      ) : error ? (
        <div style={{ padding: "30px 0", color: "red" }}>{error}</div>
      ) : products.length === 0 ? (
        <div style={{ padding: "30px 0" }}>No products found. Add some products to start selling!</div>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>LKR {product.price.toLocaleString()}</td>
                <td>{product.stock}</td>
                <td>
                  <button onClick={() => alert("Edit product feature coming soon!")}>Edit</button>
                  <button onClick={() => handleDelete(product._id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerProducts;