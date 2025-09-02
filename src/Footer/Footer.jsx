// Footer.jsx
import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

 import logo from "/Logo.png"

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const navigationLinks = ["Home", "Shop", "Zodiac Signs", "Blog", "About Us", "Contact Us", "FAQ"];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#0D0D1A] to-[#1A1A2E] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo & Branding */}
    <div className="space-y-4">
<img src={logo} alt="Zodiac Store Logo" className="w-36 sm:w-44" />
  <p className="text-gray-400">Discover the stones aligned with your stars.</p>
  <div className="flex space-x-4 mt-4">
    {[FaInstagram, FaFacebookF, FaTwitter, FaPinterestP].map((Icon, idx) => (
      <a
        key={idx}
        href="#"
        className="p-2 bg-gray-800 rounded-full hover:bg-[#FF6B6B] hover:text-white transform hover:scale-110 transition-all"
      >
        <Icon size={18} />
      </a>
    ))}
  </div>
</div>


        {/* Navigation Links */}
        <div>
          <h2 className="text-white font-semibold mb-4 text-lg">Navigation</h2>
          <ul className="space-y-2">
            {navigationLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-[#FF6B6B] transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Zodiac Quick Links */}
        <div>
          <h2 className="text-white font-semibold mb-4 text-lg">Zodiac Signs</h2>
          <ul className="grid grid-cols-2 gap-2">
            {zodiacSigns.map((sign) => (
              <li key={sign}>
                <a
                  href="#"
                  className="hover:text-[#FF6B6B] transition-colors duration-300"
                >
                  {sign}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h2 className="text-white font-semibold mb-4 text-lg">Newsletter</h2>
          <p className="text-gray-400 mb-4">Get cosmic updates and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-gray-900"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FF4757] text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
            >
              Subscribe
            </button>
          </form>
          <div className="flex items-center space-x-4 mt-6">
            {[FaCcVisa, FaCcMastercard, FaCcPaypal].map((Icon, idx) => (
              <Icon key={idx} size={36} className="hover:text-[#FF6B6B] transition-colors" />
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-2">Secure payments guaranteed</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Zodiac Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
