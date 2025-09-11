import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

    // Helper function to get auth token
    const getAuthToken = () => {
        return localStorage.getItem("authToken");
    };

    // Add to wishlist with API call
    const addToWishlist = async (product) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return { success: false, message: "Please login to add items to wishlist" };
            }

            // Prepare the data to send to the API
            const wishlistItem = {
                productId: product.id
            };

            // Make the API call with authorization header
            const response = await axios.post("http://localhost:8001/api/manageWishlist", wishlistItem, {
                headers: {
                    Authorization: token
                }
            });

            if (response.data.success) {
                // Add to local wishlist context
                setWishlist((prev) => {
                    const exists = prev.find((p) => p.id === product.id);
                    if (exists) {
                        return prev;
                    }
                    return [...prev, { ...product }];
                });
                return { success: true, message: `${product.name} added to Wishlist` };
            } else {
                return { success: false, message: "Failed to add item to wishlist" };
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            if (error.response?.status === 401) {
                return { success: false, message: "Please login to add items to wishlist" };
            }
            return { success: false, message: "Error adding item to wishlist" };
        }
    };

    // Remove from wishlist with API call
    const removeFromWishlist = async (id) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return { success: false, message: "Please login to manage wishlist" };
            }

            // Make the API call to remove item with authorization header
           const response = await axios.post("http://localhost:8001/api/manageWishlist", wishlistItem, {
                headers: {
                    Authorization: token
                }
            });


            if (response.data.success) {
                // Remove from local wishlist context
                setWishlist((prev) => prev.filter((item) => item.id !== id));
                return { success: true, message: "Item removed from Wishlist" };
            } else {
                return { success: false, message: "Failed to remove item from wishlist" };
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            if (error.response?.status === 401) {
                return { success: false, message: "Please login to manage wishlist" };
            }
            return { success: false, message: "Error removing item from wishlist" };
        }
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