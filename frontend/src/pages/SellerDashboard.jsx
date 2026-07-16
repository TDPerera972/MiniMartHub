import React, { useState, useEffect } from "react";
import "./SellerDashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Package,
  Plus,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  DollarSign,
  Star,
  Clock,
  AlertCircle
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isSeller } = React.useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!user) return; // Wait for auth
    if (!isSeller) {
      navigate("/profile");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await api.get("/api/sellers/dashboard");
        // Fetch orders
        const ordersRes = await api.get("/api/orders/seller");

        if (statsRes.data.success) {
          setDashboardData({
            totalProducts: statsRes.data.totalProducts,
            totalOrders: statsRes.data.totalOrders,
            totalRevenue: statsRes.data.totalRevenue,
            pendingOrders: statsRes.data.pendingOrders,
            deliveredOrders: statsRes.data.deliveredOrders,
          });
        }

        if (ordersRes.data.success) {
          // Take top 5 recent orders
          setRecentOrders(ordersRes.data.orders.slice(0, 5));
        }
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, isSeller, navigate]);

  const sellerName = user?.name || "Seller";
  const sellerOwner = "Verified Seller";

  const stats = [
    { title: "Total Products", value: dashboardData.totalProducts, icon: Package, color: "blue", trend: "" },
    { title: "Total Orders", value: dashboardData.totalOrders, icon: ShoppingBag, color: "green", trend: "" },
    { title: "Total Revenue", value: `LKR ${dashboardData.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "orange", trend: "" },
    { title: "Pending Orders", value: dashboardData.pendingOrders, icon: Users, color: "purple", trend: "" },
  ];

  // Enhanced back button function with multiple fallbacks
  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      const fromPage = location.state?.from?.pathname || "/profile";
      navigate(fromPage);
    }
  };

  // Alternative: Direct navigation to profile
  const goToProfile = () => {
    navigate("/profile");
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <section className="seller-dashboard">
      <div className="dashboard-container">
        
        {/* HEADER WITH IMPROVED BACK BUTTON */}
        <div className="dashboard-header">
          <div className="back-button-group">
            <button className="back-btn" onClick={handleGoBack}>
              <ArrowLeft size={20} />
              <span className="back-text">Back</span>
            </button>
            <button className="profile-shortcut" onClick={goToProfile} title="Go to Profile">
              {/* Profile icon or text can go here */}
            </button>
          </div>
          
          <div className="seller-info">
            <div className="greeting-badge">
              <span className="greeting-icon">✨</span>
              <span>{getGreeting()}</span>
            </div>
            <h1>Seller Dashboard</h1>
            <p>
              Welcome back, <strong>{sellerName}</strong> 👋
              {sellerOwner && (
                <span className="seller-owner" style={{ marginLeft: "10px", fontSize: "12px", background: "#e0e7ff", color: "#4f46e5", padding: "2px 8px", borderRadius: "4px" }}>
                  {sellerOwner.toUpperCase()}
                </span>
              )}
            </p>
          </div>
          
          <div className="header-stats">
            <div className="header-stat">
              <Star size={16} />
              <span>4.8 Rating</span>
            </div>
            <div className="header-stat">
              <Clock size={16} />
              <span>Active Now</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", fontSize: "18px" }}>Loading seller dashboard...</div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "50px", color: "red", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <AlertCircle size={24} /> {error}
          </div>
        ) : (
          <>
        {/* STATS GRID WITH ANIMATIONS */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className={`stat-card ${stat.color}`} key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon">
                <stat.icon size={28} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
                {stat.trend && (
                  <span className="stat-trend">
                    <ChevronRight size={12} />
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => navigate("/add-product")}>
            <Plus size={20} />
            Add New Product
          </button>
          {/* ❌ FIX 1: Manage Products points to /seller-products */}
          <button className="action-btn" onClick={() => navigate("/seller-products")}>
            <Package size={20} />
            Manage Products
          </button>
          {/* ❌ FIX 2: View Orders points to /seller-orders */}
          <button className="action-btn" onClick={() => navigate("/seller-orders")}>
            <ShoppingBag size={20} />
            View Orders
          </button>
          {/* ❌ FIX 3: Earnings points to /seller-analytics */}
          <button className="action-btn" onClick={() => navigate("/seller-analytics")}>
            <DollarSign size={20} />
            Earnings
          </button>
        </div>

        {/* RECENT ORDERS WITH IMPROVED TABLE */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            {/* ❌ FIX 2: View All Orders points to /seller-orders */}
            <button className="view-all-btn" onClick={() => navigate("/seller-orders")}>
              View All Orders
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="orders-table">
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>No orders yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => {
                    // Calculate order amount for this seller
                    let orderAmount = 0;
                    order.items.forEach(item => {
                      if (item.seller?.toString() === user._id.toString()) {
                        orderAmount += item.price * item.quantity;
                      }
                    });

                    return (
                      <tr key={order._id}>
                        <td className="order-id">#{order._id.substring(0, 8).toUpperCase()}</td>
                        <td>{order.user?.name || "Unknown Customer"}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="amount">LKR {orderAmount.toLocaleString()}</td>
                        <td>
                          <span className={`status ${order.orderStatus.toLowerCase()}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="view-order-btn"
                            onClick={() => navigate("/seller-orders")}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PERFORMANCE METRICS */}
        <div className="performance-metrics">
          <div className="metric-card">
            <div className="metric-title">Completion Rate</div>
            <div className="metric-value">98%</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "98%" }}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Response Time</div>
            <div className="metric-value">2.4 hrs</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Customer Satisfaction</div>
            <div className="metric-value">4.9/5</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "94%" }}></div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </section>
  );
};

export default SellerDashboard;