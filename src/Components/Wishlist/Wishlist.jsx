import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import { useWishlist } from "../../Context/WishlistContext";
import { toast } from "react-toastify";
import axios from "axios";
import Toast from "../Product/Toast"; // adjust path if needed


export default function Wishlist() {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, clearWishlist, setWishlist, fetchWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [customToast, setCustomToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const showToast = (message, type = "success") => {
    setCustomToast({ message, type, visible: true });
  };


  useEffect(() => {
    fetchWishlist()
  }, [])
  // Fetch wishlist on mount
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        await fetchWishlist();
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  // Transform API data
  const transformWishlistData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(item => ({
      id: item.WishlistID,
      name: item.Name,
      price: item.Price ? parseFloat(item.Price) : 0,
      oldPrice: item.DummyPrice ? parseFloat(item.DummyPrice) : null,
      stockStatus: item.StockStatus || "Out of Stock",
      inStock: item.StockStatus === "In Stock",
      advantages: item.Advantages,
      howToWear: item.HowToWear,
      description: item.Description,
      discountPercentage: item.DiscountPercentage ? parseFloat(item.DiscountPercentage) : 0,
      fullname: item.fullname,
      email: item.email,
      userId: item.UserID,
      productId: item.ProductID,
      wishlistIsActive: item.WishlistIsActive,
      mainImage: item.PrimaryImage
        ? `http://localhost:8001/uploads/${item.PrimaryImage}`
        : item.img || "/s1.jpeg",
      quantity: 1
    }));
  };

  const transformedWishlist = transformWishlistData(wishlist);

  const setItemLoading = (itemId, isLoading) => {
    setActionLoading(prev => ({
      ...prev,
      [itemId]: isLoading
    }));
  };

  // ✅ Remove handler (toggle via API) CORRECT WORKING JUST TRY
  // const handleRemove = async (item) => {
  //   try {
  //     const productId = item.productId;
  //     if (!productId) {
  //       toast.error("Invalid product");
  //       return;
  //     }

  //     setItemLoading(item.id, true);

  //     // Direct API call with axios (toggle wishlist)
  //     const { data } = await axios.post(
  //       "http://localhost:8001/api/manageWishlist",
  //       { productId },
  //       {
  //         headers: {
  //           Authorization: `${localStorage.getItem("authToken")}`, // ✅ send JWT properly
  //         },
  //       }
  //     );

  //     if (data.success) {
  //       toast.success(data.message || `${item.name} removed from wishlist`);

  //       // ✅ Refresh wishlist by calling /listWishlist again
  //       const res = await axios.post(
  //         "http://localhost:8001/api/listWishlist",
  //         {},
  //         {
  //           headers: {
  //             Authorization: `${localStorage.getItem("authToken")}`,
  //           },
  //         }
  //       );

  //       if (res.data.success) {
  //         setWishlist(res.data.data); // ✅ update state directly
  //       }
  //     } else {
  //       toast.error(data.message || "Failed to update wishlist");
  //     }
  //   } catch (error) {
  //     console.error("Error updating wishlist:", error);
  //     toast.error(error.response?.data?.message || "Error updating wishlist");
  //   } finally {
  //     setItemLoading(item.id, false);
  //   }
  // };

  const handleRemove = async (item) => {
    if (!item.productId) return showToast("Invalid product", "error");

    setItemLoading(item.id, true);

    try {
      const { data } = await axios.post(
        "http://localhost:8001/api/manageWishlist",
        { productId: item.productId },
        { headers: { Authorization: localStorage.getItem("authToken") } }
      );

      if (data.success) {
        showToast(data.message || `${item.name} removed from wishlist`, "error");
        setWishlist(prev => prev.filter(w => w.ProductID !== item.productId));
      } else {
        showToast(data.message || "Failed to remove item", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setItemLoading(item.id, false);
    }
  };




  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) return;
    try {
      const res = await clearWishlist();
      if (res && res.success) {
        toast.success("Wishlist cleared!");
      } else {
        toast.error("Failed to clear wishlist");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  const handleMoveToCart = async (item) => {
    if (actionLoading[item.id]) return;
    if (!item.inStock) {
      return showToast("Item is out of stock", "error");
    }

    setItemLoading(item.id, true);

    try {
      const res = await addToCart({
        productid: item.productId,
        name: item.name,
        price: item.price,
        mainImage: item.mainImage || "/s1.jpeg",
      });

      if (res.success) {
        showToast(`${item.name} added to cart successfully!`, "success");
        await addToWishlist({ productId: item.productId });
        await fetchWishlist();
      } else {
        showToast(res.error || "Failed to add item to cart", "error");
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
      showToast("Something went wrong!", "error");
    } finally {
      setItemLoading(item.id, false);
    }
  };


  // Loading UI
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[var(--color-primary-light)]/30 to-[var(--color-background)] min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[var(--color-primary-light)]/30 to-[var(--color-background)] min-h-screen py-14 px-6 relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-full">
              <Heart className="text-[var(--color-primary)]" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text)]">
                My Wishlist
              </h2>
              {transformedWishlist.length > 0 && (
                <p className="text-sm text-[var(--color-text-light)] mt-1">
                  {transformedWishlist.length} item
                  {transformedWishlist.length !== 1 ? "s" : ""} saved
                </p>
              )}
            </div>
          </div>

          {/* {transformedWishlist.length > 0 && (
            <motion.button
              onClick={handleClearAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={16} />
              Clear All
            </motion.button>
          )} */}
        </motion.div>

        <AnimatePresence>
          {transformedWishlist.length > 0 ? (
            <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
              {transformedWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all"
                >
                  {/* Image */}
                  <motion.div className="relative overflow-hidden rounded-xl" whileHover={{ scale: 1.05 }}>
                    <img
                      src={item.mainImage}
                      alt={item.name}
                      className="w-32 h-32 object-cover"
                      onError={(e) => { e.target.src = "/s1.jpeg"; }}
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Out of Stock</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Added by: {item.fullname} ({item.email})</p>
                    <p className="text-sm"><strong>Description:</strong> {item.description}</p>
                    <p className="text-sm"><strong>Advantages:</strong> {item.advantages}</p>
                    <p className="text-sm"><strong>How To Wear:</strong> {item.howToWear}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-semibold">₹{item.price.toFixed(2)}</span>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through">₹{item.oldPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-2xl font-medium w-40 ${item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {item.inStock ? item.stockStatus : "Out of Stock"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    {/* Move to Cart */}
                    <motion.button
                      onClick={() => handleMoveToCart(item)}
                      disabled={!item.inStock || actionLoading[item.id]}
                      whileHover={{ scale: item.inStock && !actionLoading[item.id] ? 1.05 : 1 }}
                      whileTap={{ scale: item.inStock && !actionLoading[item.id] ? 0.95 : 1 }}
                      className={`px-5 py-2.5 text-sm font-medium rounded-full flex items-center gap-2 min-w-[140px] justify-center ${item.inStock && !actionLoading[item.id]
                        ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {actionLoading[item.id] ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <ShoppingBag size={16} /> Move to Cart
                        </>
                      )}
                    </motion.button>

                    {/* Remove */}
                    <motion.button
                      onClick={() => handleRemove(item)}
                      disabled={actionLoading[item.id]}
                      whileHover={{ scale: !actionLoading[item.id] ? 1.05 : 1 }}
                      whileTap={{ scale: !actionLoading[item.id] ? 0.95 : 1 }}
                      className={`text-sm flex items-center gap-1 px-3 py-2 rounded-lg ${actionLoading[item.id]
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] hover:bg-red-50"
                        }`}
                    >
                      {actionLoading[item.id] ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Empty Wishlist
            <motion.div className="flex flex-col items-center justify-center mt-32" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-4 bg-[var(--color-primary)]/10 rounded-full mb-6">
                <Heart className="text-[var(--color-primary)]" size={48} />
              </motion.div>
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Your Wishlist is Empty</h2>
              <p className="text-[var(--color-text-light)] text-center max-w-sm mb-8">
                Browse our collection and add your favorite products to your wishlist.
              </p>
              <Link to="/gemstones" className="px-8 py-3 bg-[var(--color-primary)] text-white font-medium rounded-full hover:bg-[var(--color-primary-dark)] flex items-center gap-2">
                <Sparkles size={16} /> Browse Products
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {customToast.visible && (
        <Toast
          message={customToast.message}
          type={customToast.type}
          onClose={() =>
            setCustomToast((prev) => ({ ...prev, visible: false }))
          }
        />
      )}

    </div>
  );
}
