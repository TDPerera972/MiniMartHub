import React, {
  useState,
  useContext,
} from "react";

import "./Auth.css";

import {
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

/* LOGO */

const logo = "/logo.png";

const Auth = () => {

  /* NAVIGATE */

  const navigate =
    useNavigate();

  const { login, register } = useContext(AuthContext);

  /* TOGGLE */

  const [isLogin, setIsLogin] =
    useState(true);

  /* PASSWORD */

  const [showPassword, setShowPassword] =
    useState(false);

  /* FORM STATE */

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+94");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("+94")) {
      val = "+94";
    }
    const digits = val.slice(3).replace(/\D/g, "");
    setPhone("+94" + digits.slice(0, 9));
  };
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* HANDLE SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!isLogin && (!name || !phone)) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        const role = result.user.role;

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "seller") {
          navigate("/seller-dashboard");
        } else {
          navigate("/");
        }
      } else {
        await register(name, email, phone, password);
        setIsLogin(true);
        setError("");
        setName("");
        setPhone("+94");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <section className="auth-page">

      {/* BACK BUTTON */}

      <button
        className="auth-back-btn"
        onClick={() => navigate(-1)}
      >

        <ArrowLeft size={20} />

      </button>

      {/* LEFT SIDE */}

      <div className="auth-brand">

        <div className="auth-brand__inner">

          {/* LOGO */}

          <img
            src={logo}
            alt="MiniMartHub"
            className="auth-brand__logo"
          />

          {/* TITLE */}

          <h2 className="auth-brand__title">

            Sri Lanka's Trusted
            <br />

            <span>
              Marketplace
            </span>

          </h2>

          {/* DESCRIPTION */}

          <p className="auth-brand__desc">

            Shop from hundreds of verified local sellers.
            Quality products, fast delivery, and easy returns.

          </p>

          {/* BADGES */}

          <div className="auth-brand__badges">

            <div className="auth-brand__badge">

              <span className="auth-brand__badge-icon">
                
              </span>

              <div>

                <strong>
                  Secure & Safe
                </strong>

                <span>
                  100% protected payments
                </span>

              </div>

            </div>

            <div className="auth-brand__badge">

              <span className="auth-brand__badge-icon">
                
              </span>

              <div>

                <strong>
                  500+ Sellers
                </strong>

                <span>
                  Verified trusted vendors
                </span>

              </div>

            </div>

            <div className="auth-brand__badge">

              <span className="auth-brand__badge-icon">
                
              </span>

              <div>

                <strong>
                  Fast Delivery
                </strong>

                <span>
                  Island-wide shipping
                </span>

              </div>

            </div>

          </div>

          {/* SWITCH */}

          <div className="bottom-switch">

            <p>

              Switch between Login & Register

            </p>

            <div className="bottom-toggle">

              <span>
                Login
              </span>

              <button
                type="button"
                className={`toggle-btn ${
                  !isLogin
                    ? "right"
                    : ""
                }`}
                onClick={() =>
                  setIsLogin(!isLogin)
                }
              >

                <div className="toggle-circle" />

              </button>

              <span>
                Register
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">

        {/* MOBILE LOGO */}

        <div className="auth-mobile-logo">

          <img
            src={logo}
            alt="MiniMartHub"
          />

        </div>

        {/* TABS */}

        <div className="auth-tabs">

          <button
            className={`auth-tab ${
              isLogin
                ? "active"
                : ""
            }`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >

            Login

          </button>

          <button
            className={`auth-tab ${
              !isLogin
                ? "active"
                : ""
            }`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >

            Register

          </button>

        </div>

        {/* CARD */}

        <div className="auth-card">

          {/* TITLE */}

          <h1>

            {isLogin
              ? "Welcome Back 👋"
              : "Create Account 🎉"}

          </h1>

          <p>

            {isLogin
              ? "Login to your MiniMartHub account"
              : "Join MiniMartHub Marketplace"}

          </p>

          {/* ERROR */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* REGISTER ONLY */}

            {!isLogin && (

              <div className="form-group">

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Kamal perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>
            )}

            {!isLogin && (

              <div className="form-group">

                <label className="form-label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="+94 7X XXX XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  pattern="^\+94\d{9}$"
                  title="Please enter a valid Sri Lankan phone number"
                />

              </div>
            )}

            {/* EMAIL */}

            <div className="form-group">

              <label className="form-label">
                Email Address
              </label>

              <input
                type="email"
                placeholder="kperera@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label className="form-label">
                Password
              </label>

              <div className="password-box">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  title="Password must contain at least 8 characters."
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}

                </button>

              </div>

            </div>

            {/* FORGOT */}

            {isLogin && (

              <div className="forgot-row">

                <a
                  href="/"
                  className="forgot-link"
                >
                  Forgot password?
                </a>

              </div>
            )}

            {/* TERMS */}

            {!isLogin && (

              <div className="check-row">

                <input
                  type="checkbox"
                  id="terms"
                />

                <label htmlFor="terms">

                  I agree to the
                  {" "}

                  <a href="/">
                    Terms
                  </a>

                  {" "}
                  &

                  {" "}

                  <a href="/">
                    Privacy Policy
                  </a>

                </label>

              </div>
            )}

            {/* BUTTON */}

            <button
              className="auth-btn"
              type="submit"
              disabled={submitting}
            >

              {submitting
                ? "Please wait..."
                : isLogin
                  ? "Login"
                  : "Create Account"}

            </button>

          </form>

          {/* TOGGLE */}

          <div className="auth-toggle">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >

              {isLogin
                ? " Sign Up Free"
                : " Login"}

            </span>

          </div>

          {/* SOCIAL LOGIN */}

          <div className="social-login">

            <button
              className="social-btn google-btn"
              type="button"
            >

              <img
                src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                alt="google"
              />

              Continue with Google

            </button>

            <button
              className="social-btn facebook-btn"
              type="button"
            >

              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="facebook"
              />

              Continue with Facebook

            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Auth;