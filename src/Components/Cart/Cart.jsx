import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../Context/CartContext";
import Recommendations from "../Product/Recommendation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Zap,
  LogIn,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Toast from "../Product/Toast";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

const normalizeImage = (url) => {
  let fixedUrl = url?.trim() || "";

  if (!fixedUrl) return "/s1.jpeg";

  if (fixedUrl.startsWith("http")) {
    fixedUrl = fixedUrl.replace(/([^:]\/)\/+/g, "$1");
    fixedUrl = fixedUrl.replace(
      /^http:\/\/localhost:8001\/uploads/,
      `${IMG_URL}/uploads`
    );
  } else {
    if (!fixedUrl.startsWith("/uploads/")) {
      fixedUrl = `/uploads/${fixedUrl.replace(/^\/+/, "")}`;
    }
    fixedUrl = `${IMG_URL}${fixedUrl}`.replace(/([^:]\/)\/+/g, "$1");
  }

  return fixedUrl;
};

// Custom hook for smooth quantity management
const useSmoothQuantity = (initialQuantity = 1) => {
  const [displayQuantity, setDisplayQuantity] = useState(initialQuantity);
  const [actualQuantity, setActualQuantity] = useState(initialQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    setDisplayQuantity(initialQuantity);
    setActualQuantity(initialQuantity);
  }, [initialQuantity]);

  const smoothUpdate = (newQuantity, onUpdateComplete) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startQuantity = displayQuantity;
    const duration = 300; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentDisplay = Math.round(
        startQuantity + (newQuantity - startQuantity) * easeOutQuart
      );
      
      setDisplayQuantity(currentDisplay);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayQuantity(newQuantity);
        setActualQuantity(newQuantity);
        setIsUpdating(false);
        onUpdateComplete?.();
      }
    };

    setIsUpdating(true);
    animationRef.current = requestAnimationFrame(animate);
  };

  return {
    displayQuantity,
    actualQuantity,
    isUpdating,
    smoothUpdate,
  };
};

