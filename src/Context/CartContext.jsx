import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add or increase quantity with API integration
  const addToCart = async (product, quantity = 1, size = "", material = "") => {
  try {
    const token = localStorage.getItem("authToken"); // ✅ fetch token

    // Payload exactly as backend expects
    const cartItem = {
      productId: product.id, // ✅ match backend key
    };

    const response = await axios.post(
      "http://localhost:8001/api/saveCart",
      cartItem,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    // Update local state (you can keep full product info here for UI)
    setCart((prev) => {
      const exists = prev.find(
        (p) => p.id === product.id && p.size === size && p.material === material
      );

      if (exists) {
        return prev.map((p) =>
          p.id === product.id && p.size === size && p.material === material
            ? {
                ...p,
                quantity: Number(p.quantity) + Number(quantity || 1),
              }
            : p
        );
      }

      return [
        ...prev,
        {
          id: product.id,
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


  // ✅ Update quantity directly with API integration
  const updateQuantity = async (id, size, material, quantity) => {
    try {
      const updatedQuantity = Math.max(1, Number(quantity));

      // Send update to backend API
      const response = await axios.post("http://localhost:8001/api/manageCart", {
        id,
        size,
        material,
        quantity: updatedQuantity,
        action: "update"
      });

      // If API call is successful, update local state
      setCart((prev) =>
        prev.map((p) =>
          p.id === id && p.size === size && p.material === material
            ? { ...p, quantity: updatedQuantity }
            : p
        )
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating quantity:", error);
      return { success: false, error: error.message };
    }
  };
  // Inside CartProvider
  useEffect(() => {
    getCart(); // Fetch cart from backend on mount
  }, []);

  const getCart = async () => {
  try {
    const token = localStorage.getItem("authToken"); // ✅ fetch token

    if (!token) {
      console.warn("No auth token found, cannot fetch cart");
      setCart([]);
      return;
    }

    const response = await axios.post(
      "http://localhost:8001/api/getCart",
      {}, // empty body since getCart doesn’t need a body
      {
        headers: {
          Authorization: `${token}`, // ✅ send token to backend
        },
      }
    );

    if (response.data && Array.isArray(response.data.data)) {
      // ✅ backend returns `data`, not `cart`
      setCart(response.data.data);
    } else {
      console.warn("Cart API response invalid:", response.data);
      setCart([]);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    setCart([]);
  }
};


  // ✅ Increment quantity
  const increaseQuantity = (id, size, material) => {
    updateQuantity(
      id,
      size,
      material,
      (cart.find(
        (p) => p.id === id && p.size === size && p.material === material
      )?.quantity || 0) + 1
    );
  };

  // ✅ Decrement quantity
  const decreaseQuantity = (id, size, material) => {
    updateQuantity(
      id,
      size,
      material,
      (cart.find(
        (p) => p.id === id && p.size === size && p.material === material
      )?.quantity || 1) - 1
    );
  };

  // Remove one product completely with API integration
  const removeFromCart = async (id, size, material) => {
    try {
      // Send remove request to backend API
      const response = await axios.post("http://localhost:8001/api/manageCart", {
        id,
        size,
        material,
        action: "remove"
      });

      // If API call is successful, update local state
      setCart((prev) =>
        prev.filter(
          (p) => !(p.id === id && p.size === size && p.material === material)
        )
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false, error: error.message };
    }
  };

  // Clear entire cart with API integration
  const clearCart = async () => {
    try {
      // Send clear request to backend API
      const response = await axios.post("http://localhost:8001/api/manageCart", {
        action: "clear"
      });

      // If API call is successful, update local state
      setCart([]);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCart,   // ✅ new function
      }}
    >
      {children}
    </CartContext.Provider>

  );
}

export const useCart = () => useContext(CartContext);