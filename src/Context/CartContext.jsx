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



  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);