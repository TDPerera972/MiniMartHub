import React, { useContext, useState, useEffect } from "react";
import "./Profile.css";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  /* NAVIGATE */
  const navigate = useNavigate();

  /* CONTEXTS */
  const { wishlistItems } = useContext(WishlistContext);
  const { cartItems } = useContext(CartContext);
  const { user, isSeller, logout, updateUser } = useContext(AuthContext);

  /* STATE */
  const [orderCount, setOrderCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  /* UPDATE FORM DATA WHEN USER LOADS */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user]);

  /* FETCH TOTAL ORDERS */
  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await api.get("/api/orders/my-orders");
        if (response.data && response.data.success) {
          setOrderCount(response.data.count || response.data.orders?.length || 0);
        }
      } catch (error) {

      }
    };

    if (user) {
      fetchOrderCount();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    alert("Logged Out Successfully 😄");
    navigate("/");
  };

  /* HANDLE INPUT CHANGE */
  const handleInputChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "phone") {
      if (!value.startsWith("+94")) {
        value = "+94";
      }
      const digits = value.slice(3).replace(/\D/g, "");
      value = "+94" + digits.slice(0, 9);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  /* HANDLE SAVE PROFILE */
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put("/api/users/profile", formData);
      if (response.data && response.data.success) {
        updateUser(response.data.user);
        setEditing(false);
        alert("Profile updated successfully");
      }
    } catch (error) {

      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profile-page">
      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <div className="profile-user">
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>{user?.name || "Guest"}</h2>
          <p>{user?.email || ""}</p>

          {/* Seller Badge */}
          {isSeller && (
            <div className="seller-badge">
              🏪 Verified Seller
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="profile-menu">
          <button
            className="profile-menu-item active"
            onClick={() => navigate("/profile")}
          >
            <User size={20} />
            My Profile
          </button>

          <button
            className="profile-menu-item"
            onClick={() =>
              navigate(
                isSeller
                  ? "/seller-dashboard"
                  : "/become-seller"
              )
            }
          >
            <Store size={20} />
            {isSeller
              ? "Seller Dashboard"
              : "Become a Seller"}
          </button>

          <button
            className="profile-menu-item"
            onClick={() => navigate("/settings")}
          >
            <Settings size={20} />
            Settings
          </button>

          <button
            className="profile-menu-item logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="profile-main">
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="profile-cards">
          <div className="profile-card">
            <div className="card-icon">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3>{orderCount}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-icon green">
              <Heart size={24} />
            </div>
            <div>
              <h3>{wishlistItems.length}</h3>
              <p>Wishlist Items</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-icon orange">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3>{cartItems.length}</h3>
              <p>Cart Items</p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="profile-actions">
          <button
            className="profile-action-btn"
            onClick={() => navigate("/orders")}
          >
            <Package size={18} />
            My Orders
          </button>

          <button
            className="profile-action-btn"
            onClick={() => navigate("/wishlist")}
          >
            <Heart size={18} />
            My Wishlist ({wishlistItems.length})
          </button>

          <button
            className="profile-action-btn"
            onClick={() => navigate("/cart")}
          >
            <ShoppingBag size={18} />
            My Cart ({cartItems.length})
          </button>

          <button
            className="profile-action-btn"
            onClick={() =>
              navigate(
                isSeller
                  ? "/seller-dashboard"
                  : "/become-seller"
              )
            }
          >
            <Store size={18} />
            {isSeller
              ? "Seller Dashboard"
              : "Become A Seller"}
          </button>
        </div>

        {/* PROFILE DETAILS */}
        <div className="profile-details">
          <h2>Personal Information</h2>

          <div className="details-grid">
            <div className="detail-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={editing ? formData.name : user?.name || ""}
                onChange={handleInputChange}
                readOnly={!editing}
              />
            </div>

            <div className="detail-group">
              <label>Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
              />
            </div>

            <div className="detail-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={editing ? formData.phone : user?.phone || "N/A"}
                onChange={handleInputChange}
                readOnly={!editing}
                maxLength={editing ? 13 : undefined}
                pattern={editing ? "^\\+94\\d{9}$" : undefined}
                title={editing ? "Please enter a valid Sri Lankan phone number" : undefined}
              />
            </div>

            <div className="detail-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={editing ? formData.location : user?.location || "Sri Lanka"}
                onChange={handleInputChange}
                readOnly={!editing}
              />
            </div>
          </div>

          <div className="profile-buttons">
            <button
              className="edit-btn"
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
            </button>

            <button
              className="home-btn"
              onClick={() => navigate("/")}
            >
              Back To Home
            </button>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Profile;