import React, { useState } from "react";
import { FaGooglePlusG } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Input from "../Input/Input";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const LoginSignup = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLogedin, setIsLogedin] = useState(false);

  // form states for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // form states for signup
  const [fullname, setFullname] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  // ✅ Google Auth redirect
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8001/api/google";
  };

  // ✅ Normal login

// Replace your login function with:
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    const res = await api.post("/login", { email, password });

    if (res.data.success) {
      setIsLogedin(true);
      
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      if (onClose) onClose();
    } else {
      setError(res.data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};



  // ✅ Signup function
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!fullname || !signupEmail || !phone || !signupPassword) {
      setError("All fields are required");
      return;
    }

    // Validate password strength (at least 6 characters)
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8001/api/saveUser",
        {
          fullname,
          email: signupEmail,
          phone: phone.replace(/\D/g, ""),
          password_hash: signupPassword,
        },
        { withCredentials: true }   // 👈 add this
      );




      console.log("Signup success:", response.data);

      if (response.data.success) {
        // Switch to login tab after successful signup
        setIsSignup(false);
        setError("Signup successful! Please login.");
      } else {
        setError(response.data.errors?.[0]?.msg || "Signup failed");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.message || "Something went wrong");
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
              className={`px-6 py-3 font-semibold transition-colors duration-300 ${!isSignup
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
              className={`px-6 py-3 font-semibold transition-colors duration-300 ${isSignup
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
          Sign In With Google
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
          {!isSignup ? (
            // Login Form
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              layout
              className="space-y-4"
            >
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
                ) : "LOGIN"}
              </button>

              <p className="text-xs text-[var(--color-text-muted)] mt-5 text-center">
                Having trouble logging in?{" "}
                <a
                  href="#"
                  className="text-[var(--color-primary)] font-medium underline hover:text-[var(--color-primary-dark)]"
                >
                  Get help
                </a>
              </p>
            </motion.form>
          ) : (
            // Signup Form
            <motion.form
              key="signup"
              onSubmit={handleSignup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              layout
              className="space-y-4"
            >
              <Input
                type="text"
                placeholder="Enter Full Name*"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />

              <Input
                type="email"
                placeholder="Enter Email Address*"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />

              <Input
                type="tel"
                placeholder="Enter Phone Number*"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />

              <Input
                type="password"
                placeholder="Enter Password (min. 6 characters)*"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              />

              {/* Error message */}
              {error && (
                <p className="text-[var(--color-accent-red)] text-sm p-2 bg-red-50 rounded-md text-center">
                  {error}
                </p>
              )}

              {/* Terms */}
              <p className="text-xs text-[var(--color-text-muted)]">
                By signing up, I agree to the{" "}
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

              {/* Signup Button */}
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
                    Signing up...
                  </span>
                ) : "SIGN UP"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginSignup;