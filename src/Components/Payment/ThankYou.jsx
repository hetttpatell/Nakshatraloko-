import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaHeadset,
  FaFileInvoice,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext"; // ✅ use custom hook

const ThankYouPage = ({ orderId = "ORD123456", estimatedDelivery = "3-5 business days" }) => {
  const { cart, clearCart } = useCart();

  // Optional: clear cart after showing order confirmation
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="bg-[var(--color-productbg)] h-screen w-screen flex justify-center items-center overflow-hidden">
      <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-10 text-center overflow-y-auto">
        {/* ... */}
        <div className="border-t pt-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Ordered Products
          </h3>
          {cart.length > 0 ? (
            <ul className="space-y-3">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.size && (
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    )}
                    {item.material && (
                      <p className="text-sm text-gray-500">Material: {item.material}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No products found.</p>
          )}
        </div>
        {/* ... */}
      </motion.div>
    </main>
  );
};

export default ThankYouPage;
