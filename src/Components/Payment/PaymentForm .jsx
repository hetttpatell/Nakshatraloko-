// PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, Zap, ArrowRight, Percent, Check, X } from "lucide-react";
import axios from "axios";
import Toast from "../Product/Toast";

// Background circles component (same as Collections.jsx)
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

const UnderlineInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  maxLength,
}) => (
  <div className="flex flex-col w-full" style={{ minWidth: 0 }}>
    <label
      htmlFor={name}
      className="mb-1 text-xs font-semibold text-[var(--color-text-light)] tracking-wide"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      className="border-b border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none py-2 text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm bg-transparent transition-colors"
      placeholder={label}
      autoComplete="off"
    />
  </div>
);

const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [subtotalAmount, setSubtotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    paymentMethod: "upi",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    upiId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toastData, setToastData] = useState(null);
  const showToast = (message, type = "success", duration = 4000) => {
    setToastData({ message, type, duration });
  };

  const navigate = useNavigate();
  const { id } = useParams(); // Get order ID from URL params if available

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // No token found, redirect to home
        navigate("/");

        return false;
      }
      setIsAuthenticated(true);
      return true;
    };

    checkAuth();
  }, [navigate]);

  // ✅ Fetch cart data from API
  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post("http://localhost:8001/api/getCart", {}, {
        headers: { Authorization: `${token}` }
      });
      console.log("API Response:", response.data); // Add this line
      // Check if response has data directly or nested in data property
      let cartData = response.data;

      // If response has success property and data nested
      if (response.data && response.data.success && response.data.data) {
        cartData = response.data.data;
      }

      // Transform cart data to match expected format
      const transformedCart = cartData.map((item) => {
        return {
          id: item.ProductID || item.id,
          cartId: item.ID || item.cartId,
          name: item.Name || item.name,
          description: item.Description || item.description,
          price: parseFloat(item.FirstSizePrice || item.price || 0),
          originalPrice: parseFloat(item.FirstDummyPrice || item.originalPrice || 0),
          discountPercentage: parseFloat(item.DiscountPercentage || item.discountPercentage || 0),
          image: item.PrimaryImage || item.image,
          category: item.CategoryName || item.category,
          inStock: (item.Stock || item.stock || 0) > 0,
          stock: item.Stock || item.stock || 0,
          rating: parseFloat(item.AvgRating || item.rating || 0),
          reviews: item.ReviewCount || item.reviews || 0,
          quantity: item.Quantity || item.quantity || 1,
          size: "Standard",
          material: item.CategoryName || item.category,
        };
      });

      setCartItems(transformedCart);

      // Calculate subtotal
      const subtotal = transformedCart.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );
      setSubtotalAmount(subtotal);
      setTotalAmount(subtotal); // Initially total equals subtotal

    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart. Please try again.");

      // Fallback to localStorage
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);

      const subtotal = savedCart.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );
      setSubtotalAmount(subtotal);
      setTotalAmount(subtotal);
    }
  };

  // ✅ Apply coupon function
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const token = localStorage.getItem("authToken");

      // Mock coupon validation - replace with actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Mock coupon data
          const mockCoupons = {
            "SAVE10": { discount: 10, type: "percentage", minAmount: 500 },
            "FLAT50": { discount: 50, type: "fixed", minAmount: 200 },
            "WELCOME20": { discount: 20, type: "percentage", minAmount: 1000 },
          };

          if (mockCoupons[couponCode.toUpperCase()]) {
            resolve({
              success: true,
              data: mockCoupons[couponCode.toUpperCase()]
            });
          } else {
            resolve({
              success: false,
              message: "Invalid coupon code"
            });
          }
        }, 1000);
      });

      if (response.success) {
        const couponData = response.data;

        // Check minimum amount
        if (subtotalAmount < couponData.minAmount) {
          setCouponError(`Minimum order amount of ₹${couponData.minAmount} required`);
          setCouponLoading(false);
          return;
        }

        // Calculate discount
        let discountAmount = 0;
        if (couponData.type === "percentage") {
          discountAmount = (subtotalAmount * couponData.discount) / 100;
        } else {
          discountAmount = couponData.discount;
        }

        setDiscount(discountAmount);
        setTotalAmount(subtotalAmount - discountAmount);
        setAppliedCoupon({ code: couponCode.toUpperCase(), ...couponData });
        setCouponCode("");
        showToast(`Coupon ${couponCode.toUpperCase()} applied!`, "success");

      } else {
        showToast("Invalid coupon code", "error");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    }

    setCouponLoading(false);
  };

  // ✅ Remove coupon function
  const removeCoupon = () => {
    setDiscount(0);
    setTotalAmount(subtotalAmount);
    setAppliedCoupon(null);
    setCouponError("");
  };

  // ✅ Fetch order data from API if ID is provided, otherwise fetch cart
  useEffect(() => {
    // Don't fetch data if user is not authenticated
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setApiLoading(true);

        if (id) {
          // Fetch order by ID
          console.log("Fetching order with ID:", id);

          const response = await axios.post(`http://localhost:8001/api/getOrderById/${id}`, {}, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.data) {
            throw new Error("No data received from server");
          }

          // Handle both response structures
          let orderData = response.data;
          if (response.data && response.data.success && response.data.data) {
            orderData = response.data.data;
          }

          console.log("Order data received:", orderData);

          setOrder(orderData);

          // Check for items in different possible locations
          let items = [];
          if (orderData.items && Array.isArray(orderData.items)) {
            items = orderData.items;
          } else if (orderData.products && Array.isArray(orderData.products)) {
            items = orderData.products;
          } else if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
            items = orderData.orderItems;
          }

          if (items.length > 0) {
            setCartItems(items);
            const subtotal = items.reduce(
              (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
              0
            );
            setSubtotalAmount(subtotal);
            setTotalAmount(subtotal);
          } else {
            throw new Error("No items found in order data");
          }
        } else {
          // No order ID, fetch cart data
          await fetchCartData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load order details. Please try again.");
      } finally {
        setApiLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check authentication again before proceeding
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Your session has expired. Please login again.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    setError("");
    setLoading(true);

    const orderId = order?.orderId || "ORD" + Math.floor(Math.random() * 1000000);

    const proceedToThankYou = () => {
      // Save order to localStorage if needed
      localStorage.setItem("lastOrder", JSON.stringify({
        cart: cartItems,
        orderId,
        orderDetails: order,
        appliedCoupon,
        subtotal: subtotalAmount,
        discount,
        total: totalAmount
      }));

      // Navigate to ThankYouPage and pass cart & orderId via state
      navigate("/thankyou", {
        state: {
          cart: cartItems,
          orderId,
          orderDetails: order,
          appliedCoupon,
          subtotal: subtotalAmount,
          discount,
          total: totalAmount
        }
      });

      // Clear cart after order if it was from localStorage
      if (!order) {
        localStorage.removeItem("cart");
      }
    };

    if (formData.paymentMethod === "card") {
      if (
        !/^\d{16}$/.test(formData.cardNumber) ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry) ||
        !/^\d{3}$/.test(formData.cardCVC)
      ) {
        setError("Please enter valid card details.");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        setLoading(false);
        proceedToThankYou();
      }, 1000);
    } else if (formData.paymentMethod === "upi") {
      if (!/^[\w.-]+@[a-zA-Z]+$/.test(formData.upiId)) {
        setError("Please enter a valid UPI ID.");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        setLoading(false);
        proceedToThankYou();
      }, 500);
    } else if (formData.paymentMethod === "cod") {
      setTimeout(() => {
        setLoading(false);
        proceedToThankYou();
      }, 700);
    }
  };

  // Don't render the component if user is not authenticated
  if (!isAuthenticated) {
    return (
      <main className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-[var(--color-background)] relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-text)]">Redirecting to home page...</p>
        </div>
      </main>
    );
  }

  if (apiLoading) {
    return (
      <main className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-[var(--color-background)] relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-text)]">Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-[var(--color-background)] relative overflow-hidden min-h-screen">
      {/* Animated background elements - same as Collections.jsx */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--color-primary-light)]/30 to-[var(--color-primary-light)]/20"></div>

      {/* Multiple background circles - same as Collections.jsx */}
      <BackgroundCircle top={10} left={5} size="w-16 h-16" color="bg-[var(--color-primary)]/10" delay={0} duration={8} yMovement={15} />
      <BackgroundCircle top={80} left={90} size="w-20 h-20" color="bg-[var(--color-primary)]/10" delay={1} duration={7} yMovement={-12} />
      <BackgroundCircle top={30} left={85} size="w-42 h-12" color="bg-[var(--color-primary)]/10" delay={2} duration={9} yMovement={10} />
      <BackgroundCircle top={70} left={10} size="w-24 h-24" color="bg-[var(--color-primary)]/10" delay={0.5} duration={10} yMovement={-15} />
      <BackgroundCircle top={20} left={50} size="w-14 h-14" color="bg-[var(--color-primary)]/10" delay={1.5} duration={8} yMovement={8} />
      <BackgroundCircle top={60} left={70} size="w-18 h-18" color="bg-[var(--color-primary)]/10" delay={2.5} duration={7} yMovement={-10} />
      <BackgroundCircle top={40} left={30} size="w-10 h-10" color="bg-[var(--color-primary)]/10" delay={0.8} duration={9} yMovement={12} />
      <BackgroundCircle top={90} left={40} size="w-22 h-22" color="bg-[var(--color-primary)]/10" delay={1.2} duration={1} yMovement={-8} />
      <BackgroundCircle top={50} left={30} size="w-24 h-20" color="bg-[var(--color-primary)]/10" delay={1} duration={18} yMovement={-8} />
      <BackgroundCircle top={55} left={20} size="w-12 h-32" color="bg-[var(--color-primary)]/10" delay={1.2} duration={11} yMovement={-11} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header section with animation */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Zap size={16} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
            <span className="text-sm font-medium">Secure Checkout</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Complete Your <span className="text-[var(--color-primary)] relative">
              Purchase
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 20">
                <path
                  d="M 0 10 Q 50 15 100 10 T 200 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="opacity-30"
                />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-[var(--color-text-light)] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {order ? `Order #${order.orderId || id}` : "Securely complete your payment and have your order on its way"}
          </motion.p>
        </motion.div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-7xl mx-auto overflow-hidden border border-white/20">
          {/* Left summary panel */}
          <section className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-gradient-to-b from-[var(--color-primary-light)]/20 to-white">
            <div>
              <h2 className="text-2xl font-semibold mb-6 md:mb-8 text-[var(--color-text)] tracking-tight">Order Summary</h2>

              <ul className="space-y-4 md:space-y-6 flex-grow overflow-y-auto max-h-96 pr-2 mb-6">
                {cartItems.length > 0 ? (
                  cartItems.map(({ id, cartId, name, price, quantity, image }) => (
                    <motion.li
                      key={cartId || id}
                      className="flex items-center gap-4 p-3 md:p-4 border border-[var(--color-border)] rounded-lg bg-white/80 hover:shadow-md transition-all"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {image && <img src={image} alt={name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-[var(--color-border)]" />}
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-[var(--color-text)] text-sm md:text-base">{name}</h4>
                          <span className="font-bold text-[var(--color-text)] text-sm md:text-base">₹{(price * quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-[var(--color-text-light)] text-xs mt-1">Quantity: <span className="font-medium">x{quantity}</span></p>
                        <p className="text-[var(--color-text-light)] text-xs">Unit Price: ₹{price}</p>
                      </div>
                    </motion.li>
                  ))
                ) : (
                  <p className="text-[var(--color-text-light)] text-sm text-center w-full">Your cart is empty.</p>
                )}
              </ul>

              {/* Coupon Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-[var(--color-text)]">Have a Coupon?</h3>

                {appliedCoupon ? (
                  <motion.div
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-green-700 font-medium text-sm">
                        {appliedCoupon.code} applied
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] focus:outline-none text-sm"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      {couponLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Percent size={14} />
                          Apply
                        </>
                      )}
                    </button>
                  </div>
                )}

                {couponError && (
                  <motion.p
                    className="text-red-600 text-xs mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {couponError}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Billing Summary */}
            <div className="border-t border-[var(--color-border)] pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[var(--color-text-light)]">Subtotal:</p>
                  <p className="text-sm font-medium text-[var(--color-text)]">₹{subtotalAmount.toFixed(2)}</p>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-green-600">Discount:</p>
                    <p className="text-sm font-medium text-green-600">-₹{discount.toFixed(2)}</p>
                  </div>
                )}

                {formData.paymentMethod === "cod" && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[var(--color-text-light)]">COD Charges:</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">₹50.00</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-2">
                <p className="text-lg font-medium text-[var(--color-text)]">Total:</p>
                <p className="text-xl font-bold text-[var(--color-primary-dark)]">
                  ₹{(totalAmount + (formData.paymentMethod === "cod" ? 50 : 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {/* Right form panel */}
          <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col justify-between h-full">
              <div>
                {/* Shipping Details */}
                <h3 className="text-xl font-medium mb-6 text-[var(--color-text)] tracking-wide">Shipping Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  <UnderlineInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  <UnderlineInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                  <div className="col-span-1 sm:col-span-2">
                    <UnderlineInput label="Address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                  <UnderlineInput label="City" name="city" value={formData.city} onChange={handleChange} required />
                  <UnderlineInput label="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} required />
                  <UnderlineInput label="Country" name="country" value={formData.country} onChange={handleChange} required />
                </div>

                {/* Payment Method */}
                <h3 className="text-xl font-medium mb-5 text-[var(--color-text)] tracking-wide">Payment Method</h3>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-6">
                  {[
                    { key: "card", label: "Credit/Debit Card", icon: <FaCreditCard /> },
                    { key: "upi", label: "UPI", icon: <FaMobileAlt /> },
                    { key: "cod", label: "Cash on Delivery", icon: <FaMoneyBillWave /> },
                  ].map(({ key, label, icon }) => (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: key }))}
                      aria-pressed={formData.paymentMethod === key}
                      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-sm transition-all duration-300 ${formData.paymentMethod === key
                        ? "bg-[var(--color-primary)] text-white shadow-md border border-[var(--color-primary)]"
                        : "bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-primary-light)]"
                        } w-full sm:w-auto`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {icon}
                      {label}
                    </motion.button>
                  ))}
                </div>

                {/* Payment Fields */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={formData.paymentMethod}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    {formData.paymentMethod === "card" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="col-span-1 sm:col-span-2">
                          <UnderlineInput
                            label="Card Number"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            maxLength={16}
                            required
                          />
                        </div>
                        <UnderlineInput
                          label="Expiry (MM/YY)"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          maxLength={5}
                          required
                        />
                        <UnderlineInput
                          label="CVC"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleChange}
                          maxLength={3}
                          required
                        />
                      </div>
                    )}

                    {formData.paymentMethod === "upi" && (
                      <div>
                        <UnderlineInput
                          label="UPI ID"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleChange}
                          placeholder="e.g. yourname@upi"
                          required
                        />
                      </div>
                    )}

                    {formData.paymentMethod === "cod" && (
                      <div className="bg-[var(--color-primary-light)]/20 p-4 rounded-lg border border-[var(--color-primary)]/30">
                        <p className="text-sm text-[var(--color-text)]">
                          Pay with cash when your order is delivered. An extra ₹50 will be charged for cash handling.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${loading
                  ? "bg-[var(--color-primary)]/70 cursor-not-allowed"
                  : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg"
                  }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Payment
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </section>
        </div>
        {toastData && (
          <Toast
            message={toastData.message}
            type={toastData.type}
            duration={toastData.duration}
            onClose={() => setToastData(null)}
          />
        )}

      </div>
    </main>
  );

};

export default PaymentPage;