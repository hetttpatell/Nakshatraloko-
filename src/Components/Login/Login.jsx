import React, { useState } from "react";
import { FaGooglePlusG } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Input from "../Input/Input";

const API_URL = import.meta.env.VITE_API_URL;

const LoginSignup = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLogedin, setIsLogedin] = useState(false);


  // form states
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  // ✅ Google Auth redirect
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8001/api/google";
  };

  // ✅ Normal login/signup
// ✅ Normal login/signup
const handleContinue = async (e) => {
  e.preventDefault(); // prevent page reload
  setError("");
  setLoading(true);

  try {
    if (isSignup) {
      // Validation
      if (!fullname || !email || !password || !confirmPassword) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      // Call Signup API
      const res = await axios.post("http://localhost:8001/api/signup", {
        fullname,
        email,
        password,
      });

      if (res.data.success) {
        alert("Signup successful! Please log in.");
        setIsSignup(false); // Switch to login tab
      } else {
        setError(res.data.message || "Signup failed. Try again.");
      }
    } else {
      // Login flow
      if (!email || !password) {
        setError("Email and password are required.");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:8001/api/login", {
        email,
        password,
      });

      if (res.data.success) {
        // console.log("Helo");
       setIsLogedin(true); // ✅ update login state
        localStorage.setItem("token", res.data.token); // save token if API gives one
        onClose(); // close modal
      } else {
        setError(res.data.message || "Invalid credentials.");
      }
    }
  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong.");
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
        className="relative bg-[var(--color-surface)] w-[95%] max-w-md p-8 rounded-2xl shadow-xl z-10 border border-[var(--color-border)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
          text-[var(--color-text-muted)] font-bold text-lg
          rounded-full hover:bg-[var(--color-primary)] hover:text-white
          transition-all duration-300 ease-in-out
          shadow-sm hover:shadow-md"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-[var(--color-border)] relative">
          <div className="relative">
            <button
              onClick={() => setIsSignup(false)}
              className={`px-6 py-3 font-semibold transition-colors duration-300 ${
                !isSignup
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              }`}
            >
              Login
            </button>
            {!isSignup && (
              <motion.span
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSignup(true)}
              className={`px-6 py-3 font-semibold transition-colors duration-300 ${
                isSignup
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              }`}
            >
              Signup
            </button>
            {isSignup && (
              <motion.span
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-[var(--color-accent-red)] text-[var(--color-accent-red)] font-medium py-3 mb-5 rounded-lg hover:bg-[var(--color-accent-red)] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <FaGooglePlusG className="mr-2 text-lg" />
          {isSignup ? "Sign Up With Google" : "Sign In With Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-[var(--color-border)]"></div>
          <span className="px-3 text-[var(--color-text-muted)] text-sm">
            Or continue with email
          </span>
          <div className="flex-1 h-px bg-[var(--color-border)]"></div>
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
            className="space-y-4"
          >
            {isSignup && (
              <Input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
            )}

            <Input
              type="text"
              placeholder="Enter Mobile Number / Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />

            <Input
              type="password"
              placeholder="Enter Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />

            {isSignup && (
              <Input
                type="password"
                placeholder="Password*"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />
            )}

            {/* Error message */}
            {error && (
              <p className="text-[var(--color-accent-red)] text-sm p-2 bg-red-50 rounded-md text-center">
                {error}
              </p>
            )}

            {/* Terms */}
            <p className="text-xs text-[var(--color-text-muted)]">
              By Continuing, I agree to the{" "}
              <a
                href="#"
                className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
              >
                Terms of Use
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
              >
                Privacy Policy
              </a>
            </p>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-3 font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Please wait...
                </span>
              ) : isSignup
              ? "SIGN UP"
              : "CONTINUE"}
            </button>

            {!isSignup && (
              <p className="text-xs text-[var(--color-text-muted)] mt-5 text-center">
                Having trouble logging in?{" "}
                <a
                  href="#"
                  className="text-[var(--color-primary)] font-medium underline hover:text-[var(--color-primary-dark)]"
                >
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
