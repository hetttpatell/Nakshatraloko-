import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaHeadset,
  FaFileInvoice,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaShippingFast,
  FaShieldAlt,
  FaStore,
  FaBoxOpen,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Percent,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

// Background circles component (same as PaymentForm.jsx)
const BackgroundCircle = ({
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
);

// Reusable component for order item
const OrderItem = React.memo(({ item }) => {
  const { name, price, quantity, image } = item;

  return (
    <motion.li
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 p-3 md:p-4 border border-[var(--color-border)] rounded-lg bg-white/80 hover:shadow-md transition-all"
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-[var(--color-border)]"
        />
      ) : (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 flex items-center justify-center rounded-lg border border-[var(--color-border)] text-gray-400 text-xs">
          No Image
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-[var(--color-text)] text-sm md:text-base">
            {name}
          </h4>
          <span className="font-bold text-[var(--color-text)] text-sm md:text-base">
            ₹{(price * quantity).toFixed(2)}
          </span>
        </div>
        <p className="text-[var(--color-text-light)] text-xs mt-1">
          Quantity: <span className="font-medium">x{quantity}</span>
        </p>
        <p className="text-[var(--color-text-light)] text-xs">
          Unit Price: ₹{price}
        </p>
      </div>
    </motion.li>
  );
});

// Social Icon Button
const SocialButton = ({ Icon, href }) => (
  <motion.a
    whileHover={{ scale: 1.2 }}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-md"
    href={href}
    aria-label={`Follow us on ${Icon.displayName || "social"}`}
  >
    <Icon />
  </motion.a>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex items-start gap-3 p-3 bg-white/80 rounded-lg border border-[var(--color-border)] shadow-sm"
    whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="p-2 bg-[var(--color-primary-light)] rounded-md text-[var(--color-primary)]">
      <Icon size={18} />
    </div>
    <div>
      <h4 className="font-semibold text-sm text-[var(--color-text)]">
        {title}
      </h4>
      <p className="text-xs text-[var(--color-text-light)] mt-1">
        {description}
      </p>
    </div>
  </motion.div>
);

const ThankYouPage = ({
  estimatedDelivery = "Will be delivered to you shortly",
}) => {
  const location = useLocation();
  const {
    orderId = "ORD123456",
    cart = [],
    subtotal = 0,
    discount = 0,
    total = 0,
    appliedCoupon = null,
  } = location.state || {};

  // Memoized total calculation for performance
  const calculatedTotal = useMemo(
    () =>
      total || cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart, total]
  );

  const calculatedSubtotal = useMemo(
    () =>
      subtotal ||
      cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart, subtotal]
  );

  // Order tracking steps
  const trackingSteps = [
    { id: 1, name: "Order Placed", status: "completed", time: "Just now" },
    { id: 2, name: "Processing", status: "current", time: "Soon" },
    { id: 3, name: "Shipped", status: "upcoming", time: "Tomorrow" },
    { id: 4, name: "Delivered", status: "upcoming", time: estimatedDelivery },
  ];

  return (
    <main className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-[var(--color-background)] relative overflow-hidden min-h-screen flex items-center justify-center p-4 sm:p-6">
      {/* Animated background elements - same as PaymentForm.jsx */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--color-primary-light)]/30 to-[var(--color-primary-light)]/20"></div>

      {/* Multiple background circles - same as PaymentForm.jsx */}
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
        size="w-42 h-12"
        color="bg-[var(--color-primary)]/10"
        delay={2}
        duration={9}
        yMovement={10}
      />
      <BackgroundCircle
        top={70}
        left={10}
        size="w-24 h-24"
        color="bg-[var(--color-primary)]/10"
        delay={0.5}
        duration={10}
        yMovement={-15}
      />
      <BackgroundCircle
        top={20}
        left={50}
        size="w-14 h-14"
        color="bg-[var(--color-primary)]/10"
        delay={1.5}
        duration={8}
        yMovement={8}
      />
      <BackgroundCircle
        top={60}
        left={70}
        size="w-18 h-18"
        color="bg-[var(--color-primary)]/10"
        delay={2.5}
        duration={7}
        yMovement={-10}
      />
      <BackgroundCircle
        top={40}
        left={30}
        size="w-10 h-10"
        color="bg-[var(--color-primary)]/10"
        delay={0.8}
        duration={9}
        yMovement={12}
      />
      <BackgroundCircle
        top={90}
        left={40}
        size="w-22 h-22"
        color="bg-[var(--color-primary)]/10"
        delay={1.2}
        duration={1}
        yMovement={-8}
      />
      <BackgroundCircle
        top={50}
        left={30}
        size="w-24 h-20"
        color="bg-[var(--color-primary)]/10"
        delay={1}
        duration={18}
        yMovement={-8}
      />
      <BackgroundCircle
        top={55}
        left={20}
        size="w-12 h-32"
        color="bg-[var(--color-primary)]/10"
        delay={1.2}
        duration={11}
        yMovement={-11}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden border border-white/20 relative z-10"
      >
        {/* Left Panel: Thank You + Order Summary */}
        <section className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center items-center relative bg-gradient-to-b from-[var(--color-primary-light)]/20 to-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-10 md:top-12"
          >
            <FaCheckCircle className="text-green-500 text-6xl sm:text-7xl mb-6" />
          </motion.div>

          <motion.div
            className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-5 mt-24"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Zap
              size={16}
              className="fill-[var(--color-primary)] text-[var(--color-primary)]"
            />
            <span className="text-sm font-medium">Order Confirmed</span>
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-3 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Thank You for Your{" "}
            <span className="text-[var(--color-primary)] relative">
              Purchase!
            </span>
          </motion.h1>

          <motion.p
            className="text-[var(--color-text-light)] mb-6 text-center max-w-xs sm:max-w-md"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We're excited to process your order. A confirmation email with
            details has been sent.
          </motion.p>

          {/* Order Details */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-md w-full border border-[var(--color-border)] overflow-y-auto max-h-[60vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              Order Confirmation
            </h2>
            <p className="text-[var(--color-text)] mb-2">
              <span className="font-medium">Order Number:</span> {orderId}
            </p>
            <p className="text-[var(--color-text)] mb-4">
              <span className="font-medium">Estimated Delivery:</span>{" "}
              {estimatedDelivery}
            </p>

            {/* Ordered Products */}
            <div className="border-t border-[var(--color-border)] pt-4">
              <h3 className="text-md font-semibold text-[var(--color-text)] mb-3">
                Ordered Products
              </h3>
              {cart.length > 0 ? (
                <ul className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto">
                  {cart.map((item) => (
                    <OrderItem key={item.id} item={item} />
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--color-text-light)] text-sm text-center w-full">
                  No products found.
                </p>
              )}

              {/* Order Summary */}
              <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[var(--color-text-light)]">
                      Subtotal:
                    </p>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      ₹{calculatedSubtotal.toFixed(2)}
                    </p>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-green-600">Discount:</p>
                      <p className="text-sm font-medium text-green-600">
                        -₹{discount.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <Check size={14} />
                      Coupon {appliedCoupon.code} applied
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-[var(--color-border)] pt-2">
                  <p className="text-lg font-medium text-[var(--color-text)]">
                    Total:
                  </p>
                  <p className="text-xl font-bold text-[var(--color-primary-dark)]">
                    ₹{calculatedTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right Panel: Enhanced with more content */}
        <aside className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between bg-white mt-6 md:mt-0">
          {/* Order Tracking */}
          {/* <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <FaShippingFast className="text-[var(--color-primary)]" />
              Order Tracking
            </h3>
            
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className={`flex flex-col items-center ${index < trackingSteps.length - 1 ? 'h-12' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : step.status === 'current'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.status === 'completed' ? <Check size={12} /> : index + 1}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`w-0.5 h-8 ${
                        step.status === 'completed' 
                          ? 'bg-green-500' 
                          : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      step.status === 'completed' 
                        ? 'text-green-700' 
                        : step.status === 'current'
                        ? 'text-[var(--color-primary)]'
                        : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-light)] mt-1">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}

          {/* Support & Invoice */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center p-4 rounded-lg bg-[var(--color-primary-light)]/10 hover:bg-[var(--color-primary-light)]/20 transition-colors cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <FaHeadset className="text-[var(--color-primary)] text-2xl mb-2" />
              <span className="text-sm font-medium text-[var(--color-text)]">
                Get Support
              </span>
              <p className="text-xs text-[var(--color-text-light)] mt-1 text-center">
                24/7 customer service
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-4 rounded-lg bg-[var(--color-primary-light)]/10 hover:bg-[var(--color-primary-light)]/20 transition-colors cursor-pointer"
              whileHover={{ y: -2 }}
            >
              <FaFileInvoice className="text-[var(--color-primary)] text-2xl mb-2" />
              <span className="text-sm font-medium text-[var(--color-text)]">
                Download Invoice
              </span>
              <p className="text-xs text-[var(--color-text-light)] mt-1 text-center">
                PDF receipt
              </p>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              What's Next?
            </h3>
            <div className="space-y-3">
              <FeatureCard
                icon={FaShieldAlt}
                title="Order Protection"
                description="Your purchase is protected by our satisfaction guarantee"
              />
              <FeatureCard
                icon={FaBoxOpen}
                title="Easy Returns"
                description="30-day return policy for unused items"
              />
              {/* <FeatureCard 
                icon={FaStore}
                title="Visit Our Store"
                description="Find a location near you for in-person shopping"
              /> */}
            </div>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            className="bg-gradient-to-r from-[var(--color-primary-light)]/10 via-white to-[var(--color-primary-light)]/10 rounded-xl p-6 shadow-inner mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-lg font-semibold text-[var(--color-text)] mb-3 text-center">
              Stay connected
            </p>
            <div className="flex justify-center gap-6 mb-4">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, idx) => (
                <SocialButton key={idx} Icon={Icon} href="#" />
              ))}
            </div>
            {/* <form className="flex w-full max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-[var(--color-border)] rounded-l-lg px-4 py-2 text-sm outline-none focus:border-[var(--color-primary)] bg-white/80"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-[var(--color-primary)] text-white px-4 rounded-r-lg text-sm hover:bg-[var(--color-primary-dark)] transition-all"
              >
                Subscribe
              </button>
            </form> */}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-md font-semibold text-[var(--color-text)] mb-2">
              Need Help?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-[var(--color-text-light)]">
              <div className="flex items-center justify-center gap-1">
                <Phone size={14} />
                <span>+91 9601394272</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Mail size={14} />
                <a
                  href="mailto:customercare@nakshatraloka.com"
                  className="text-[var(--color-primary)] hover:underline"
                >
                  customercare@nakshatraloka.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col items-center text-center mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link
              to="/"
              className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-md mb-4 inline-block w-full"
            >
              Continue Shopping
            </Link>
            <p className="text-xs text-[var(--color-text-light)]">
              Thank you for shopping with us. We appreciate your business!
            </p>
          </motion.div>
        </aside>
      </motion.div>
    </main>
  );
};

export default ThankYouPage;
