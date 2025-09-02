// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

import logo from "/Logo.png";
import upiLogo from "/UPI.png";
import gpayLogo from "/google-pay-icon.png";
import netbankingLogo from "/net-banking-icon.png";

// Navigation and Categories
export const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Gemstone", to: "/gemstones" },
  { label: "FAQs", to: "/faqs" },
  { label: "Blogs", to: "/blogs" },
  { label: "Expert Guidance", to: "/expertcall" },
];

export const categoriesLinks = [
  { label: "Pendant", to: "/categories/pendant" },
  { label: "Necklace", to: "/categories/necklace" },
  { label: "Jewellery", to: "/categories/jewellery" },
  { label: "Rudraksh", to: "/categories/rudraksh" },
  { label: "Gemstone", to: "/gemstones" },
];

export const zodiacTopics = [
  "Love & Relationships",
  "Career & Finance",
  "Health & Wellness",
  "Lucky Stones",
  "Birthstone Guide",
  "Astrology Insights",
  "Monthly Horoscopes",
  "Energy Cleansing Tips",
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Logo & About */}
        <div className="md:col-span-4 flex flex-col space-y-4">
          <img src={logo} alt="Zodiac Store Logo" className="w-36 sm:w-44" />
          <p className="text-gray-400 leading-relaxed">
            Discover the stones aligned with your stars. Handpicked for your zodiac to bring balance and harmony.
          </p>
          <div className="flex space-x-3 mt-4">
            {[FaInstagram, FaFacebookF, FaTwitter, FaPinterestP].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-red-600 hover:text-white transform hover:scale-110 transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation   */}
        <div className="md:col-span-2">
          <h2 className="text-white font-semibold mb-4 text-lg">Navigation</h2>
          <ul className="space-y-2">
            {navigationLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="hover:text-red-500 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="md:col-span-3">
          <h2 className="text-white font-semibold mb-4 text-lg">Categories</h2>
          <ul className="space-y-2">
            {categoriesLinks.map((cat) => (
              <li key={cat.label}>
                <Link
                  to={cat.to}
                  className="hover:text-red-500 transition-colors duration-300"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Zodiac Topics */}
        <div className="md:col-span-3">
          <h2 className="text-white font-semibold mb-4 text-lg">Zodiac Topics</h2>
          <ul className="space-y-2">
            {zodiacTopics.map((topic) => (
              <li key={topic} className="text-gray-400 text-sm">
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex flex-wrap justify-center items-center space-x-6 mt-6">
        <FaCcVisa size={36} className="hover:text-red-500 transition-colors" />
        <FaCcMastercard size={36} className="hover:text-red-500 transition-colors" />
        <FaCcPaypal size={36} className="hover:text-red-500 transition-colors" />
        <img src={upiLogo} alt="UPI" className="h-9 w-auto hover:opacity-80 transition-opacity" />
        <img src={gpayLogo} alt="GPay" className="h-9 w-auto hover:opacity-80 transition-opacity" />
        <img src={netbankingLogo} alt="Netbanking" className="h-9 w-auto hover:opacity-80 transition-opacity" />
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Zodiac Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
