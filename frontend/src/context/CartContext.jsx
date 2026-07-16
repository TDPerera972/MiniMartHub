import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const transformCartItems = (backendItems) => {
  if (!backendItems) return [];
  return backendItems.map((item) => {
    const p = item.product || {};
    return {
      id: p._id,
      _id: p._id,
      title: p.name,
      name: p.name,
      price: Number(p.price || 0),
      image: p.image || "/api/placeholder/300/300",
      category: p.category,
      stock: p.stock,
      quantity: item.quantity,
    };
  });
};

const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        setCartItems([]);
        return;
      }
      try {
        const response = await api.get("/api/cart");
        if (response.data?.cart?.items) {
          setCartItems(transformCartItems(response.data.cart.items));
        }
      } catch (error) {

      }
    };
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    if (!isAuthenticated) return alert("Please login to add to cart");
    try {
      const productId = product.id || product._id;
      const response = await api.post("/api/cart/add", { productId, quantity: 1 });
      if (response.data?.cart?.items) {
        setCartItems(transformCartItems(response.data.cart.items));
      }
    } catch (error) {

      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const increaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;
    try {
      const response = await api.put("/api/cart/update", { productId, quantity: item.quantity + 1 });
      if (response.data?.cart?.items) {
        setCartItems(transformCartItems(response.data.cart.items));
      }
    } catch (error) {

    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (!item || item.quantity <= 1) return;
    try {
      const response = await api.put("/api/cart/update", { productId, quantity: item.quantity - 1 });
      if (response.data?.cart?.items) {
        setCartItems(transformCartItems(response.data.cart.items));
      }
    } catch (error) {

    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/api/cart/remove/${productId}`);
      if (response.data?.cart?.items) {
        setCartItems(transformCartItems(response.data.cart.items));
      } else {
        setCartItems([]);
      }
    } catch (error) {

    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/api/cart/clear");
      setCartItems([]);
    } catch (error) {

    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price);
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;