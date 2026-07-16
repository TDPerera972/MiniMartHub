import React, { useState } from "react";
import "./BecomeSeller.css";
import {
  ArrowLeft,
  Upload,
  Store,
  ShieldCheck,
  Truck,
  TrendingUp,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const BecomeSeller = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  /* FORM STATES */
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+94");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("+94")) {
      val = "+94";
    }
    const digits = val.slice(3).replace(/\D/g, "");
    setPhone("+94" + digits.slice(0, 9));
  };
  const [logoFile, setLogoFile] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* HANDLE FILE UPLOAD */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  /* SUBMIT HANDLER */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      const formData = {
        shopName,
        ownerName,
        email,
        phone,
        nic,
        address,
        category,
      };

      if (logoFile) {
        const reader = new FileReader();
        reader.readAsDataURL(logoFile);
        reader.onloadend = async () => {
          formData.logo = reader.result;
          await submitApi(formData);
        };
      } else {
        await submitApi(formData);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit application");
    }
  };

  const submitApi = async (formData) => {
    const response = await api.post("/api/sellers/apply", formData);
    
    if (response.data && response.data.success) {
      updateUser(response.data.user);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  };

  return (
    <section className="seller-page">
      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <Sparkles size={48} />
            <h3>Account Created Successfully! 🎉</h3>
            <p>Redirecting to dashboard...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <button className="seller-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} />
        <span> </span>
      </button>

      <div className="seller-container">
        {/* LEFT SIDE - CREATIVE SECTION */}
        <div className="seller-left">
          <div className="seller-left-content">
            {/* ANIMATED BADGE */}
            <div className="seller-badge pulse-animation">
              <Store size={16} />
              Trusted Marketplace Seller
            </div>

            {/* TITLE WITH ANIMATION */}
            <h1>
              Start Selling on
              <span className="gradient-text"> MiniMartHub</span>
            </h1>

            <div className="stats-banner">
              <div className="stat">
                <TrendingUp size={20} />
                <div>
                  <strong>10K+</strong>
                  <span>Active Sellers</span>
                </div>
              </div>
              <div className="stat">
                <Star size={20} />
                <div>
                  <strong>50K+</strong>
                  <span>Happy Customers</span>
                </div>
              </div>
              <div className="stat">
                <Award size={20} />
                <div>
                  <strong>100%</strong>
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p>
              Join Sri Lanka's fastest-growing online marketplace. 
              Reach thousands of customers island-wide and grow your business exponentially.
            </p>

            {/* FEATURES WITH ANIMATION */}
            <div className="seller-features">
              <div className="seller-feature hover-slide">
                <div className="feature-icon">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <strong>Secure Platform</strong>
                  <span>Safe & trusted marketplace with buyer protection</span>
                </div>
              </div>

              <div className="seller-feature hover-slide">
                <div className="feature-icon">
                  <Truck size={22} />
                </div>
                <div>
                  <strong>Island-wide Delivery</strong>
                  <span>Integrated with leading courier services</span>
                </div>
              </div>

              <div className="seller-feature hover-slide">
                <div className="feature-icon">
                  <Store size={22} />
                </div>
                <div>
                  <strong>Easy Store Management</strong>
                  <span>Intuitive dashboard to manage products & orders</span>
                </div>
              </div>
            </div>

            {/* TESTIMONIAL */}
            <div className="testimonial">
              <div className="quote-mark">"</div>
              <p>Increased my sales by 300% within 3 months! Best platform for local sellers.</p>
              <div className="testimonial-author">
                <strong>Tharindu Dilshan</strong>
                <span>Electronics Seller</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="seller-right">
          <div className="form-header">
            <h2>Become a Seller</h2>
            <p>Join our growing community of successful sellers</p>
          </div>

          {/* FORM */}
          <form className="seller-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* SHOP NAME */}
              <div className="form-group">
                <label>Shop Name *</label>
                <input
                  type="text"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
              </div>

              {/* OWNER NAME */}
              <div className="form-group">
                <label>Owner Name *</label>
                <input
                  type="text"
                  placeholder="Enter owner full name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+94 7X XXX XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  pattern="^\+94\d{9}$"
                  title="Please enter a valid Sri Lankan phone number"
                  required
                />
              </div>

              {/* NIC */}
              <div className="form-group">
                <label>NIC Number *</label>
                <input
                  type="text"
                  placeholder="Enter NIC number"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  maxLength={12}
                  pattern="^([0-9]{9}[VvXx]|[0-9]{12})$"
                  title="Please enter a valid Sri Lankan NIC."
                  required
                />
              </div>

              {/* ADDRESS */}
              <div className="form-group full">
                <label>Business Address *</label>
                <textarea
                  placeholder="Enter complete business address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              {/* CATEGORY */}
              <div className="form-group full">
                <label>Primary Product Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">📱 Electronics & Gadgets</option>
                  <option value="Fashion">👕 Fashion & Apparel</option>
                  <option value="Grocery">🛒 Grocery & Essentials</option>
                  <option value="Home & Living">🏠 Home & Living</option>
                  <option value="Beauty">💄 Beauty & Personal Care</option>
                  <option value="Handicrafts">🎨 Handicrafts & Art</option>
                </select>
              </div>

              {/* UPLOAD LOGO */}
              <div className="form-group full">
                <label>Shop Logo</label>
                <label className="upload-box" onClick={() => document.getElementById('logoInput').click()}>
                  <Upload size={36} />
                  <h4>{logoFile ? logoFile.name : "Click to upload logo"}</h4>
                  <p>PNG, JPG or JPEG (Max 5MB)</p>
                  <input
                    id="logoInput"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {/* TERMS & CONDITIONS */}
              <div className="form-group full terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the <strong>Terms & Conditions</strong> and 
                    <strong> Seller Policies</strong>
                  </span>
                </label>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="seller-submit-btn" type="submit">
              Submit Seller Application
              <Sparkles size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BecomeSeller;