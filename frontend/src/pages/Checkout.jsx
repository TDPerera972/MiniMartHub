import React, {
  useContext,
  useState,
} from "react";

import "./Checkout.css";

import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../context/CartContext";

import api from "../services/api";

const Checkout = () => {

  const navigate =
    useNavigate();

  const {
    cartItems,
    clearCart,
  } = useContext(
    CartContext
  );

  /* PAYMENT METHOD */
  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cod");

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [
    emailAddress,
    setEmailAddress,
  ] = useState("");

  const [
    deliveryAddress,
    setDeliveryAddress,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    district,
    setDistrict,
  ] = useState("");

  const [
    postalCode,
    setPostalCode,
  ] = useState("");

  const [
    errors,
    setErrors,
  ] = useState({});

  /* DELIVERY */
  const [
    deliveryService,
    setDeliveryService,
  ] = useState("Speed Post");

  /* TOTAL */
  const totalPrice =
    cartItems.reduce(

      (total, item) =>

        total +
        (
          Number(item.price) * item.quantity
        ),

      0
    );

  /* DELIVERY CHARGE */
  const deliveryCharge =
    paymentMethod === "cod"
      ? 0
      : paymentMethod === "bank_transfer"
      ? deliveryService === "Speed Post"
        ? 200
        : deliveryService === "Domex"
        ? 300
        : deliveryService === "Citypak"
        ? 250
        : 350
      : paymentMethod === "card"
      ? deliveryService === "Speed Post"
        ? 200
        : deliveryService === "Domex"
        ? 300
        : deliveryService === "Citypak"
        ? 250
        : 350
      : 0;

  /* GRAND TOTAL */
  const grandTotal =
    totalPrice +
    deliveryCharge;

  const clearError = (field) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[field];

      return nextErrors;
    });
  };

  /* PLACE ORDER */
  const handlePlaceOrder =
    async () => {
      const validationErrors = {};
      const sriLankanPhonePattern = /^0\d{9}$/;

      if (cartItems.length === 0) {
        validationErrors.cart = "Your cart is empty. Please add products before placing an order.";
      }

      if (!fullName.trim()) {
        validationErrors.fullName = "Please enter your full name.";
      }

      if (!phoneNumber.trim()) {
        validationErrors.phoneNumber = "Please enter your phone number.";
      } else if (!sriLankanPhonePattern.test(phoneNumber.trim())) {
        validationErrors.phoneNumber = "Please enter a valid Sri Lankan phone number, like 0771234567.";
      }

      if (!emailAddress.trim()) {
        validationErrors.emailAddress = "Please enter your email.";
      }

      if (!deliveryAddress.trim()) {
        validationErrors.deliveryAddress = "Please enter your delivery address.";
      }

      if (!city.trim()) {
        validationErrors.city = "Please enter your city.";
      }

      if (!district || district === "Select District") {
        validationErrors.district = "Please select your district.";
      }

      if (!postalCode.trim()) {
        validationErrors.postalCode = "Please enter your postal code.";
      }

      if (!paymentMethod) {
        validationErrors.paymentMethod = "Please select a payment method.";
      }

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      try {
        const orderData = {
          items: cartItems.map(item => ({
            product: item.id || item._id,
            quantity: item.quantity
          })),
          shippingAddress: {
            fullName: fullName.trim(),
            phone: phoneNumber.trim(),
            addressLine1: deliveryAddress.trim(),
            addressLine2: district.trim(),
            city: city.trim(),
            postalCode: postalCode.trim()
          },
          paymentMethod: paymentMethod === "cod" ? "cash_on_delivery" : paymentMethod,
          shippingPrice: deliveryCharge,
          taxPrice: 0
        };

        const response = await api.post("/api/orders", orderData);
        if (response.data && response.data.success) {
          clearCart();
          alert("Order Placed Successfully 😄");
          navigate("/success");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to place order");
      }
    };

  return (

    <section className="checkout-page">

      {/* HEADER */}
      <div className="checkout-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(-1)
          }
        >

          <ArrowLeft size={22} />

        </button>

        <h1>
          Checkout
        </h1>

      </div>

      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-form">

          <h2>
            Customer Details
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError("fullName");
            }}
          />
          {errors.fullName && (
            <p className="checkout-error">{errors.fullName}</p>
          )}

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              clearError("phoneNumber");
            }}
          />
          {errors.phoneNumber && (
            <p className="checkout-error">{errors.phoneNumber}</p>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={emailAddress}
            onChange={(e) => {
              setEmailAddress(e.target.value);
              clearError("emailAddress");
            }}
          />
          {errors.emailAddress && (
            <p className="checkout-error">{errors.emailAddress}</p>
          )}

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              clearError("city");
            }}
          />
          {errors.city && (
            <p className="checkout-error">{errors.city}</p>
          )}

          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              clearError("district");
            }}
          >
            <option value="">Select District</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Galle">Galle</option>
            <option value="Matara">Matara</option>
          </select>
          {errors.district && (
            <p className="checkout-error">{errors.district}</p>
          )}

          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => {
              setPostalCode(e.target.value);
              clearError("postalCode");
            }}
          />
          {errors.postalCode && (
            <p className="checkout-error">{errors.postalCode}</p>
          )}

          <textarea
            placeholder="Delivery Address"
            value={deliveryAddress}
            onChange={(e) => {
              setDeliveryAddress(e.target.value);
              clearError("deliveryAddress");
            }}
          />
          {errors.deliveryAddress && (
            <p className="checkout-error">{errors.deliveryAddress}</p>
          )}

          {/* DELIVERY */}
          <h2>
            Delivery Service
          </h2>

          <select
            value={
              deliveryService
            }
            onChange={(e) =>
              setDeliveryService(
                e.target.value
              )
            }
          >

            <option>
              Speed Post
            </option>

            <option>
              Domex
            </option>

            <option>
              Citypak
            </option>

            <option>
              Koombiyo Delivery
            </option>

          </select>

          {/* PAYMENT METHOD - UPDATED SECTION */}
          <h2>
            Payment Method
          </h2>

          <div className="payment-methods">

            {/* COD */}
            <label>

              <input
                type="radio"
                name="payment"
                checked={
                  paymentMethod ===
                  "cod"
                }
                onChange={() =>
                  {
                    setPaymentMethod(
                      "cod"
                    );
                    clearError("paymentMethod");
                  }
                }
              />

              <span>
                Cash on Delivery (COD)
              </span>

            </label>

            {/* Bank Transfer */}
            <label>

              <input
                type="radio"
                name="payment"
                checked={
                  paymentMethod ===
                  "bank_transfer"
                }
                onChange={() =>
                  {
                    setPaymentMethod(
                      "bank_transfer"
                    );
                    clearError("paymentMethod");
                  }
                }
              />

              <span>
                Bank Transfer
              </span>

            </label>

            {/* Card Payment */}
            <label>

              <input
                type="radio"
                name="payment"
                checked={
                  paymentMethod ===
                  "card"
                }
                onChange={() =>
                  {
                    setPaymentMethod(
                      "card"
                    );
                    clearError("paymentMethod");
                  }
                }
              />

              <span>
                Card Payment
              </span>

            </label>

          </div>

          {errors.paymentMethod && (
            <p className="checkout-error">{errors.paymentMethod}</p>
          )}

          {/* CARD DETAILS */}
          {paymentMethod ===
            "card" && (

            <div className="card-payment-form">

              <h3>
                Card Details
              </h3>

              <input
                type="text"
                placeholder="Card Holder Name"
              />

              <input
                type="text"
                placeholder="Card Number"
              />

              <div className="card-row">

                <input
                  type="text"
                  placeholder="MM/YY"
                />

                <input
                  type="text"
                  placeholder="CVV"
                />

              </div>

            </div>
          )}

          <button 
            type="button"
            className="proceed-payment-btn"
            disabled={paymentMethod === "cod"}
            onClick={() => alert("Online payment gateway coming soon.")}
          >
            Proceed to Payment
          </button>

        </div>

        {/* RIGHT */}
        <div className="order-summary">

          <h2>
            Order Summary
          </h2>

          {errors.cart && (
            <p className="checkout-error checkout-error--summary">{errors.cart}</p>
          )}

          {cartItems.map(
            (item) => (

              <div
                className="summary-item"
                key={item.id}
              >

                <span>

                  {item.title}
                  {" "}
                  ×
                  {" "}
                  {item.quantity}

                </span>

                <span>

                  Rs.
                  {" "}
                  {Number(item.price) * item.quantity}

                </span>

              </div>
            )
          )}

          {/* SUBTOTAL */}
          <div className="summary-item">

            <span>
              Sub Total
            </span>

            <span>
              Rs. {Number(totalPrice).toLocaleString()}
            </span>

          </div>

          {/* DELIVERY */}
          <div className="summary-item">

            <span>
              Delivery Charge
            </span>

            <span>
              Rs.
              {" "}
              {deliveryCharge}
            </span>

          </div>

          {/* TOTAL */}
          <div className="summary-total">

            <span>
              Grand Total
            </span>

            <span>
              Rs.
              {" "}
              {Number(grandTotal).toLocaleString()}
            </span>

          </div>

          <button
            className="place-order-btn"
            onClick={
              handlePlaceOrder
            }
          >

            Place Order

          </button>

        </div>

      </div>

    </section>
  );
};

export default Checkout;