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



  // ✅ Toggle add/remove (matches backend /saveCart)
  const toggleCartItem = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const response = await axios.post(
        "http://localhost:8001/api/saveCart",
        { productId },
        { headers: { Authorization: `${token}` } }
      );

      // Update frontend state
      const updatedItem = response.data.cartItem;

      setCart((prev) => {
  const exists = prev.find((p) => p.id === (updatedItem.ProductID || updatedItem.id));

  if (exists) {
    if (!updatedItem.IsActive) {
      return prev.filter((p) => p.id !== (updatedItem.ProductID || updatedItem.id));
    }

    return prev.map((p) =>
      p.id === (updatedItem.ProductID || updatedItem.id)
        ? { ...p, inStock: updatedItem.IsActive }
        : p
    );
  }

  return [
    ...prev,
    {
      id: updatedItem.ProductID || updatedItem.id, // ✅ normalize here too
      inStock: updatedItem.IsActive,
      quantity: 1,
    },
  ];
});


      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error toggling cart:", error);
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
        setCart(response.data.data.map(item => ({
          ...item,
          id: item.ProductID || item.id || String(item.productId), // ensure we always have an id
        })));
      }

      else {
        console.warn("Cart API response invalid:", response.data);
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    try {
      const response = await axios.post("http://localhost:8001/api/manageCart", {
        action: "clear"
      });

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
        toggleCartItem,
        clearCart,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);