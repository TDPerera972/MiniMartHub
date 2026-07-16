import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import FloatingWidget from "./components/FloatingWidget/FloatingWidget";

/* PAGES */
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./pages/AllProducts";
import AllSellers from "./pages/AllSellers";

/* SELLER */
import BecomeSeller from "./pages/BecomeSeller";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import SellerAnalytics from "./pages/SellerAnalytics";

/* PROFILE */
import Profile from "./pages/Profile";

/* WISHLIST */
import Wishlist from "./pages/Wishlist";

/* ORDERS & SETTINGS */
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageSellers from "./pages/admin/ManageSellers";
import ManageOrders from "./pages/admin/ManageOrders";
import Reports from "./pages/admin/Reports";
import AdminLogin from "./pages/AdminLogin";
import Help from "./pages/Help";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <FloatingWidget />
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={<AllProducts />}
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* ORDER SUCCESS */}
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* AUTH */}
        <Route
          path="/auth"
          element={<Auth />}
        />

        {/* SELLER */}
        <Route
          path="/become-seller"
          element={
            <ProtectedRoute>
              <BecomeSeller />
            </ProtectedRoute>
          }
        />

        {/* SELLER DASHBOARD */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-products"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-orders"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-analytics"
          element={
            <ProtectedRoute requiredRole="seller">
              <SellerAnalytics />
            </ProtectedRoute>
          }
        />

        {/* ADD PRODUCT */}
        <Route
          path="/add-product"
          element={
            <ProtectedRoute requiredRole="seller">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sellers"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageSellers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute requiredRole="admin">
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/sellers"
          element={<AllSellers />}
        />

        <Route path="/store/:sellerId" element={<Store />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;