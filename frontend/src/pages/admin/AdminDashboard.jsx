import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If not admin, the backend will return 403, but let's be safe.
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/dashboard");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, navigate]);

  const dashboardCards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: "📦",
    },
    {
      title: "Customers",
      value: stats.totalUsers,
      icon: "👥",
    },
    {
      title: "Sellers",
      value: stats.totalSellers,
      icon: "🏪",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: "🛒",
    },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src="/logo.png"
            alt="MiniMartHub"
            className="admin-logo"
          />
          <h2>MiniMartHub</h2>
        </div>

        <ul className="sidebar-menu">
          <li className="active">
            <Link to="/admin">📊 Dashboard</Link>
          </li>

          <li>
            <Link to="/admin/users">👥 Users</Link>
          </li>

          <li>
            <Link to="/admin/sellers">🏪 Sellers</Link>
          </li>

          <li>
            <Link to="/admin/products">📦 Products</Link>
          </li>

          <li>
            <Link to="/admin/orders">🛒 Orders</Link>
          </li>

          <li>
            <Link to="/admin/reports">📈 Reports</Link>
          </li>

          <li>
            <Link to="/settings">⚙ Settings</Link>
          </li>

          <li>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem("minimarthub-token");
              localStorage.removeItem("minimarthub-user");
              window.location.href = "/admin-login";
            }}>🚪 Logout</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">

        {/* Top Bar */}
        <div className="topbar">
          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Welcome back! Here's what's happening in
              MiniMartHub.lk today.
            </p>
          </div>

          <div className="admin-profile">
            <div className="profile-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <span>{user?.name || "Admin"}</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading dashboard...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "red" }}>{error}</div>
        ) : (
          <>
        {/* Stats */}
        <div className="stats-grid">
          {dashboardCards.map((item, index) => (
            <div
              className="stat-card"
              key={index}
            >
              <div className="stat-icon">
                {item.icon}
              </div>

              <div>
                <h3>{item.title}</h3>
                <p>{item.value}</p>
              </div>
            </div>
          ))}

          <div className="stat-card revenue-card">
            <div className="stat-icon">
              💰
            </div>

            <div>
              <h3>Total Revenue</h3>
              <p>Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>

          <div className="action-buttons">

            <Link to="/admin/products">
              <button>Add Product</button>
            </Link>

            <Link to="/admin/users">
              <button>Manage Users</button>
            </Link>

            <Link to="/admin/sellers">
              <button>Manage Sellers</button>
            </Link>

            <Link to="/admin/orders">
              <button>Manage Orders</button>
            </Link>

            <Link to="/admin/reports">
              <button>View Reports</button>
            </Link>

          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.user?.name || "Unknown"}</td>
                    <td>
                      <span className={`status ${order.orderStatus === "delivered" ? "delivered" : order.orderStatus === "cancelled" ? "cancelled" : "pending"}`}>
                        {order.orderStatus.toUpperCase()}
                      </span>
                    </td>
                    <td>Rs. {order.totalPrice.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;