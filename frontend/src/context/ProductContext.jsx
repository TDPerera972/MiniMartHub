import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const ProductContext = createContext();

const transformProduct = (product) => ({
  id: product._id,
  _id: product._id,
  title: product.name,
  name: product.name,
  description: product.description,
  price: Number(product.price),
  category: product.category,
  stock: product.stock,
  image: product.image || "/api/placeholder/300/300",
  status: product.status || "Active",
  seller: product.seller || null,
  isLocal: true,
});

const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/products");
      const data = response.data;

      if (data.success && Array.isArray(data.products)) {
        const transformed = data.products.map(transformProduct);
        setProducts(transformed);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError("Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData) => {
    try {
      const response = await api.post("/api/products", productData);
      const data = response.data;

      if (data.success && data.product) {
        const transformed = transformProduct(data.product);
        setProducts((current) => [...current, transformed]);
        return { success: true, product: transformed };
      }
      return { success: false, error: "Failed to add product" };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        "Failed to add product";
      return { success: false, error: message };
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await api.put(`/api/products/${id}`, productData);
      const data = response.data;

      if (data.success && data.product) {
        const transformed = transformProduct(data.product);
        setProducts((current) =>
          current.map((p) => (p.id === id || p._id === id ? transformed : p))
        );
        return { success: true, product: transformed };
      }
      return { success: false, error: "Failed to update product" };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update product";
      return { success: false, error: message };
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      const data = response.data;

      if (data.success) {
        setProducts((current) =>
          current.filter((p) => p.id !== id && p._id !== id)
        );
        return { success: true };
      }
      return { success: false, error: "Failed to delete product" };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete product";
      return { success: false, error: message };
    }
  }, []);

  const getProductById = useCallback(
    async (id) => {
      const cached = products.find((p) => p.id === id || p._id === id);
      if (cached) return cached;

      try {
        const response = await api.get(`/api/products/${id}`);
        const data = response.data;
        if (data.success && data.product) {
          return transformProduct(data.product);
        }
        return null;
      } catch {
        return null;
      }
    },
    [products]
  );

  const getAllCategories = useCallback(() => {
    const categories = products
      .map((product) => product.category)
      .filter((category) => category && typeof category === "string");
    return ["All Categories", ...new Set(categories)];
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedCategory,
        setSelectedCategory,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getAllCategories,
        refetchProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;