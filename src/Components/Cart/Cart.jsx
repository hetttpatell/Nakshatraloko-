import React, { useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import Recommendations from "../Product/Recommendation";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


export default function Cart() {
  // ✅ include getCart here
const { cart, addToCart, updateQuantity, getCart, removeFromCart } = useCart();

  // ✅ fetch cart on mount
  
  useEffect(() => {
    getCart();
  }, []);

  // Handlers
  
  // Remove handler using CartContext's removeFromCart
const handleRemove = async (product) => {
    try {
      await removeFromCart(product.id, product.size, product.material);
      getCart(); // Refresh cart after removal
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

   const handleQuantityChange = (id, size, material, value) =>
    updateQuantity(id, size, material, Math.max(1, Number(value)));
  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => (item.inStock ? sum + item.price * item.quantity : sum),
    0
  );
  const shipping = subtotal > 5000 ? 0 : 199;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

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
    <div className="bg-gradient-to-b from-[var(--color-primary-light)]/30 to-[var(--color-background)] min-h-screen py-14 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background elements */}
      <BackgroundCircle top={10} left={5} size="w-16 h-16" color="bg-[var(--color-primary)]/10" delay={0} duration={8} yMovement={15} />
      <BackgroundCircle top={80} left={90} size="w-20 h-20" color="bg-[var(--color-primary)]/10" delay={1} duration={7} yMovement={-12} />
      <BackgroundCircle top={30} left={85} size="w-12 h-12" color="bg-[var(--color-primary)]/10" delay={2} duration={9} yMovement={10} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Zap size={16} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
            <span className="text-sm font-medium">Shopping Bag</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-[var(--color-text)] mb-2">
            My Shopping Bag
          </h2>
          <p className="text-[var(--color-text-light)]">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        <AnimatePresence>
          {cart.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((product) => (
                  <motion.div
                    key={`${product.id ?? Math.random()}-${product.size ?? "default"}-${product.material ?? "default"}`}
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
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-32 object-cover"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                    </motion.div>

                    {/* Product Info */}
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--color-text)] line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wide">
                        {product.material} • {product.size}
                      </p>
                      <div className="flex items-center gap-1 text-sm">
                        <div className="flex text-[var(--color-rating)]">
                          {"★".repeat(Math.floor(product.rating))}
                          {"☆".repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span className="text-[var(--color-text-light)]">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      {product.inStock ? (
                        <p className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full inline-block">
                          In Stock
                        </p>
                      ) : (
                        <p className="text-red-600 text-sm font-medium bg-red-100 px-2 py-1 rounded-full inline-block">
                          Out of Stock
                        </p>
                      )}

                      <div className="text-[var(--color-text)] font-bold text-lg">
                        ₹{product.price * product.quantity}
                      </div>
                      <div className="text-xs text-[var(--color-text-light)]">
                        (₹{product.price} × {product.quantity})
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center sm:items-end gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[var(--color-border)] rounded-full overflow-hidden shadow-sm">
                        <motion.button
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.size,
                              product.material,
                              product.quantity - 1
                            )
                          }
                          disabled={product.quantity <= 1 || !product.inStock}
                          whileTap={{ scale: 0.9 }}
                          className="px-3 py-2 bg-gray-100 text-[var(--color-text)] hover:bg-gray-200 disabled:opacity-40 transition-colors"
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="px-4 py-2 text-[var(--color-text)] font-semibold">
                          {product.quantity}
                        </span>
                        <motion.button
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.size,
                              product.material,
                              product.quantity + 1
                            )
                          }
                          disabled={!product.inStock}
                          whileTap={{ scale: 0.9 }}
                          className="px-3 py-2 bg-gray-100 text-[var(--color-text)] hover:bg-gray-200 disabled:opacity-40 transition-colors"
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>

                      {/* Remove */}
                     
                      <motion.button
                        onClick={() => handleRemove(product)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </motion.button>

                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-6 text-[var(--color-text)]">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-[var(--color-text)]">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-light)]">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "text-[var(--color-text-light)]"}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                    <div className="flex justify-between font-bold text-xl text-[var(--color-text)]">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <Link
                    to="/gemstones"
                    className="w-full py-3 border border-[var(--color-primary)] text-[var(--color-primary)] tracking-wide font-medium uppercase rounded-full hover:bg-[var(--color-primary)]/10 transition text-center"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/payment"
                    className={`w-full py-3 rounded-full tracking-wide font-medium uppercase transition text-center flex items-center justify-center gap-2 ${subtotal === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
                      }`}
                  >
                    <Sparkles size={16} />
                    Proceed to Checkout
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Empty Cart
            <motion.div
              className="text-center py-20"
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
                className="inline-flex items-center justify-center w-24 h-24 bg-[var(--color-primary)]/10 rounded-full mb-6"
              >
                <ShoppingBag className="text-[var(--color-primary)]" size={40} />
              </motion.div>
              <p className="text-2xl font-semibold text-[var(--color-text)] mb-2">
                Your bag is empty
              </p>
              <p className="text-[var(--color-text-light)] mb-8">
                Looks like you haven't added anything yet
              </p>
              <Link
                to="/gemstones"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white font-medium rounded-full hover:bg-[var(--color-primary-dark)] transition-all shadow-md hover:shadow-lg"
              >
                <Sparkles size={16} />
                Start Shopping
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        {cart.length > 0 && (
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Recommendations />
          </motion.div>
        )}
      </div>
    </div>
  );
}