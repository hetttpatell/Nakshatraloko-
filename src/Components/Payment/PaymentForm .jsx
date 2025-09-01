import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "../Input/Input"; // ✅ use your existing Input component
import { FaLock } from "react-icons/fa";

const PaymentForm = ({ onPay }) => {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Processing payment...");
    onPay?.({ cardName, cardNumber, expiry, cvv });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-[#fffaf6] w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg"
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-[var(--color-navy)] mb-6">
        Secure Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Holder Name */}
        <Input
          type="text"
          placeholder="Cardholder Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
          className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
        />

        {/* Card Number */}
        <Input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          maxLength={16}
          required
          className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
        />

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            maxLength={5}
            required
            className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
          />

          <Input
            type="password"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            maxLength={3}
            required
            className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
          />
        </div>

        {/* Secure Note */}
        <div className="flex items-center text-gray-500 text-sm mt-2">
          <FaLock className="mr-2 text-green-600" />
          Your payment is encrypted & secure
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          className="w-full bg-[#0b1c47] text-white py-3 mt-6 font-semibold rounded-lg hover:bg-[#1a2b65] transition-all"
        >
          Pay Now
        </button>
      </form>
    </motion.div>
  );
};

export default PaymentForm;
