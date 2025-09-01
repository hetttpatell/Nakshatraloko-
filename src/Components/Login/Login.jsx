import React, { useState } from "react";
import { FaFacebookF, FaGooglePlusG } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../Input/Input";

const LoginSignup = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);

  const handleFacebookLogin = () => console.log("Facebook login clicked");
  const handleGoogleLogin = () => console.log("Google login clicked");
  const handleContinue = (e) => {
    e.preventDefault();
    console.log(isSignup ? "Signup form submitted" : "Login form submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-[#fffaf6] w-[95%] max-w-md p-8 rounded-2xl shadow-lg z-10"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center
          text-[#5a4d41] font-bold text-lg
          rounded-full hover:bg-[#0b1c47] hover:text-[#f0e6da]
          transition-all duration-300 ease-in-out
          shadow-sm hover:shadow-md transform hover:scale-105"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-gray-300 relative">
          {/* Login */}
          <div className="relative">
            <button
              onClick={() => setIsSignup(false)}
              className={`px-6 py-2 font-semibold transition-colors duration-300 ${
                !isSignup
                  ? "text-[var(--color-navy)]"
                  : "text-gray-500 hover:text-[var(--color-navy)]"
              }`}
            >
              Login
            </button>
            {!isSignup && (
              <motion.span
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-navy)] rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>

          {/* Signup */}
          <div className="relative">
            <button
              onClick={() => setIsSignup(true)}
              className={`px-6 py-2 font-semibold transition-colors duration-300 ${
                isSignup
                  ? "text-[var(--color-navy)]"
                  : "text-gray-500 hover:text-[var(--color-navy)]"
              }`}
            >
              Signup
            </button>
            {isSignup && (
              <motion.span
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-navy)] rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </div>

        {/* Social Buttons */}
        <button
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center border border-[#3b5998] text-[#3b5998] font-medium py-3 mb-4 rounded-lg hover:bg-[#3b5998] hover:text-white transition"
        >
          <FaFacebookF className="mr-2" />
          {isSignup ? "Sign Up With Facebook" : "Sign In With Facebook"}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-red-500 text-red-500 font-medium py-3 mb-4 rounded-lg hover:bg-red-500 hover:text-white transition"
        >
          <FaGooglePlusG className="mr-2 text-lg" />
          {isSignup ? "Sign Up With Google" : "Sign In With Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">Or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Animated Form */}
       <AnimatePresence mode="wait">
  <motion.div
    key={isSignup ? "signup" : "login"}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    layout   // ✅ makes parent smoothly adjust height
  >
    {isSignup && (
      <Input
        type="text"
        placeholder="Full Name"
        className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    )}

    <Input
      type="text"
      placeholder="Enter Mobile Number / Email*"
      className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
    />

    <Input
      type="password"
      placeholder="Enter Password*"
      className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
    />

    {isSignup && (
      <Input
        type="password"
        placeholder="Confirm Password*"
        className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    )}

    {/* Terms */}
    <p className="text-xs text-gray-600 mb-4">
      By Continuing, I agree to the{" "}
      <a href="#" className="text-blue-600 underline">
        Terms of Use
      </a>{" "}
      &{" "}
      <a href="#" className="text-blue-600 underline">
        Privacy Policy
      </a>
    </p>

    {/* Continue Button */}
    <button
      onClick={handleContinue}
      className="w-full bg-[#0b1c47] text-white py-3 font-semibold rounded-lg hover:bg-[#1a2b65] transition"
    >
      {isSignup ? "SIGN UP" : "CONTINUE"}
    </button>

    {/* Help link */}
    {!isSignup && (
      <p className="text-xs text-gray-600 mt-5 text-center">
        Having trouble logging in?{" "}
        <a href="#" className="text-blue-600 font-medium">
          Get help
        </a>
      </p>
    )}
  </motion.div>
</AnimatePresence>

      </motion.div>
    </div>
  );
};

export default LoginSignup;