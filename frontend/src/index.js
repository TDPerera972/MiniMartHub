import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

/* CONTEXTS */

import AuthProvider from "./context/AuthContext";

import CartProvider from "./context/CartContext";

import ProductProvider from "./context/ProductContext";

import WishlistProvider from "./context/WishlistContext";

/* ROOT */

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(

  <React.StrictMode>

    <AuthProvider>

      <WishlistProvider>

        <ProductProvider>

          <CartProvider>

            <App />

          </CartProvider>

        </ProductProvider>

      </WishlistProvider>

    </AuthProvider>

  </React.StrictMode>
);