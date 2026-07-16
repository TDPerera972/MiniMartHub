export const categoryMap = {
  "Agriculture & Gardening": "agriculture",
  "Groceries & Food": "groceries",
  "Home & Kitchen": "home-kitchen",
  "Electronics & Accessories": "electronics",
  "Fashion & Clothing": "fashion",
  "Beauty & Personal Care": "beauty",
  "Baby & Kids": "baby-kids",
  "Sports & Fitness": "sports",
  "Pets & Animal Care": "pets",
  "Hardware & Tools": "hardware",
  "Stationery & Books": "stationery",
  "Handicrafts & Local Products": "handicrafts"
};

// Helper to get display label from value
export const getCategoryLabel = (value) => {
  if (!value) return "All Categories";
  return Object.keys(categoryMap).find(key => categoryMap[key] === value) || value;
};

// Helper to reliably get the category value for a product
export const getCategoryValue = (product) => {
  if (product && product.image && product.image.startsWith('/products/')) {
    return product.image.split('/')[2];
  }
  return product ? product.category : "";
};
