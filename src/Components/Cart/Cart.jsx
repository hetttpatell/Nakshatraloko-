import React, { useEffect, useRef, useState } from "react";
import { useCart } from "../../Context/CartContext";
import Recommendations from "../Product/Recommendation";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Cart() {
  const { cart, addToCart, removeFromCart, updateQuantity, getCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [transformedCart, setTransformedCart] = useState([]);

  const quantityUpdateTimers = useRef({});

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





  useEffect(() => {
    setTransformedCart(
      cart.map((item) => ({
        id: item.ProductID || item.ID,
        cartId: item.ID,
        name: item.Name,
        description: item.Description,
        price: parseFloat(item.FirstSizePrice),
        originalPrice: parseFloat(item.FirstDummyPrice),
        discount: parseFloat(item.Discount),
        discountPercentage: parseFloat(item.DiscountPercentage),
        image: item.PrimaryImage
          ? `http://localhost:8001/uploads/${item.PrimaryImage}` // prepend your server URL
          : "/s1.jpeg",
        category: item.CategoryName,
        inStock: item.Stock > 0,
        stock: item.Stock,
        rating: parseFloat(item.AvgRating),
        reviews: item.ReviewCount,
        quantity: item.Quantity || 1,
        size: "Standard", // your API doesn’t have size
        material: item.CategoryName
      }))
    );
  }, [cart]);


  // ✅ updates whenever `cart` changes

  // Calculations
  const subtotal = transformedCart.reduce(
    (sum, item) => (item.inStock ? sum + item.price * item.quantity : sum),
    0
  );
  const shipping = subtotal > 5000 ? 0 : 0;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

  // Handle quantity change
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }

    if (newQuantity <= item.stock) {
      // 1️⃣ Update local state immediately
      setTransformedCart(prev =>
        prev.map((p) => (p.id === item.id ? { ...p, quantity: newQuantity } : p))
      );



      // 2️⃣ Debounce backend update
      if (quantityUpdateTimers.current[item.id]) {
        clearTimeout(quantityUpdateTimers.current[item.id]);
      }

      quantityUpdateTimers.current[item.id] = setTimeout(async () => {
        await updateQuantity(item.id, newQuantity);
        await getCart(); // fetch fresh cart including stock
        delete quantityUpdateTimers.current[item.id];
      }, 300);
      ; // 300ms delay
    } else {
      console.warn(`Cannot add more than ${item.stock} items`);
    }
  };


  // Handle remove item
  const handleRemoveItem = async (product) => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post(
        "http://localhost:8001/api/saveCart",
        { productId: product.id },
        { headers: { Authorization: `${token}` } }
      );

      if (res.data.success) {
        console.log(`${product.name} removed successfully from server`);

        // // Remove from client-side cart state
        // removeFromCart(product.id); // <-- use product.id, not cartId
        await getCart();

      } else {
        console.warn(res.data.message);
      }
    } catch (err) {
      console.error("Failed to remove product:", err);
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
          {transformedCart.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {transformedCart.map((product) => (
                  <motion.div
                    key={`${product.cartId}-${product.id}`}
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
                        onError={(e) => {
                          console.log('Image failed to load:', product.image);
                          e.target.src = '/s1.jpeg'; // Fallback image
                        }}
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {product.discountPercentage.toFixed(0)}% OFF
                        </div>
                      )}
                    </motion.div>

                    {/* Product Info */}
                    <div className="flex-1 text-center sm:text-left space-y-2">
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
                          <p className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">
                            In Stock ({product.stock} left)
                          </p>
                        ) : (
                          <p className="text-red-600 text-sm font-medium bg-red-100 px-2 py-1 rounded-full">
                            Out of Stock
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-[var(--color-text)] font-bold text-lg">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            ₹{(product.originalPrice * product.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[var(--color-text-light)]">
                        (₹{product.price.toFixed(2)} × {product.quantity})
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center sm:items-end gap-4">
                      {/* Quantity Controls */}
                      {product.inStock && (
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuantityChange(product, product.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                              disabled={product.quantity <= 1}
                              type="button"
                            >
                              <Minus size={14} />
                            </motion.button>

                            <span className="w-8 text-center font-medium">{product.quantity}</span>

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleQuantityChange(product, product.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                              disabled={product.quantity >= product.stock}
                              type="button"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>

                        </div>
                      )}

                      {/* Remove button - Fixed the onClick handler */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveItem(product)}
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
                    <span>Subtotal ({transformedCart.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-light)]">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "text-[var(--color-text-light)]"}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {/* {subtotal > 0 && subtotal < 5000 && (
                    <div className="text-xs text-[var(--color-text-light)] bg-blue-50 p-2 rounded">
                      Add ₹{(5000 - subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )} */}
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
    </div>
  );
}