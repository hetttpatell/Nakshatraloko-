import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const normalizeImage = (url) => {
    let fixedUrl = url?.trim() || "";

    if (!fixedUrl) return "";

    if (fixedUrl.startsWith("http")) {
      fixedUrl = fixedUrl.replace(/([^:]\/)\/+/g, "$1");
      fixedUrl = fixedUrl.replace(
        /^http:\/\/localhost:8001\/uploads/,
        `${IMG_URL}/uploads`
      );
    } else {
      if (!fixedUrl.startsWith("/uploads/")) {
        fixedUrl = `/uploads/${fixedUrl.replace(/^\/+/, "")}`;
      }
      fixedUrl = `${IMG_URL}${fixedUrl}`.replace(/([^:]\/)\/+/g, "$1");
    }

    return fixedUrl;
  };
  // ✅ Load cart from backend on mount

  // ✅ Add or increase quantity with API integration
  // const addToCart = async (product, quantity = 1, size = "", material = "") => {
  //   try {
  //     const token = localStorage.getItem("authToken");

  //     // ✅ Fix here
  //     const cartItem = { productId: product.productid };

  //     const response = await axios.post(
  //       "${BACKEND_URL}saveCart",
  //       cartItem,
  //       { headers: { Authorization: `${token}` } }
  //     );

  //     setCart((prev) => {
  //       const exists = prev.find(
  //         (p) =>
  //           p.id === product.productid &&
  //           p.size === size &&
  //           p.material === material
  //       );

  //       if (exists) {
  //         return [
  //           ...prev,
  //           {
  //             id: product.productid, // ✅ consistent
  //             name: product.name,
  //             price: Number(product.price) || 0,
  //             quantity: Number(quantity) || 1,
  //             size,
  //             material,
  //             image:
  //               product.image ||
  //               product.mainImage ||
  //               product.images?.[0]?.src ||
  //               "",
  //           },
  //         ];
  //       }
  //       getCart()
  //       return [
  //         ...prev,
  //         {
  //           id: product.productid, // ✅ consistent
  //           name: product.name,
  //           price: Number(product.price) || 0,
  //           quantity: Number(quantity) || 1,
  //           size,
  //           material,
  //           image:
  //             product.image ||
  //             product.mainImage ||
  //             product.images?.[0]?.src ||
  //             "",
  //         },
  //       ];
  //     });

  //     return { success: true, data: response.data };
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //     return { success: false, error: error.message };
  //   }
  // };
  const addToCart = async (product, quantity = 1, size = "", material = "") => {
    try {
      const token = localStorage.getItem("authToken");

      const cartItem = {
        productId: product.productid,
        quantity,
        size,
        material,
      };

      const response = await axios.post(`${BACKEND_URL}saveCart`, cartItem, {
        headers: { Authorization: `${token}` },
      });

      // ✅ Always refresh cart from backend
      await getCart();

      return { success: true, data: response.data };
    } catch (error) {
      // console.error("Error adding to cart:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Get cart from backend
  const getCart = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // console.warn("No auth token found, cannot fetch cart");
        setCart([]);
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}getCart`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.data)) {
        setCart(
          response.data.data.map((item) => {
            const imgSrc = normalizeImage(
              item.PrimaryImage || item.primaryimage || item.image || item.img
            );

            return {
              ...item,
              img: imgSrc,
              id: item.ProductID || item.id || String(item.productId), // ensure we always have an id
            };
          })
        );
      } else {
        // console.warn("Cart API response invalid:", response.data);
        setCart([]);
      }
    } catch (error) {
      // console.error("Error fetching cart:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // ✅ Remove item from cart state
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // ✅ Update quantity in cart state
  // ✅ Update quantity in cart state AND call backend API
  const updateQuantity = async (cartId, newQuantity) => {
    if (!cartId) return;

    // Save previous state for rollback
    const previousCart = [...cart];

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      // Optimistically update local cart
      setCart((prev) =>
        prev.map((item) =>
          item.ID === cartId ? { ...item, Quantity: newQuantity } : item
        )
      );

      // Call backend API
      const response = await axios.post(
        `${BACKEND_URL}UpdateCartData`,
        { cartId, quantity: newQuantity },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with server response to ensure data consistency
      if (response.data.success && response.data.cartItem) {
        setCart((prev) =>
          prev.map((item) =>
            item.ID === cartId
              ? {
                  ...item,
                  Quantity: response.data.cartItem.Quantity,
                  PriceAtAddition: response.data.cartItem.PriceAtAddition,
                  SelectedOptions: response.data.cartItem.SelectedOptions,
                  UpdatedAt: response.data.cartItem.UpdatedAt,
                }
              : item
          )
        );
      } else {
        // console.warn("Failed to update quantity on server:", response.data.message);
        // Rollback
        setCart(previousCart);
      }
    } catch (error) {
      // console.error("Error updating quantity on server:", error);
      // Rollback on network/server error
      setCart(previousCart);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart, // ✅ PROVIDE IT HERE
        updateQuantity, // ✅ provide this
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
