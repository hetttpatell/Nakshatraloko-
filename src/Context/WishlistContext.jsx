// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const WishlistContext = createContext();

// export function WishlistProvider({ children }) {
//   const [wishlist, setWishlist] = useState([]);

//   // Helper function to get auth token
//   const getAuthToken = () => localStorage.getItem("authToken");

//   // Fetch wishlist from server
//   const fetchWishlist = async () => {
//     const token = getAuthToken();
//     if (!token) {
//       setWishlist([]);
//       return;
//     }
//     try {
//       const response = await axios.post(
//         "${BACKEND_URL}listWishlist",
//         {},
//         { headers: { Authorization: token } }
//       );
//       if (response.data.success) {
//         setWishlist(response.data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching wishlist:", error);
//     }
//   };

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   // Add or remove from wishlist via API
//   const addToWishlist = async (product) => {
//     const token = getAuthToken();
//     if (!token) return { success: false, message: "Please login" };

//     const productId = product._id || product.id;
//     if (!productId) return { success: false, message: "Invalid product" };

//     try {
//       const response = await axios.post(
//         "${BACKEND_URL}manageWishlist",
//         { productId },
//         { headers: { Authorization: token } }
//       );

//       if (response.data.success) {
//         await fetchWishlist();
//         return { success: true, message: response.data.message || `${product.name} updated in wishlist` };
//       } else {
//         return { success: false, message: "Failed to update wishlist" };
//       }
//     } catch (error) {
//       console.error("Error updating wishlist:", error);
//       return { success: false, message: "Error updating wishlist" };
//     }
//   };

//   const removeFromWishlist = async (id) => addToWishlist({ _id: id }); // reuse manageWishlist endpoint

//   const clearWishlist = async () => {
//     const token = getAuthToken();
//     if (!token) return { success: false, message: "Please login" };

//     try {
//       await axios.post(
//         "${BACKEND_URL}clearWishlist",
//         {},
//         { headers: { Authorization: token } }
//       );
//       await fetchWishlist();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// }

// export const useWishlist = () => useContext(WishlistContext);
// WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Helper function to get auth token
  const getAuthToken = () => localStorage.getItem("authToken");

  // Fetch wishlist from server
  const fetchWishlist = async () => {
    const token = getAuthToken();
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}listWishlist`,
        {},
        { headers: { Authorization: token } }
      );
      if (response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (error) {
      // console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add or remove from wishlist via API
const addToWishlist = async (product) => {
  const token = getAuthToken();
  if (!token) {
    return { success: false, message: "Please login" };
  }

  const productId = product.ID; // ✅ Use product.ID consistently
  if (!productId) {
    return { success: false, message: "Invalid product" };
  }

  try {
    const { data } = await axios.post( 
      `${BACKEND_URL}manageWishlist`,
      { ProductID: productId }, // ✅ Match DB column name
      {
        headers: { Authorization: token },
      }
    );

    if (data.success) {
      await fetchWishlist(); // ✅ Refresh wishlist after toggle
      return {
        success: true,
        message: data.message || `${product.name} updated in wishlist`,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to update wishlist",
    };
  } catch (error) {
    // console.error("Error updating wishlist:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error updating wishlist",
    };
  }
};


  const removeFromWishlist = async (id) => addToWishlist({ id }); // reuse manageWishlist

  const clearWishlist = async () => {
    const token = getAuthToken();
    if (!token) return { success: false, message: "Please login" };

    try {
      await axios.post(
        `${BACKEND_URL}clearWishlist`,
        {},
        { headers: { Authorization: token } }
      );
      await fetchWishlist();
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist,fetchWishlist, addToWishlist, setWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
