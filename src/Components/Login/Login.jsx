import React, { useState } from "react";
import { FaGooglePlusG } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Input from "../Input/Input";

// ✅ Import env variable (make sure your .env has VITE_API_URL=http://localhost:8001)
const API_URL = import.meta.env.VITE_API_URL;

const LoginSignup = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);

  // form states
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Google Auth redirect
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/google`;
  };

  // ✅ Normal login/signup
  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        // 🔹 Signup API
        const res = await axios.post(`${API_URL}/auth/signup`, {
          name: fullname,
          email,
          password,
        });
        console.log("✅ Signup success:", res.data);
        alert("Signup successful!");
      } else {
        // 🔹 Login API
        
        const res = await axios.post(`${API_URL}/api/login`, {
          email,
          password,
        });
        console.log("✅ Login success:", res.data);
        alert("Login successful!");

      }

      onClose(); // close modal after success
    } catch (err) {
      console.error("❌ Full error:", err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
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
          <div className="relative">
            <button
              onClick={() => setIsSignup(false)}
              className={`px-6 py-2 font-semibold transition-colors duration-300 ${!isSignup
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

          <div className="relative">
            <button
              onClick={() => setIsSignup(true)}
              className={`px-6 py-2 font-semibold transition-colors duration-300 ${isSignup
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

        {/* Google Button */}
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

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isSignup ? "signup" : "login"}
            onSubmit={handleContinue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout
          >
            {isSignup && (
              <Input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}

            <Input
              type="text"
              placeholder="Enter Mobile Number / Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <Input
              type="password"
              placeholder="Enter Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            {isSignup && (
              <Input
                type="password"
                placeholder="Confirm Password*"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
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
              type="submit"
              disabled={loading}
              className="w-full bg-[#0b1c47] text-white py-3 font-semibold rounded-lg hover:bg-[#1a2b65] transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "SIGN UP"
                  : "CONTINUE"}
            </button>

            {!isSignup && (
              <p className="text-xs text-gray-600 mt-5 text-center">
                Having trouble logging in?{" "}
                <a href="#" className="text-blue-600 font-medium">
                  Get help
                </a>
              </p>
            )}
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginSignup;
