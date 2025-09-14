import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Load cart from backend on mount
  useEffect(() => {
    getCart();
  }, []);

  // ✅ Add or increase quantity with API integration
  const addToCart = async (product, quantity = 1, size = "", material = "") => {
    try {
      const token = localStorage.getItem("authToken");

      // ✅ Fix here
      const cartItem = { productId: product.productid };

      const response = await axios.post(
        "http://localhost:8001/api/saveCart",
        cartItem,
        { headers: { Authorization: `${token}` } }
      );

      setCart((prev) => {
        const exists = prev.find(
          (p) =>
            p.id === product.productid &&
            p.size === size &&
            p.material === material
        );

        if (exists) {
          return [
            ...prev,
            {
              id: product.productid, // ✅ consistent
              name: product.name,
              price: Number(product.price) || 0,
              quantity: Number(quantity) || 1,
              size,
              material,
              image:
                product.image ||
                product.mainImage ||
                product.images?.[0]?.src ||
                "",
            },
          ];
        }
        getCart()
        return [
          ...prev,
          {
            id: product.productid, // ✅ consistent
            name: product.name,
            price: Number(product.price) || 0,
            quantity: Number(quantity) || 1,
            size,
            material,
            image:
              product.image ||
              product.mainImage ||
              product.images?.[0]?.src ||
              "",
          },
        ];
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Get cart from backend
  const getCart = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found, cannot fetch cart");
        setCart([]);
        return;
      }

      const response = await axios.post(
        "http://localhost:8001/api/getCart",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data.data)) {
        setCart(response.data.data.map(item => {
          // Convert Base64 to data URL
          const imgSrc = item.primaryimage
            ? `data:image/jpeg;base64,${item.primaryimage}`
            : ""; // fallback if no image

          return {
            ...item,
            img: imgSrc,
            id: item.ProductID || item.id || String(item.productId), // ensure we always have an id
          };
        }));
      } else {
        console.warn("Cart API response invalid:", response.data);
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  };


  // ✅ Remove item from cart state
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // ✅ Update quantity in cart state
 // ✅ Update quantity in cart state AND call backend API
const updateQuantity = async (cartId, newQuantity) => {
  if (!cartId) return;

  // 1️⃣ Optimistically update local state
  setCart((prev) =>
    prev.map((item) =>
      item.CartID === cartId ? { ...item, Quantity: newQuantity } : item
    )
  );

  try {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // 2️⃣ Call backend API to persist quantity
    const response = await axios.post(
      "http://localhost:8001/api/UpdateCartData",
      {
        cartId,       // ✅ Send CartID instead of productId
        quantity: newQuantity
      },
      { headers: { Authorization: token } }
    );

    if (!response.data.success) {
      console.warn("Failed to update quantity on server:", response.data.message);
      // Rollback local change
      setCart((prev) =>
        prev.map((item) =>
          item.CartID === cartId ? { ...item, Quantity: prev.find(p => p.CartID === cartId).Quantity } : item
        )
      );
    }
  } catch (error) {
    console.error("Error updating quantity on server:", error);
    // Rollback local change
    setCart((prev) =>
      prev.map((item) =>
        item.CartID === cartId ? { ...item, Quantity: prev.find(p => p.CartID === cartId).Quantity } : item
      )
    );
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