import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Sparkles, Zap } from "lucide-react";
import { useWishlist } from "../../Context/WishlistContext";
import { toast } from "react-toastify"; // Make sure to import toast

export default function Wishlist() {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, addToWishlist, clearWishlist, fetchWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch wishlist on component mount
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        await fetchWishlist();
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);


  // Transform wishlist data if needed (similar to cart)
  const transformWishlistData = (apiData) => {
    if (!Array.isArray(apiData)) return [];

    return apiData.map(item => ({
      id: item.WishlistID, // use WishlistID as unique id
      name: item.Name,
      price: item.Price ? parseFloat(item.Price) : 0,
      oldPrice: item["Dummy Price"] ? parseFloat(item["Dummy Price"]) : null,
      stock: item.Stock,
      inStock: item.Stock > 0,
      advantages: item.Advantages,
      howToWear: item.HowToWear,
      description: item.Description,
      discountPercentage: item["Discount Percentage"] ? parseFloat(item["Discount Percentage"]) : 0,
      createdAt: item.CreatedAt,
      updatedAt: item.UpdatedAt,
      fullname: item.fullname,
      email: item.email,
      userId: item.UserID,
      productId: item.ProductID,
      wishlistIsActive: item.WishlistIsActive,
      mainImage: '/s1.jpeg', // fallback image, you can replace if API has real image
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

  const handleRemove = async (item) => {
    console.log(item.id);
    const itemId = item.id; // now guaranteed to exist
    console.log(itemId);
    if (!itemId) {
      toast.error("Invalid item");

      useEffect(() => {
        console.log("Raw wishlist data:", wishlist);
      }, [wishlist]);
      return;
    }

    setItemLoading(itemId, true);
    try {
      const res = await removeFromWishlist(itemId);
      if (res.success) {
        toast.success(`${item.name} removed from wishlist`);
      } else {
        toast.error(res.message || "Failed to remove item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    } finally {
      setItemLoading(itemId, false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) {
      return;
    }

    try {
      const res = await clearWishlist();
      if (res && res.success) {
        toast.success("Wishlist cleared!");
      } else {
        toast.success("Wishlist cleared!");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  const handleMoveToCart = async (item) => {
    const isItemLoading = actionLoading[item.id];
    if (isItemLoading) return;

    if (!item.inStock) {
      toast.error("Item is out of stock");
      return;
    }

    setItemLoading(item.id, true); // show loading spinner on button
    try {
      // Call addToCart from context
      const res = await addToCart({
        productid: item.productId, // match your API expected field
        name: item.name,
        price: item.price,
        mainImage: item.mainImage || '/s1.jpeg',
      });
      console.log(res.data)
      if (res.success) {
        toast.success(`${item.name} added to cart successfully!`);

        // Optionally remove from wishlist
        await removeFromWishlist(item.id);
      } else {
        toast.error(res.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error moving to cart:", error);
      toast.error("Something went wrong!");
    } finally {
      setItemLoading(item.id, false);
    }
  };


  // const handleToggleWishlist = async (item) => {
  //   const productId = item.id || item._id || item.ID;
  //   if (!productId) {
  //     toast.error("Invalid product");
  //     return;
  //   }

  //   setItemLoading(productId, true);
  //   try {
  //     const product = {
  //       _id: productId,
  //       id: productId,
  //       name: item.name
  //     };

  //     const res = await addToWishlist(product);
  //     if (res.success) {
  //       toast.success(res.message);
  //     } else {
  //       toast.error(res.message || "Failed to update wishlist");
  //     }
  //   } catch (error) {
  //     console.error("Error toggling wishlist:", error);
  //     toast.error("Error updating wishlist");
  //   } finally {
  //     setItemLoading(productId, false);
  //   }
  // };

  // Background circles component
  const BackgroundCircle = ({ top, left, size, color, delay, duration, yMovement }) => (
    <motion.div
      className={`absolute ${size} rounded-full ${color}`}
      style={{ top: `${top}%`, left: `${left}%` }}
      animate={{
        y: [0, yMovement, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
    />
  );

  // Loading state
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
      {/* Background elements */}
      <BackgroundCircle top={10} left={5} size="w-16 h-16" color="bg-[var(--color-primary)]/10" delay={0} duration={8} yMovement={15} />
      <BackgroundCircle top={80} left={90} size="w-20 h-20" color="bg-[var(--color-primary)]/10" delay={1} duration={7} yMovement={-12} />
      <BackgroundCircle top={30} left={85} size="w-12 h-12" color="bg-[var(--color-primary)]/10" delay={2} duration={9} yMovement={10} />
      <BackgroundCircle top={40} left={75} size="w-12 h-12" color="bg-[var(--color-primary)]/10" delay={9} duration={5} yMovement={40} />
      <BackgroundCircle top={50} left={15} size="w-12 h-12" color="bg-[var(--color-primary)]/10" delay={0} duration={2} yMovement={40} />

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
                  {transformedWishlist.length} item{transformedWishlist.length !== 1 ? 's' : ''} saved
                </p>
              )}
            </div>
          </div>

          {transformedWishlist.length > 0 && (
            <motion.button
              onClick={handleClearAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={16} />
              Clear All
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence>
          {transformedWishlist.length > 0 ? (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {transformedWishlist.map((item) => {
                const isItemLoading = actionLoading[item.id];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all"
                  >
                    {/* Product Image */}
                    <motion.div
                      className="relative overflow-hidden rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="w-32 h-32 object-cover"
                        onError={(e) => {
                          e.target.src = '/s1.jpeg';
                        }}
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                      {item.discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.discountPercentage.toFixed(0)}% OFF
                        </div>
                      )}
                    </motion.div>

                    {/* Product Info */}
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
                        {item.discountPercentage > 0 && (
                          <span className="text-xs text-red-500">{item.discountPercentage.toFixed(0)}% OFF</span>
                        )}
                      </div>

                      <div className={`text-xs px-3 py-1 rounded-2xl  font-medium  w-40
                        ${item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {item.inStock ? `In Stock (${item.stock} available)` : "Out of Stock"}
                      </div>
                    </div>


                    {/* Actions */}
                    <div className="flex flex-col items-center sm:items-end gap-3">
                      <motion.button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.inStock || actionLoading[item.id]}
                        whileHover={{ scale: item.inStock && !actionLoading[item.id] ? 1.05 : 1 }}
                        whileTap={{ scale: item.inStock && !actionLoading[item.id] ? 0.95 : 1 }}
                        className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all flex items-center gap-2 min-w-[140px] justify-center ${item.inStock && !actionLoading[item.id]
                          ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
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
                            <ShoppingBag size={16} />
                            Move to Cart
                          </>
                        )}
                      </motion.button>


                      <motion.button
                        onClick={async () => {
                          const res = await addToWishlist(item.ID);
                          console.log(res);
                        }}
                        disabled={isItemLoading}
                        whileHover={{ scale: !isItemLoading ? 1.05 : 1 }}
                        whileTap={{ scale: !isItemLoading ? 0.95 : 1 }}
                        className={`text-sm transition-colors flex items-center gap-1 px-3 py-2 rounded-lg ${isItemLoading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] hover:bg-red-50"
                          }`}
                      >
                        {isItemLoading ? (
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
                );
              })}
            </motion.div>
          ) : (
            // Empty Wishlist
            <motion.div
              className="flex flex-col items-center justify-center mt-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-4 bg-[var(--color-primary)]/10 rounded-full mb-6"
              >
                <Heart className="text-[var(--color-primary)]" size={48} />
              </motion.div>
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-[var(--color-text-light)] text-center max-w-sm mb-8">
                Browse our collection and add your favorite products to your wishlist.
              </p>
              <Link
                to="/gemstones"
                className="px-8 py-3 bg-[var(--color-primary)] text-white font-medium rounded-full hover:bg-[var(--color-primary-dark)] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Sparkles size={16} />
                Browse Products
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}