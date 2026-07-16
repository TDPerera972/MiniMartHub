import React, { useState, useEffect, useContext } from "react";
import "./AdminPages.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/users");
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await api.delete(`/api/admin/users/${id}`);
        if (res.data.success) {
          setUsers(users.filter(u => u._id !== id));
          alert("User deleted successfully");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">

      <div className="page-header">
        <h1>Manage Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          className="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center" }}>Loading users...</div>
        ) : error ? (
          <div style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center" }}>No users found.</div>
        ) : (

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>#{u._id.substring(0, 6)}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role}
                  </span>
                </td>

                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(u._id)}
                    disabled={u.role === "admin"}
                    style={{ opacity: u.role === "admin" ? 0.5 : 1, cursor: u.role === "admin" ? "not-allowed" : "pointer" }}
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

export default ManageUsers;