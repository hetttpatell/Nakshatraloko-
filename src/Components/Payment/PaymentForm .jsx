import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";

const mockCart = [
  { id: 1, name: "Product 1", price: 500, quantity: 2 },
  { id: 2, name: "Product 2", price: 300, quantity: 1 },
];

const PAYMENT_OPTIONS = [
  { key: "card", label: "Credit/Debit Card", icon: <FaCreditCard /> },
  { key: "upi", label: "UPI", icon: <FaMobileAlt /> },
  { key: "cod", label: "Cash on Delivery", icon: <FaMoneyBillWave /> },
];

const UnderlineInput = ({ label, name, type = "text", value, onChange, required, maxLength }) => (
  <div className="flex flex-col w-full" style={{ minWidth: 0 }}>
    <label htmlFor={name} className="mb-1 text-xs font-semibold text-gray-600 tracking-wide">
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
      className="border-b border-gray-300 focus:border-gray-900 outline-none py-2 text-gray-900 placeholder-gray-400 text-sm"
      placeholder={label}
      autoComplete="off"
    />
  </div>
);

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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

  useEffect(() => {
    setCartItems(mockCart);
    const total = mockCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        alert("Card payment successful!");
        setLoading(false);
      }, 1000);
    }

    if (formData.paymentMethod === "upi") {
      if (!/^[\w.-]+@[a-zA-Z]+$/.test(formData.upiId)) {
        setError("Please enter a valid UPI ID.");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        alert(`Redirecting to UPI app for ${formData.upiId}`);
        setLoading(false);
      }, 500);
    }

    if (formData.paymentMethod === "cod") {
      setTimeout(() => {
        alert("Order confirmed with Cash on Delivery!");
        setLoading(false);
      }, 700);
    }
  };

  return (
    <main
      className="bg-[var(--color-productbg)] flex justify-center items-center p-8"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-7xl max-h-full" style={{ minHeight: "80vh" }}>
        {/* Left summary panel */}
        <section
          className="w-1/3 p-8 flex flex-col justify-between border-r border-gray-200 overflow-y-auto"
          style={{ minWidth: 320, maxHeight: "80vh" }}
        >
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 tracking-tight">Order Summary</h2>
          <ul className="divide-y divide-gray-200 flex-grow overflow-y-auto space-y-4 mb-6" style={{ maxHeight: "calc(80vh - 160px)" }}>
            {cartItems.map(({ id, name, price, quantity }) => (
              <li key={id} className="flex justify-between text-gray-700 font-medium text-sm">
                <span>
                  {name} <span className="text-gray-400 font-normal">x{quantity}</span>
                </span>
                <span>${price * quantity}</span>
              </li>
            ))}
          </ul>
          <p className="text-right text-lg font-semibold text-gray-900">Total: ${totalAmount}</p>
        </section>

        {/* Right form panel */}
        <section className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col justify-between h-full">
            <div>
              {/* Shipping Details */}
              <h3 className="text-xl font-medium mb-6 text-gray-800 tracking-wide">Shipping Details</h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <UnderlineInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <UnderlineInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="col-span-2">
                  <UnderlineInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <UnderlineInput label="City" name="city" value={formData.city} onChange={handleChange} required />
                <UnderlineInput label="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} required />
                <UnderlineInput label="Country" name="country" value={formData.country} onChange={handleChange} required />
              </div>

              {/* Payment Method Selection */}
              <h3 className="text-xl font-medium mb-5 text-gray-800 tracking-wide">Payment Method</h3>
              <div className="flex gap-6 mb-8">
                {PAYMENT_OPTIONS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: key }))}
                    aria-pressed={formData.paymentMethod === key}
                    className={`flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-sm transition-colors duration-200 ${
                      formData.paymentMethod === key
                        ? "bg-gray-900 text-white shadow-md border border-gray-900"
                        : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={formData.paymentMethod}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6 max-w-xl"
                >
                  {formData.paymentMethod === "card" && (
                    <>
                      <UnderlineInput
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        maxLength={16}
                        required
                        autoComplete="cc-number"
                      />
                      <div className="flex gap-6">
                        <UnderlineInput
                          label="Expiry (MM/YY)"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          maxLength={5}
                          required
                          autoComplete="cc-exp"
                        />
                        <UnderlineInput
                          label="CVC"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={handleChange}
                          maxLength={3}
                          required
                          autoComplete="cc-csc"
                        />
                      </div>
                    </>
                  )}
                  {formData.paymentMethod === "upi" && (
                    <>
                      <UnderlineInput
                        label="UPI ID (e.g. username@upi)"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-xs text-center text-gray-500">
                        You’ll be redirected to your UPI app to complete payment.
                      </p>
                    </>
                  )}
                  {formData.paymentMethod === "cod" && (
                    <p className="text-center text-gray-700 bg-gray-100 rounded-md p-4 border border-gray-300">
                      You can pay with cash when your order is delivered 🚚
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error & Submit */}
            <div className="mt-6">
              {error && <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg py-3 font-semibold text-white text-sm transition-colors duration-300 ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
                }`}
                aria-busy={loading}
              >
                {loading
                  ? "Processing..."
                  : formData.paymentMethod === "cod"
                  ? "Confirm Order"
                  : `Pay $${totalAmount}`}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default PaymentPage;

