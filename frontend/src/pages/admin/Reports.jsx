import React, { useState, useEffect, useContext } from "react";
import "./AdminPages.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, navigate]);

  // Mock monthly data for demonstration based on total revenue
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const mockMonthlySales = months.map((month, index) => ({
    month,
    value: Math.floor(stats.totalRevenue * (0.1 + (index * 0.05)))
  }));
  const maxSale = Math.max(...mockMonthlySales.map(s => s.value), 1);

  // Pie chart calculation
  const pendingOrders = stats.pendingOrders || 0;
  const completedOrders = Math.max(stats.totalOrders - pendingOrders, 0);
  const pendingPct = stats.totalOrders > 0 ? Math.round((pendingOrders / stats.totalOrders) * 100) : 0;
  
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
      </div>

      {loading ? (
        <div style={{ padding: "30px", textAlign: "center" }}>Loading reports...</div>
      ) : error ? (
        <div style={{ padding: "30px", color: "red", textAlign: "center" }}>{error}</div>
      ) : (
        <>
          {/* 4 Overview Cards */}
          <div className="stats-row" style={{ marginBottom: "30px" }}>
            <div className="small-card" style={{ borderTopColor: "#1E2F86" }}>
              <h3 style={{ color: "#6b7280", fontSize: "14px", textTransform: "uppercase" }}>Total Revenue</h3>
              <p style={{ color: "#1E2F86" }}>Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="small-card" style={{ borderTopColor: "#57D42A" }}>
              <h3 style={{ color: "#6b7280", fontSize: "14px", textTransform: "uppercase" }}>Total Orders</h3>
              <p style={{ color: "#57D42A" }}>{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="small-card" style={{ borderTopColor: "#f59e0b" }}>
              <h3 style={{ color: "#6b7280", fontSize: "14px", textTransform: "uppercase" }}>Total Products</h3>
              <p style={{ color: "#f59e0b" }}>{stats.totalProducts.toLocaleString()}</p>
            </div>
            <div className="small-card" style={{ borderTopColor: "#8b5cf6" }}>
              <h3 style={{ color: "#6b7280", fontSize: "14px", textTransform: "uppercase" }}>Total Sellers</h3>
              <p style={{ color: "#8b5cf6" }}>{stats.totalSellers.toLocaleString()}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "20px" }}>
            
            {/* Bar Chart */}
            <div style={{ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
              <h3 style={{ color: "#1E2F86", marginBottom: "20px" }}>Monthly Sales Trend</h3>
              <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "15px", paddingTop: "20px" }}>
                {mockMonthlySales.map((data, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div 
                      style={{ 
                        width: "100%", 
                        background: "linear-gradient(to top, #1E2F86, #3b82f6)", 
                        height: `${(data.value / maxSale) * 100}%`,
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.5s ease"
                      }} 
                      title={`Rs. ${data.value.toLocaleString()}`}
                    ></div>
                    <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold" }}>{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div style={{ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ color: "#1E2F86", marginBottom: "20px", alignSelf: "flex-start" }}>Order Status Distribution</h3>
              
              <div style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: `conic-gradient(#57D42A ${100 - pendingPct}%, #f59e0b 0)`,
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
                marginBottom: "20px"
              }}></div>
              
              <div style={{ display: "flex", gap: "30px", width: "100%", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", background: "#57D42A", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "14px", color: "#374151", fontWeight: "bold" }}>Completed ({100 - pendingPct}%)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "12px", height: "12px", background: "#f59e0b", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "14px", color: "#374151", fontWeight: "bold" }}>Pending ({pendingPct}%)</span>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Reports;