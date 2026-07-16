import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const SellerOrders = () => {
  const navigate = useNavigate();
  const { user, isSeller } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (!isSeller) {
      navigate("/profile");
      return;
    }

    const fetchSellerOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/orders/seller");
        if (response.data && response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (err) {

        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, [user, isSeller, navigate]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Seller Orders</h1>
      <p>Manage your orders here.</p>

      {loading ? (
        <div style={{ padding: "30px 0" }}>Loading your orders...</div>
      ) : error ? (
        <div style={{ padding: "30px 0", color: "red" }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: "30px 0" }}>No orders found yet.</div>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Amount (Your Share)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // Extract only items belonging to this seller
              const sellerItems = order.items.filter(
                (item) => item.seller?.toString() === user._id.toString()
              );
              
              const sellerAmount = sellerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8).toUpperCase()}</td>
                  <td>{order.user?.name || "Unknown Customer"}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {sellerItems.map((item) => (
                        <li key={item._id || item.product}>
                          {item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>LKR {sellerAmount.toLocaleString()}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background:
                          order.orderStatus === "delivered"
                            ? "#d1fae5"
                            : order.orderStatus === "pending"
                            ? "#fef3c7"
                            : "#e0e7ff",
                        color:
                          order.orderStatus === "delivered"
                            ? "#065f46"
                            : order.orderStatus === "pending"
                            ? "#92400e"
                            : "#3730a3",
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerOrders;