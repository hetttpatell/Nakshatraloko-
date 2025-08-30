import React, { useState } from "react";
import Input from "../Input/Input";

const SignupForm = ({ onClose }) => {
  const [fullName, setFullName] = useState("");
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log({ fullName, emailOrNumber, password, confirmPassword });
    onClose(); // close modal after signup
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#fffaf6] w-[95%] max-w-md p-8 rounded-2xl shadow-lg z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 w-10 h-10 flex items-center justify-center
            text-[#5a4d41] font-bold text-lg
            rounded-full hover:bg-[#0b1c47] hover:text-[#f0e6da]
            transition-all duration-300 ease-in-out
            shadow-sm hover:shadow-md
            transform hover:scale-105
          "
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Signup
        </h2>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            type="text"
            label="Email or Mobile Number"
            placeholder="Enter your email or mobile number"
            value={emailOrNumber}
            onChange={(e) => setEmailOrNumber(e.target.value)}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#0b1c47] text-white py-3 font-semibold rounded-lg hover:bg-[#1a2b65] transition"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-5 text-center">
          By signing up, you agree to our{" "}
          <a href="#" className="text-blue-600 underline">
            Terms of Use
          </a>{" "}
          &{" "}
          <a href="#" className="text-blue-600 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
