import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import Input from "../Input/Input";

// Simulated payment options
const PAYMENT_OPTIONS = [
  { key: "card", label: "Credit/Debit Card", icon: <FaCreditCard /> },
  { key: "upi", label: "UPI", icon: <FaMobileAlt /> },
  { key: "cod", label: "Cash on Delivery", icon: <FaMoneyBillWave /> },
];

// Main gateway
const PaymentPage = ({ total = 9999, onPay, currency = "INR" }) => {
  const [method, setMethod] = useState("upi"); // ✅ UPI default
  const [loading, setLoading] = useState(false);
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
      if (
        cardName.length < 2 ||
        !/^\d{16}$/.test(cardNumber) ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ||
        !/^\d{3}$/.test(cvv)
      ) {
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
        window.location.href = `upi://pay?pa=${upiId}&pn=YourStore&am=${total}&cu=${currency}`;
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
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="w-full py-6 px-6 border-b border-gray-200 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Choose Payment Method
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {PAYMENT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setMethod(option.key)}
              className={`px-6 py-2 rounded-md font-medium border text-sm transition duration-150 ${
                method === option.key
                  ? "bg-gray-800 text-white border-gray-800"
                  : "text-gray-800 border-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
              aria-pressed={method === option.key}
            >
              <span className="inline-flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Body (full screen content) */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={method}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white border border-gray-200 shadow-md rounded-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {method === "card" && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Card Details</h3>
                  <Input
                    type="text"
                    placeholder="Cardholder Name"
                    aria-label="Cardholder Name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full py-3 px-4 rounded-md border border-gray-300 text-black"
                  />
                  <Input
                    type="text"
                    placeholder="Card Number"
                    aria-label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={16}
                    required
                    className={`w-full py-3 px-4 rounded-md border ${
                      error ? "border-red-600" : "border-gray-300"
                    } text-black`}
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
                      className="w-full py-3 px-4 rounded-md border border-gray-300 text-black"
                    />
                    <Input
                      type="password"
                      placeholder="CVV"
                      aria-label="Card CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                      required
                      className="w-full py-3 px-4 rounded-md border border-gray-300 text-black"
                    />
                  </div>
                </>
              )}

              {method === "upi" && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">UPI Payment</h3>
                  <Input
                    type="text"
                    placeholder="Enter your UPI ID (e.g. username@upi)"
                    aria-label="UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className={`w-full py-3 px-4 rounded-md border ${
                      error ? "border-red-600" : "border-gray-300"
                    } text-black`}
                  />
                  <p className="text-sm text-gray-600">
                    You’ll be redirected to your UPI app to complete payment.
                  </p>
                </>
              )}

              {method === "cod" && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Cash on Delivery</h3>
                  <p className="text-gray-600 bg-gray-100 p-4 rounded-md border border-gray-300">
                    You can pay with cash when your order is delivered 🚚
                  </p>
                </>
              )}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex items-center text-gray-600 text-sm mt-4">
                <FaLock className="mr-2 text-green-600" />
                256-bit SSL Encrypted · Your payment is secure
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className={`w-full border border-gray-800 px-8 py-3 font-semibold text-sm text-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition mt-6 ${
                  loading ? "opacity-60 cursor-wait" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : method === "cod" ? "Confirm Order" : `Pay ${currency} ${total}`}
              </motion.button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentPage;
