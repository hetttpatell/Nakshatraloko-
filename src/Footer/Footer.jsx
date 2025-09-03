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

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Gemstone", to: "/gemstones" },
  { label: "FAQs", to: "/faqs" },
  { label: "Blogs", to: "/blogs" },
  { label: "Expert Guidance", to: "/expertcall" },
];

const categoriesLinks = [
  { label: "Pendant", to: "/categories/pendant" },
  { label: "Necklace", to: "/categories/necklace" },
  { label: "Jewellery", to: "/categories/jewellery" },
  { label: "Rudraksh", to: "/categories/rudraksh" },
  { label: "Gemstone", to: "/gemstones" },
];

const zodiacTopics = [
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
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-between gap-10">

        {/* Logo & About */}
        <div className="flex flex-col space-y-4 md:w-1/4 text-center md:text-left">
          <img src={logo} alt="Zodiac Store Logo" className="w-32 sm:w-40 md:w-44 mx-auto md:mx-0" />
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Discover the stones aligned with your stars. Handpicked for your zodiac to bring balance and harmony.
          </p>
          <div className="flex justify-center md:justify-start space-x-3 mt-2">
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

        {/* Navigation */}
        <div className="flex flex-col md:w-1/6 text-center md:text-left">
          <h3 className="text-white font-semibold mb-4 text-lg">Navigation</h3>
          <ul className="space-y-2">
            {navigationLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="hover:text-red-500 transition-colors text-sm sm:text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col md:w-1/5 text-center md:text-left">
          <h3 className="text-white font-semibold mb-4 text-lg">Categories</h3>
          <ul className="space-y-2">
            {categoriesLinks.map((cat) => (
              <li key={cat.label}>
                <Link
                  to={cat.to}
                  className="hover:text-red-500 transition-colors text-sm sm:text-base"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Zodiac Topics */}
        <div className="flex flex-col md:w-1/3 text-center md:text-left">
            <h3 className="text-white font-bold  mb-4  text-lg">Zodiac Topics</h3>
          <ul className="space-y-1 text-gray-400 text-sm sm:text-base">
            {zodiacTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 px-6 mt-6">
        <FaCcVisa size={28} className="hover:text-red-500 transition-colors" />
        <FaCcMastercard size={28} className="hover:text-red-500 transition-colors" />
        <FaCcPaypal size={28} className="hover:text-red-500 transition-colors" />
        <img src={upiLogo} alt="UPI" className="h-8 sm:h-9 w-auto hover:opacity-80 transition-opacity" />
        <img src={gpayLogo} alt="GPay" className="h-8 sm:h-9 w-auto hover:opacity-80 transition-opacity" />
        <img src={netbankingLogo} alt="Netbanking" className="h-8 sm:h-9 w-auto hover:opacity-80 transition-opacity" />
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-gray-500 text-xs sm:text-sm px-6">
        © {new Date().getFullYear()} Zodiac Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
