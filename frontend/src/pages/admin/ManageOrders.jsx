import React, { useState, useEffect, useContext } from "react";
import "./AdminPages.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManageOrders = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const VALID_ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/orders");
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {

        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/api/admin/orders/${id}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {

      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((o) =>
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Manage Orders</h1>
        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center" }}>Loading orders...</div>
        ) : error ? (
          <div style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center" }}>No orders found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.substring(0, 8).toUpperCase()}</td>
                  <td>{o.user?.name || "Unknown"}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>Rs. {o.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`status ${o.orderStatus === "delivered" ? "delivered" : o.orderStatus === "cancelled" ? "cancelled" : "pending"}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
                    >
                      {VALID_ORDER_STATUSES.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
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

export default ManageOrders;