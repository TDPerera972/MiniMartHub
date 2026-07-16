import React, { useState } from "react";
import api from "../services/api";
import { ShieldAlert } from "lucide-react";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/admin-login", { username, password });
      if (res.data.success) {
        localStorage.setItem("minimarthub-token", res.data.token);
        localStorage.setItem("minimarthub-user", JSON.stringify(res.data.user));
        // Hard redirect completely ensures the central AuthContext hydrates with Admin privileges
        window.location.href = "/admin";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <ShieldAlert size={48} className="shield-icon" strokeWidth={1.5} />
          <h2>Admin Portal</h2>
          <p>Secure access for administrators</p>
        </div>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form 
          onSubmit={handleSubmit} 
          className="admin-login-form" 
          autoComplete="off"
        >
          <div className="admin-input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              autoComplete="new-password" /* Workaround to prevent aggressive browser autofill */
              spellCheck="false"
              data-form-type="other"
            />
          </div>
          <div className="admin-input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="new-password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="admin-submit-btn"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
