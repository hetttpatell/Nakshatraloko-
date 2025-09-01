import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import Input from "../Input/Input";
// Simulated payment options
const PAYMENT_OPTIONS = [
  { key: "card", label: "Credit/Debit Card", icon: <FaCreditCard /> },
  { key: "upi", label: "UPI", icon: <FaMobileAlt /> },
  { key: "cash", label: "Cash on Delivery", icon: <FaMoneyBillWave /> },
];

// Icon style for payment methods
const MethodIcon = ({ icon }) =>
  <span className="mr-2 text-xl text-blue-700">{icon}</span>;

// UI validation helpers
const validateCard = (n, exp, cvv) => (
  /^\d{16}$/.test(n) &&
  /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp) &&
  /^\d{3}$/.test(cvv)
);
const validateUpi = (upi) => /^[\w.-]+@[a-zA-Z]+$/.test(upi);

// Main gateway
const PaymentPage  = ({ total = 9999, onPay, currency = "INR" }) => {
  const [method, setMethod] = useState(PAYMENT_OPTIONS.key);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  // Card Inputs
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  // UPI
  const [upiId, setUpiId] = useState("");



  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (method === "card") {
      // Validation
      if (cardName.length < 2 || !/^\d{16}$/.test(cardNumber) || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) || !/^\d{3}$/.test(cvv)) {
        setError("कृपया सही कार्ड विवरण दर्ज करें | Please enter valid card details.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onPay?.({ method, cardName, cardNumber, expiry, cvv });
      }, 1000);
    }

    if (method === "upi") {
      if (!/^[\w.-]+@[a-zA-Z]+$/.test(upiId)) {
        setError("कृपया सही UPI ID दर्ज करें | Please enter a valid UPI ID.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        window.location.href = `upi://pay?pa=${upiId}&pn=YourStore&am=100&cu=INR`;
      }, 500);
    }

    if (method === "cod") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onPay?.({ method: "cod" });
      }, 700);
    }
  };

  return (
    <div
      className="h-screen w-screen flex flex-col"
      style={{ backgroundColor: "var(--color-productbg)" }}
    >
      <div className="w-full py-6 px-6 border-b border-[#ddd] bg-white shadow-sm">
        <h2 className="text-xl font-bold text-[#222] text-center mb-4">
          Choose Payment Method
        </h2>
        <div className="flex justify-center gap-4">
          {["card", "upi", "cod"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMethod(option)}
              className={`px-6 py-2 rounded-md font-medium capitalize border border-[#222] text-sm transition duration-150 ${
                method === option
                  ? "bg-[#222] text-white"
                  : "text-[#222] hover:bg-[#222] hover:text-white"
              }`}
              aria-pressed={method === option}
            >
              {option === "card" && "Card"}
              {option === "upi" && "UPI"}
              {option === "cod" && "Cash on Delivery"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={method}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg bg-white border border-[#ddd] shadow-md rounded-xl p-8 mx-4"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {method === "card" && (
                <>
                  <h3 className="text-lg font-semibold text-[#222] mb-2">
                    Card Details
                  </h3>
                  <Input
                    type="text"
                    placeholder="Cardholder Name"
                    aria-label="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full py-3 px-4 rounded-md border border-[#ddd] text-black"
                  />
                  <Input
                    type="text"
                    placeholder="Card Number"
                    aria-label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={16}
                    required
                    className={`w-full py-3 px-4 rounded-md border ${error ? "border-red-600" : "border-[#ddd]"} text-black`}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      aria-label="Card Expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                      required
                      className="w-full py-3 px-4 rounded-md border border-[#ddd] text-black"
                    />
                    <Input
                      type="password"
                      placeholder="CVV"
                      aria-label="Card CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                      required
                      className="w-full py-3 px-4 rounded-md border border-[#ddd] text-black"
                    />
                  </div>
                </>
              )}
              {method === "upi" && (
                <>
                  <h3 className="text-lg font-semibold text-[#222] mb-2">
                    UPI Payment
                  </h3>
                  <Input
                    type="text"
                    placeholder="Enter your UPI ID (e.g. username@upi)"
                    aria-label="UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className={`w-full py-3 px-4 rounded-md border ${error ? "border-red-600" : "border-[#ddd]"} text-black`}
                  />
                  <p className="text-sm text-gray-600">
                    You’ll be redirected to your UPI app to complete payment.
                  </p>
                </>
              )}
              {method === "cod" && (
                <>
                  <h3 className="text-lg font-semibold text-[#222] mb-2">
                    Cash on Delivery
                  </h3>
                  <p className="text-gray-600 bg-gray-100 p-4 rounded-md border border-[#ddd]">
                    You can pay with cash when your order is delivered 🚚
                  </p>
                </>
              )}

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex items-center text-gray-600 text-sm mt-4">
                <FaLock className="mr-2 text-green-600" />
                256-bit SSL Encrypted · Your payment is secure
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className={`w-full border border-[#222] px-8 py-2 font-semibold text-sm text-[#222] rounded-md hover:bg-[#222] hover:text-white transition mt-6 ${loading ? "opacity-60 cursor-wait" : ""}`}
                disabled={loading}
              >
                {loading ? "Processing..." : method === "cod" ? "Confirm Order" : "Pay Now"}
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentPage;