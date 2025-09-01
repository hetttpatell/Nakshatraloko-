import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    // Load from localStorage once when component mounts
    useEffect(() => {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
            setWishlist(JSON.parse(saved));
        }
    }, []);

    // Sync with localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // Add or increase quantity
    const addToWishlist = (product) => {
        setWishlist((prev) => {
            const exists = prev.find(
                (p) => p.id === product.id);
            if (exists) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p } : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Remove one
    const removeFromWishlist = (id) => {
        setWishlist((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // Clear wishlist
    const clearWishlist = () => {
        setWishlist([]); // Only clear state, useEffect will handle localStorage
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => useContext(WishlistContext);
