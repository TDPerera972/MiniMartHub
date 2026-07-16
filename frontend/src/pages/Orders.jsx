import React, { useState, useEffect } from "react";
import "./Orders.css";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/orders/my-orders");
        if (response.data && response.data.orders) {
          const mappedOrders = response.data.orders.map(order => {
            const firstItemName = order.items && order.items.length > 0 ? order.items[0].name : "Unknown Item";
            const moreCount = order.items && order.items.length > 1 ? ` + ${order.items.length - 1} more` : "";
            
            return {
              id: `#${order._id.substring(0, 8).toUpperCase()}`,
              product: `${firstItemName}${moreCount}`,
              date: new Date(order.createdAt).toISOString().split('T')[0],
              price: `Rs. ${Number(order.totalPrice).toLocaleString()}`,
              status: order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
            };
          });
          setOrders(mappedOrders);
        }
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <section className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <button className="orders-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <h1>My Orders</h1>
      </div>

      {/* ORDERS */}
      <div className="orders-grid">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-top">
                <h3>{order.product}</h3>
                <span>{order.id}</span>
              </div>
              <p>Date: {order.date}</p>
              <p>Price: {order.price}</p>
              
              <div className={`order-status ${order.status.toLowerCase()}`}>
                {order.status.toLowerCase() === "delivered" ? (
                  <CheckCircle size={18} />
                ) : order.status.toLowerCase() === "shipped" ? (
                  <Truck size={18} />
                ) : (
                  <Package size={18} />
                )}
                {order.status}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Orders;