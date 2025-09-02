import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Add or increase quantity
  // Add or increase quantity
const addToCart = (product) => {
  setCart((prev) => {
    const exists = prev.find(
      (p) =>
        p.id === product.id &&
        p.size === product.size &&
        p.material === product.material
    );

    if (exists) {
      return prev.map((p) =>
        p.id === product.id &&
        p.size === product.size &&
        p.material === product.material
          ? {
              ...p,
              quantity: Number(p.quantity) + Number(product.quantity || 1),
              price: Number(product.price) || 0,
              image: product.image || p.image || "", // ✅ ensure image stays
            }
          : p
      );
    }

    return [
      ...prev,
      {
        ...product,
        quantity: Number(product.quantity) || 1,
        price: Number(product.price) || 0,
        image: product.image || "", // ✅ ensure image is saved
      },
    ];
  });
};


  // ✅ Update quantity directly
  const updateQuantity = (id, size, material, quantity) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && p.size === size && p.material === material
          ? { ...p, quantity: Math.max(1, Number(quantity)) }
          : p
      )
    );
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

  // Remove one product completely
  const removeFromCart = (id, size, material) => {
    setCart((prev) =>
      prev.filter(
        (p) => !(p.id === id && p.size === size && p.material === material)
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
