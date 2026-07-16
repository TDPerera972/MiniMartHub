import React, {
  useState,
  useContext,
} from "react";

import "./AddProduct.css";

import {
  ArrowLeft,
  Upload,
  ImagePlus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ProductContext,
} from "../context/ProductContext";

import { AuthContext } from "../context/AuthContext";

const AddProduct = () => {

  /* NAVIGATE */

  const navigate =
    useNavigate();

  /* PRODUCT CONTEXT */

  const {
    addProduct,
  } = useContext(ProductContext);

  const { user } = useContext(AuthContext);

  /* STATES */

  const [preview, setPreview] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [category, setCategory] =
    useState("Electronics");

  const [description, setDescription] =
    useState("");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  /* HANDLE IMAGE */

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (file) {

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  /* SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    if (!title || !price || !stock || !description) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);

    const productData = {
      name: title,
      description,
      price: Number(price.replace(/,/g, "")),
      category,
      stock: Number(stock),
      image: preview || "https://via.placeholder.com/400",
      seller: user?._id || user?.id,
    };

    const result = await addProduct(productData);

    setSubmitting(false);

    if (result.success) {
      alert("Product Added Successfully 😄");
      navigate("/seller-dashboard");
    } else {
      setError(result.error || "Failed to add product");
    }
  };

  return (

    <section className="add-product-page">

      {/* BACK */}

      <button
        className="add-product-back"
        onClick={() => navigate(-1)}
      >

        <ArrowLeft size={22} />

      </button>

      <div className="add-product-container">

        {/* LEFT */}

        <div className="add-product-left">

          <div className="add-product-badge">

            <Upload size={16} />

            Seller Product Upload

          </div>

          <h1>

            Add Your
            {" "}

            <span>
              New Product
            </span>

          </h1>

          <p>

            Upload product details, pricing,
            stock and product images to start selling.

          </p>

          {/* PREVIEW */}

          <div className="preview-card">

            {preview ? (

              <img
                src={preview}
                alt="preview"
              />

            ) : (

              <div className="preview-placeholder">

                <ImagePlus size={50} />

                <span>
                  Product Preview
                </span>

              </div>
            )}

          </div>

        </div>

        {/* RIGHT */}

        <div className="add-product-right">

          <h2>
            Product Details
          </h2>

          <p>
            Fill all required product information.
          </p>

          {error && (
            <div className="add-product-error">
              {error}
            </div>
          )}

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              {/* PRODUCT NAME */}

              <div className="form-group full">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* PRICE */}

              <div className="form-group">

                <label>
                  Price (LKR)
                </label>

                <input
                  type="number"
                  placeholder="8500"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* STOCK */}

              <div className="form-group">

                <label>
                  Stock Quantity
                </label>

                <input
                  type="number"
                  placeholder="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group full">

                <label>
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                >

                  <option>
                    Electronics
                  </option>

                  <option>
                    Fashion
                  </option>

                  <option>
                    Grocery
                  </option>

                  <option>
                    Beauty
                  </option>

                  <option>
                    Home & Living
                  </option>

                </select>

              </div>

              {/* DESCRIPTION */}

              <div className="form-group full">

                <label>
                  Product Description
                </label>

                <textarea
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* IMAGE */}

              <div className="form-group full">

                <label>
                  Upload Product Image
                </label>

                <label className="upload-area">

                  <Upload size={34} />

                  <h4>
                    Click to Upload
                  </h4>

                  <p>
                    PNG, JPG up to 5MB
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImage}
                  />

                </label>

              </div>

            </div>

            {/* BUTTON */}

            <button
              className="publish-btn"
              type="submit"
              disabled={submitting}
            >

              {submitting ? "Publishing..." : "Publish Product"}

            </button>

          </form>

        </div>

      </div>

    </section>
  );
};

export default AddProduct;