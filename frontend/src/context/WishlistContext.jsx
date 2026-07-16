import React, {
  createContext,
  useState,
  useEffect,
} from "react";

/* CONTEXT */

export const WishlistContext =
  createContext();

const loadStoredWishlist = () => {
  try {
    const storedWishlist = localStorage.getItem("minimarthub-wishlist");
    const parsedWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
    return Array.isArray(parsedWishlist) ? parsedWishlist : [];
  } catch (error) {

    return [];
  }
};

/* PROVIDER */

const WishlistProvider = ({
  children,
}) => {

  /* =========================
     STATE
  ========================= */

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState(loadStoredWishlist);

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */

  useEffect(() => {

    localStorage.setItem(

      "minimarthub-wishlist",

      JSON.stringify(
        wishlistItems
      )
    );

  }, [wishlistItems]);

  /* =========================
     ADD TO WISHLIST
  ========================= */

  const addToWishlist = (
    product
  ) => {

    const exists =
      wishlistItems.find(
        (item) =>
          item.id === product.id
      );

    if (!exists) {

      setWishlistItems([

        ...wishlistItems,

        product,
      ]);
    }
  };

  /* =========================
     REMOVE FROM WISHLIST
  ========================= */

  const removeFromWishlist = (
    productId
  ) => {

    const filtered =
      wishlistItems.filter(
        (item) =>
          item.id !== productId
      );

    setWishlistItems(
      filtered
    );
  };

  /* =========================
     CHECK EXISTS
  ========================= */

  const isInWishlist = (
    productId
  ) => {

    return wishlistItems.some(
      (item) =>
        item.id === productId
    );
  };

  return (

    <WishlistContext.Provider
      value={{

        wishlistItems,

        addToWishlist,

        removeFromWishlist,

        isInWishlist,
      }}
    >

      {children}

    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
