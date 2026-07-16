import React, {
  useState,
  useContext,
  useEffect,
} from "react";

import "./ProductDetails.css";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../context/CartContext";

import {
  ProductContext,
} from "../context/ProductContext";

import {
  ShoppingCart,
  Zap,
} from "lucide-react";

import api from "../services/api";

const ProductDetails = () => {

  /* PARAMS */

  const { id } = useParams();

  /* NAVIGATE */

  const navigate =
    useNavigate();

  /* CART CONTEXT */

  const {
    addToCart,
  } = useContext(CartContext);

  /* PRODUCT CONTEXT */

  const {
    products,
  } = useContext(ProductContext);

  /* STATE */

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* FIND PRODUCT */

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      // Check cache first
      const cached = products.find(
        (item) => item.id === id || item._id === id
      );

      if (cached) {
        setProduct(cached);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const response = await api.get(`/api/products/${id}`);
        const data = response.data;

        if (data.success && data.product) {
          const p = data.product;
          const transformed = {
            id: p._id,
            _id: p._id,
            title: p.name,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            oldPrice: Number(p.price) + 2000,
            category: p.category,
            stock: p.stock,
            image: p.image || "/api/placeholder/300/300",
            rating: 4.0,
            reviews: 0,
            status: p.status || "Active",
            seller: p.seller || null,
            isLocal: true,
            weight: "1kg",
          };
          setProduct(transformed);
        } else {
          setProduct(null);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, products]);

  /* STATES */

  const [
    selectedService,
    setSelectedService,
  ] = useState(
    "Speed Post"
  );

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  /* PRODUCT NOT FOUND */

  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "700",
          color: "#172b78",
          background: "#f5f7fb",
        }}
      >

        Loading...

      </div>
    );
  }

  if (!product) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "32px",
          fontWeight: "700",
          color: "#172b78",
          background: "#f5f7fb",
        }}
      >

        Product Not Found

      </div>
    );
  }

  /* DELIVERY SERVICES */

  const deliveryServices = [

    "Speed Post",

    "Domex",

    "Citypak",

    "Pronto Lanka",

    "Prompt Xpress",

    "Parcel.lk",

    "SriCourier",

    "Koombiyo Delivery",
  ];

  /* DELIVERY CALCULATOR */

  const calculateDelivery = () => {

    const numericWeight =
      parseFloat(
        String(product.weight)
          .replace("kg", "")
      ) || 1;

    if (
      selectedService ===
      "Speed Post"
    ) {

      if (
        numericWeight <= 1
      ) {

        return 200;
      }

      return (
        200 +
        Math.ceil(
          numericWeight - 1
        ) * 50
      );
    }

    else {

      if (
        numericWeight <= 1
      ) {

        return 300;
      }

      return (
        300 +
        Math.ceil(
          numericWeight - 1
        ) * 60
      );
    }
  };

  const deliveryCharge =
    paymentMethod === "cod" ? 0 : calculateDelivery();

  /* QUANTITY */

  const increaseQuantity = () => {

    if (
      quantity < product.stock
    ) {

      setQuantity(
        quantity + 1
      );
    }
  };

  const decreaseQuantity = () => {

    if (quantity > 1) {

      setQuantity(
        quantity - 1
      );
    }
  };

  /* ADD TO CART */

  const handleAddToCart = () => {

    for (
      let i = 0;
      i < quantity;
      i++
    ) {

      addToCart(product);
    }
  };

  return (
    <section className="product-detail">

      <div className="detail-container">

        {/* LEFT - IMAGE */}

        <div className="detail-image-box">

          <img
            src={
              product.image ||
              "https://via.placeholder.com/400"
            }
            alt={product.title}
            className="detail-main-img"
          />

        </div>

        {/* RIGHT - INFO */}

        <div className="detail-info-box">

          <div className="detail-breadcrumb">

            <button
              onClick={() =>
                navigate("/products")
              }
            >

              Products
            </button>

            <span>
              >
            </span>

            <span>
              {product.category}
            </span>

          </div>

          <h1>
            {product.title}
          </h1>

          <div className="detail-price-section">

            <span className="detail-current-price">

              LKR{" "}
              {Number(
                product.price
              ).toLocaleString()}

            </span>

            {product.oldPrice &&
              Number(
                product.oldPrice
              ) > 0 &&
              Number(
                product.oldPrice
              ) > Number(
                product.price
              ) && (

                <span className="detail-old-price">

                  LKR{" "}
                  {Number(
                    product.oldPrice
                  ).toLocaleString()}

                </span>
              )}

          </div>

          {product.rating > 0 && (

            <div className="detail-rating">

              <span className="detail-stars">
                {"★".repeat(
                  Math.round(
                    product.rating
                  )
                )}
              </span>

              <span>
                {product.rating}
              </span>

              {product.reviews >
                0 && (

                <span className="detail-review-count">

                  ({product.reviews}{" "}
                  reviews)

                </span>
              )}

            </div>
          )}

          <p className="detail-description">

            {product.description}

          </p>

          <div className="detail-meta">

            <div className="detail-meta-item">

              <strong>
                Category:
              </strong>

              <span>
                {product.category}
              </span>

            </div>

            <div className="detail-meta-item">

              <strong>
                Stock:
              </strong>

              <span>
                {product.stock > 0
                  ? `${product.stock} units`
                  : "Out of Stock"}
              </span>

            </div>

          </div>

          {/* QUANTITY */}

          <div className="detail-quantity">

            <label>
              Quantity:
            </label>

            <div className="quantity-controls">

              <button
                onClick={
                  decreaseQuantity
                }
              >
                -
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={
                  increaseQuantity
                }
              >
                +
              </button>

            </div>

          </div>

          {/* PAYMENT METHOD */}
          <div className="detail-payment">
            <label>Payment Method:</label>
            <div className="payment-options">
              <button
                className={`payment-btn ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                {paymentMethod === "card" ? "●" : "○"} Card Payment
              </button>
              <button
                className={`payment-btn ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                {paymentMethod === "cod" ? "●" : "○"} Cash on Delivery (COD)
              </button>
            </div>
          </div>

          {/* DELIVERY */}

          <div className="detail-delivery">

            <label>
              Delivery Service:
            </label>

            <div className="delivery-options">

              {deliveryServices.map(
                (service) => (

                  <button
                    key={service}
                    className={`delivery-btn ${
                      selectedService ===
                      service
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedService(
                        service
                      )
                    }
                  >

                    {service}

                  </button>
                )
              )}

            </div>

            <div className="delivery-charge">
              Delivery: {deliveryCharge === 0 ? (
                <span className="free-badge">FREE</span>
              ) : (
                <>LKR {deliveryCharge.toLocaleString()}</>
              )}

              {paymentMethod === "cod" && (
                <div className="free-delivery-text">
                  ✔ Free Delivery with Cash on Delivery
                </div>
              )}
            </div>

          </div>

          {/* BUTTONS */}

          <div className="detail-actions">

            <button
              className="detail-cart-btn"
              onClick={
                handleAddToCart
              }
            >

              <ShoppingCart size={18} />

              Add to Cart

            </button>

            <button
              className="detail-buy-btn"
              onClick={() => {

                handleAddToCart();

                navigate(
                  "/checkout"
                );
              }}
            >

              <Zap size={18} />

              Buy Now

            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ProductDetails;