import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Nakshatraloko. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-gray-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
