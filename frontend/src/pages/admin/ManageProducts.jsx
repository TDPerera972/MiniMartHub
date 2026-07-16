import React, { useState, useEffect, useContext } from "react";
import "./AdminPages.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManageProducts = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/products");
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {

        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await api.delete(`/api/admin/products/${id}`);
        if (res.data.success) {
          setProducts(products.filter(p => p._id !== id));
          alert("Product deleted successfully");
        }
      } catch (err) {

        alert(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.seller?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Manage Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="stats-row">
        <div className="small-card">
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div className="small-card">
          <h3>Active Products</h3>
          <p>{products.filter(p => p.stock > 0).length}</p>
        </div>

        <div className="small-card">
          <h3>Out Of Stock</h3>
          <p>{products.filter(p => p.stock <= 0).length}</p>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: "20px" }}>
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center" }}>Loading products...</div>
        ) : error ? (
          <div style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center" }}>No products found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Seller</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>#{p._id.substring(0, 6)}</td>
                  <td>{p.name}</td>
                  <td>{p.seller?.name || "Unknown"}</td>
                  <td>{p.category}</td>
                  <td>Rs. {p.price.toLocaleString()}</td>
                  <td>
                    <span className={p.stock > 0 ? "status delivered" : "status cancelled"}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;