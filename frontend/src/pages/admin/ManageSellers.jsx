import React, { useState, useEffect, useContext } from "react";
import "./AdminPages.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManageSellers = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchSellers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/sellers");
        if (res.data.success) {
          setSellers(res.data.sellers);
        }
      } catch (err) {

        setError("Failed to load sellers.");
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [user, navigate]);

  const handleUpdateStatus = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this seller as ${status}?`)) {
      try {
        const res = await api.put(`/api/admin/sellers/${id}/status`, { status });
        if (res.data.success) {
          setSellers(sellers.map(s => s._id === id ? { ...s, status } : s));
          alert(`Seller ${status} successfully`);
        }
      } catch (err) {

        alert(err.response?.data?.message || "Failed to update seller status");
      }
    }
  };

  const filteredSellers = sellers.filter((s) =>
    (s.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.shopName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Manage Sellers</h1>
        <input
          type="text"
          placeholder="Search sellers..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center" }}>Loading sellers...</div>
        ) : error ? (
          <div style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</div>
        ) : filteredSellers.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center" }}>No sellers found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Seller Name</th>
                <th>Email</th>
                <th>Store / Business</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSellers.map((s) => (
                <tr key={s._id}>
                  <td>#{s._id.substring(0, 6)}</td>
                  <td>{s.user?.name || "Unknown"}</td>
                  <td>{s.user?.email || "Unknown"}</td>
                  <td>{s.shopName}</td>
                  <td>
                    <span className={`status ${s.status === "approved" ? "delivered" : s.status === "rejected" ? "cancelled" : "pending"}`}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "10px" }}>
                    {s.status !== "approved" && (
                      <button 
                        style={{ padding: "5px 10px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => handleUpdateStatus(s._id, "approved")}
                      >
                        Approve
                      </button>
                    )}
                    {s.status !== "rejected" && (
                      <button 
                        style={{ padding: "5px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        onClick={() => handleUpdateStatus(s._id, "rejected")}
                      >
                        Reject
                      </button>
                    )}
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

export default ManageSellers;