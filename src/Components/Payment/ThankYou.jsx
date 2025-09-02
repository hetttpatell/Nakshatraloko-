import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHeadset, FaFileInvoice, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

// Reusable component for order item
const OrderItem = React.memo(({ item }) => {
  const { name, price, quantity, image } = item;

  return (
    <motion.li
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 shadow-sm transition"
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 text-xs">
          No Image
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-800 text-sm md:text-base">{name}</h4>
          <span className="font-bold text-gray-900 text-sm md:text-base">
            ₹{(price * quantity).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Quantity: <span className="font-medium">x{quantity}</span>
        </p>
        <p className="text-gray-500 text-xs">Unit Price: ₹{price.toLocaleString()}</p>
      </div>
    </motion.li>
  );
});

// Social Icon Button
const SocialButton = ({ Icon, href }) => (
  <motion.a
    whileHover={{ scale: 1.2 }}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white transition-colors shadow-md"
    href={href}
    aria-label={`Follow us on ${Icon.displayName || "social"}`}
  >
    <Icon />
  </motion.a>
);

const ThankYouPage = ({ estimatedDelivery = "3-5 business days" }) => {
  const location = useLocation();
  const { orderId = "ORD123456", cart = [] } = location.state || {};

  // Memoized total calculation for performance
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <main className="bg-[var(--color-productbg)] w-screen min-h-screen flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Panel: Thank You + Order Summary */}
        <section className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-10"
          >
            <FaCheckCircle className="text-green-500 text-7xl mb-6" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3 mt-24 text-center">
            Thank You for Your Purchase!
          </h1>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            We’re excited to process your order. A confirmation email with details has been sent.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-md w-full border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Confirmation</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Order Number:</span> {orderId}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">Estimated Delivery:</span> {estimatedDelivery}
            </p>

            {/* Ordered Products */}
            <div className="border-t pt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Ordered Products</h3>
              {cart.length > 0 ? (
                <ul className="space-y-4">
                  {cart.map(item => (
                    <OrderItem key={item.id} item={item} />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm text-center w-full">No products found.</p>
              )}

              <div className="flex justify-between items-center border-t pt-4 mt-2">
                <p className="text-lg font-medium text-gray-700">Total:</p>
                <p className="text-xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Actions + Social + CTA */}
        <aside className="md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-white">
          {/* Support & Invoice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 flex-shrink-0">
            <div className="flex flex-col items-center">
              <FaHeadset className="text-gray-700 text-2xl mb-2" />
              <button className="text-sm font-medium text-gray-900 hover:underline">Get Support</button>
            </div>
            <div className="flex flex-col items-center">
              <FaFileInvoice className="text-gray-700 text-2xl mb-2" />
              <button className="text-sm font-medium text-gray-900 hover:underline">Download Invoice</button>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-xl p-6 shadow-inner mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-4 text-center">Stay connected & never miss updates</p>
            <div className="flex justify-center gap-6 mb-6">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, idx) => (
                <SocialButton key={idx} Icon={Icon} href="#" />
              ))}
            </div>
            <form className="flex w-full max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-gray-300 rounded-l-xl px-4 py-3 text-sm outline-none focus:border-gray-900"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-gray-900 text-white px-5 rounded-r-xl text-sm hover:bg-black transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center text-center">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors shadow-md mb-4 inline-block"
            >
              Continue Shopping
            </Link>
            <p className="text-sm text-gray-600">
              Need help? Contact us at{" "}
              <a href="mailto:support@yourbrand.com" className="text-gray-900 font-medium hover:underline">
                support@yourbrand.com
              </a>{" "}
              or call <span className="text-gray-900 font-medium">+1 234 567 890</span>
            </p>
          </div>
        </aside>
      </motion.div>
    </main>
  );
};

export default ThankYouPage;