// Optimized Quantity Controller Component
const QuantityController = ({ 
  product, 
  onQuantityChange, 
  className = "" 
}) => {
  const { displayQuantity, isUpdating, smoothUpdate } = useSmoothQuantity(product.quantity);
  const updateTimeoutRef = useRef(null);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === displayQuantity || newQuantity < 1 || newQuantity > product.stock) return;

    // Immediate visual feedback
    smoothUpdate(newQuantity, () => {
      // Debounced API call after animation completes
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        onQuantityChange(product, newQuantity);
      }, 100);
    });
  };

  const increment = () => handleQuantityChange(displayQuantity + 1);
  const decrement = () => handleQuantityChange(displayQuantity - 1);

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 bg-gray-100 rounded-full p-1 relative ${className}`}>
      {/* Update Indicator */}
      {isUpdating && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
        />
      )}

      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        onClick={decrement}
        disabled={displayQuantity <= 1 || isUpdating}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        type="button"
      >
        <Minus size={14} />
      </motion.button>

      <div className="relative">
        <motion.span
          key={displayQuantity}
          initial={{ scale: 1.2, y: -5 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="w-8 text-center font-medium text-sm relative z-10"
        >
          {displayQuantity}
        </motion.span>
        
        {/* Animated background highlight */}
        {isUpdating && (
          <motion.div
            className="absolute inset-0 bg-blue-100 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        onClick={increment}
        disabled={displayQuantity >= product.stock || isUpdating}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        type="button"
      >
        <Plus size={14} />
      </motion.button>

      {/* Loading overlay */}
      {isUpdating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/50 rounded-full backdrop-blur-sm flex items-center justify-center"
        >
          <Loader2 size={12} className="animate-spin text-blue-500" />
        </motion.div>
      )}
    </div>
  );
};

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [transformedCart, setTransformedCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customToast, setCustomToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setCustomToast({ message, type, visible: true });
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // Handle checkout
  const handleCheckout = () => {
    if (subtotal === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!isLoggedIn) {
      toast.info("Please log in to proceed to checkout");
      return;
    }

    navigate("/payment");
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    navigate("/");
  };

  // Fetch cart on mount
  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        await getCart();
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Transform cart data
  useEffect(() => {
    setTransformedCart(
      cart.map((item) => {
        let imagePath = item.PrimaryImage;

        if (imagePath?.startsWith("http")) {
          imagePath = imagePath;
        } else {
          imagePath = `${IMG_URL}uploads${imagePath}`;
        }

        return {
          id: item.ProductID || item.ID,
          cartId: item.ID,
          name: item.Name,
          description: item.Description,
          price: parseFloat(item.FirstSizePrice),
          originalPrice: parseFloat(item.FirstDummyPrice),
          discountPercentage: item.DiscountPercentage,
          image: normalizeImage(
            item.PrimaryImage || item.image || item.primaryimage || "/s1.jpeg"
          ),
          category: item.CategoryName,
          inStock: item.Stock > 0,
          stock: item.Stock,
          rating: parseFloat(item.AvgRating),
          reviews: item.ReviewCount,
          quantity: item.Quantity || 1,
          size: "Standard",
          material: item.CategoryName,
        };
      })
    );
  }, [cart]);

  // Calculations with memoization
  const { subtotal, shipping, total } = React.useMemo(() => {
    const subtotal = transformedCart.reduce(
      (sum, item) => (item.inStock ? sum + item.price * item.quantity : sum),
      0
    );
    const shipping = subtotal > 5000 ? 0 : 0;
    const total = subtotal + (subtotal > 0 ? shipping : 0);
    
    return { subtotal, shipping, total };
  }, [transformedCart]);

  // Optimized quantity change handler
  const handleQuantityChange = async (product, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(product);
      return;
    }

    if (newQuantity > product.stock) {
      showToast(`Only ${product.stock} items available`, "error");
      return;
    }

    // Add to updating items
    setUpdatingItems(prev => new Set(prev).add(product.id));

    try {
      await updateQuantity(product.id, newQuantity);
      // Silent sync in background
      getCart().catch(() => {});
    } catch (error) {
      // Show error but don't revert UI - let the smooth controller handle it
      showToast("Failed to update quantity", "error");
    } finally {
      // Remove from updating items
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // Handle remove item
  const handleRemoveItem = async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${BACKEND_URL}saveCart`,
        { productId: product.id },
        { headers: { Authorization: `${token}` } }
      );

      if (res.data.success) {
        await getCart();
        showToast(`${product.name} removed from cart`, "error");
      } else {
        showToast(res.data.message || "Failed to remove item", "error");
      }
    } catch (err) {
      showToast("Something went wrong while removing item", "error");
    }
  };

  // Enhanced Background Circle with better performance
  const BackgroundCircle = React.memo(({
    top,
    left,
    size,
    color,
    delay,
    duration,
    yMovement,
  }) => (
    <motion.div
      className={`absolute ${size} rounded-full ${color}`}
      style={{ top: `${top}%`, left: `${left}%` }}
      animate={{
        y: [0, yMovement, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  ));

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
    <div className="bg-gradient-to-b from-[var(--color-primary-light)]/30 to-[var(--color-background)] min-h-screen py-14 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Background elements */}
      <BackgroundCircle
        top={10}
        left={5}
        size="w-16 h-16"
        color="bg-[var(--color-primary)]/10"
        delay={0}
        duration={8}
        yMovement={15}
      />
      <BackgroundCircle
        top={80}
        left={90}
        size="w-20 h-20"
        color="bg-[var(--color-primary)]/10"
        delay={1}
        duration={7}
        yMovement={-12}
      />
      <BackgroundCircle
        top={30}
        left={85}
        size="w-12 h-12"
        color="bg-[var(--color-primary)]/10"
        delay={2}
        duration={9}
        yMovement={10}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title Section */}
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
            <Zap
              size={16}
              className="fill-[var(--color-primary)] text-[var(--color-primary)]"
            />
            <span className="text-sm font-medium">Shopping Bag</span>
          </motion.div>

          <h2 className="text-4xl font-bold text-[var(--color-text)] mb-2">
            My Shopping Bag
          </h2>

          <p className="text-[var(--color-text-light)] mb-6">
            Review your items and proceed to checkout
          </p>

          {!isLoggedIn && (
            <button
              onClick={handleLoginRedirect}
              className="w-full max-w-xs mx-auto py-3 rounded-full tracking-wide font-medium uppercase transition text-center flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
            >
              <LogIn size={16} />
              Login to Checkout
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {transformedCart.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence>
                  {transformedCart.map((product) => (
                    <motion.div
                      key={`${product.cartId}-${product.id}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all"
                    >
                      {/* Product Image */}
                      <motion.div
                        className="relative overflow-hidden rounded-xl flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 object-cover"
                          onError={(e) => {
                            e.target.src = "/s1.jpeg";
                          }}
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {product.discountPercentage > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {product.discountPercentage}% OFF
                          </div>
                        )}
                      </motion.div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wide">
                          {product.category}
                        </p>

                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <div className="flex text-[var(--color-rating)]">
                              {"★".repeat(Math.floor(product.rating))}
                              {"☆".repeat(5 - Math.floor(product.rating))}
                            </div>
                            <span className="text-[var(--color-text-light)]">
                              ({product.reviews} reviews)
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {product.inStock ? (
                            <p className="bg-[var(--color-primary-light)] text-color-primary border-color-primary px-4 py-2 rounded-2xl text-center w-fit mx-auto sm:mx-0">
                              In Stock
                            </p>
                          ) : (
                            <p className="text-red-600 text-sm font-medium bg-red-100 px-2 py-1 rounded-full">
                              Out of Stock
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="text-[var(--color-text)] font-bold text-lg"
                            key={product.price * product.quantity}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            ₹{(product.price * product.quantity).toFixed(2)}
                          </motion.div>
                          {product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹
                              {(product.originalPrice * product.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center sm:items-end gap-4">
                        {/* Enhanced Quantity Controller */}
                        {product.inStock && (
                          <QuantityController
                            product={product}
                            onQuantityChange={handleQuantityChange}
                          />
                        )}

                        {/* Remove button */}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleRemoveItem(product)}
                          disabled={updatingItems.has(product.id)}
                          className="flex items-center gap-1 text-sm text-[var(--color-text-light)] hover:text-[var(--color-accent-red)] transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-6 text-[var(--color-text)]">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-[var(--color-text)]">
                    <span>Subtotal ({transformedCart.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-light)]">
                      Shipping
                    </span>
                    <span className="text-green-600 font-medium">
                      Free
                    </span>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                    <div className="flex justify-between font-bold text-xl text-[var(--color-text)]">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
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

                  {isLoggedIn ? (
                    <button
                      onClick={handleCheckout}
                      disabled={subtotal === 0}
                      className={`w-full py-3 rounded-full tracking-wide font-medium uppercase transition text-center flex items-center justify-center gap-2 ${
                        subtotal === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
                      }`}
                    >
                      <Sparkles size={16} />
                      Proceed to Checkout
                    </button>
                  ) : (
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full py-3 rounded-full tracking-wide font-medium uppercase transition text-center flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
                    >
                      <LogIn size={16} />
                      Login to Checkout
                    </button>
                  )}
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
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-24 h-24 bg-[var(--color-primary)]/10 rounded-full mb-6"
              >
                <ShoppingBag
                  className="text-[var(--color-primary)]"
                  size={40}
                />
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
        {transformedCart.length > 0 && (
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
      
      {/* Toast */}
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