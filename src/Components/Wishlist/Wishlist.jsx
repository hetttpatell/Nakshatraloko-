import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Sparkles, Zap } from "lucide-react";
import { useWishlist } from "../../Context/WishlistContext"; // ✅ import context


export default function Wishlist() {
  const { addToCart } = useCart();

  const { wishlist, removeFromWishlist, addToWishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleRemove = async (id) => {
    const res = await removeFromWishlist(id);
    if (res.success) {
      toast.success("Item removed from wishlist");
    } else {
      toast.error(res.message || "Failed to remove item");
    }
  };


  const handleClearAll = async () => {
    await clearWishlist();
    toast.success("Wishlist cleared!");
  };

  const handleMoveToCart = async (productId) => {
    const item = wishlist.find((i) => (i._id || i.ID) === productId);
    if (!item) return;

    try {
      const res = await addToCart({ productId });
      if (res.success) {
        await removeFromWishlist(productId);
        toast.success(`${item.name} moved to cart`);
      } else {
        toast.error(res.message || "Failed to move item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error moving to cart");
    }
  };



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
            <h2 className="text-3xl font-bold text-[var(--color-text)]">
              My Wishlist
            </h2>
          </div>

          {wishlist.length > 0 && (
            <motion.button
              onClick={handleClearAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence>
          {wishlist.length > 0 ? (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {wishlist.map((item) => (
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
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Out of Stock</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wide">
                      {item.brand} · {item.material}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <div className="flex text-[var(--color-rating)]">
                        {"★".repeat(Math.floor(item.rating))}
                        {"☆".repeat(5 - Math.floor(item.rating))}
                      </div>
                      <span className="text-[var(--color-text-light)]">
                        ({item.reviews} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-2">
                      {item.oldPrice && (
                        <span className="text-sm text-[var(--color-text-muted)] line-through mr-2">
                          ₹{item.oldPrice}
                        </span>
                      )}
                      <span className="text-lg font-semibold text-[var(--color-text)]">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Quantity & Stock */}
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-sm text-[var(--color-text-light)]">
                        Quantity: <b>{item.quantity}</b>
                      </p>
                      <div className={`text-xs px-2 py-1 rounded-full ${item.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    <motion.button
                      onClick={() => handleMoveToCart(item.id)}
                      disabled={!item.inStock}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${item.inStock
                        ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <ShoppingBag size={16} />
                      Move to Cart
                    </motion.button>
                    <motion.button
                      onClick={async () => {
                        const product = { _id: item._id || item.ID, name: item.name };
                        const res = await addToWishlist(product); // toggles IsActive
                        if (res.success) {
                          toast.success(res.message);
                        } else {
                          toast.error(res.message);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] transition-colors flex items-center gap-1 pointer-events-auto"
                    >
                      <Trash2 size={14} />
                      Remove
                    </motion.button>


                  </div>
                </motion.div>
              ))}
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