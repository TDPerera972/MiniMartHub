import React, {
  useContext,
} from "react";

import "./Cart.css";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import {
  CartContext,
} from "../context/CartContext";

const Cart = () => {

  /* NAVIGATE */

  const navigate =
    useNavigate();

  /* CART CONTEXT */

  const {

    cartItems,

    totalItems,

    totalPrice,

    increaseQuantity,

    decreaseQuantity,

    removeFromCart,

    clearCart,

  } = useContext(CartContext);

  return (

    <section className="cart-page">

      {/* HEADER */}

      <div className="cart-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(-1)
          }
        >

          <ArrowLeft size={22} />

        </button>

        <h1>
          Shopping Cart
        </h1>

      </div>

      {/* EMPTY CART */}

      {cartItems.length === 0 ? (

        <div className="empty-cart">

          <ShoppingBag
            size={70}
          />

          <h2>
            Your cart is empty 😢
          </h2>

          <p>
            Add products to continue shopping.
          </p>

          <button
            className="shop-btn"
            onClick={() =>
              navigate("/")
            }
          >

            Continue Shopping

          </button>

        </div>

      ) : (

        <div className="cart-container">

          {/* CART ITEMS */}

          <div className="cart-items">

            {cartItems.map((item) => (

              <div
                className="cart-card"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-image">

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                </div>

                {/* DETAILS */}

                <div className="cart-details">

                  <div>

                    <span className="cart-category">

                      {item.category}

                    </span>

                    <h2>
                      {item.title}
                    </h2>

                    <p className="cart-price">

                      Rs. {Number(item.price).toLocaleString()}

                    </p>

                  </div>

                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="cart-right">

                  <h3>

                    Rs.
                    {" "}

                    {(Number(item.price) * item.quantity).toLocaleString()}

                  </h3>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                  >

                    <Trash2
                      size={18}
                    />

                    Remove

                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* SUMMARY */}

          <div className="cart-summary">

            <h2>
              Cart Summary
            </h2>

            <div className="summary-row">

              <span>
                Total Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                Rs. 350
              </span>

            </div>

            <div className="summary-row total">

              <span>
                Total Price
              </span>

              <span>

                Rs.
                {" "}

                {(
                  totalPrice + 350
                ).toLocaleString()}

              </span>

            </div>

            {/* BUTTONS */}

            <button
              className="checkout-btn"
              onClick={() =>
                navigate(
                  "/checkout"
                )
              }
            >

              Proceed to Checkout

            </button>

            <button
              className="clear-cart-btn"
              onClick={
                clearCart
              }
            >

              Clear Cart

            </button>

          </div>

        </div>
      )}

    </section>
  );
};

export default Cart;