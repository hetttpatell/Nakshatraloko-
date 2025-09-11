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
    <footer className="bg-color-text text-color-surface border-t border-color-border">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Logo & About */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <img 
            src={logo} 
            alt="Zodiac Store Logo" 
            className="w-40 md:w-44 mx-auto md:mx-0" 
          />
          <p className="text-color-primary-light text-sm leading-relaxed max-w-md">
            Discover the stones aligned with your stars. Handpicked for your zodiac to bring balance and harmony.
          </p>
          <div className="flex space-x-3 mt-2">
            {[FaInstagram, FaFacebookF, FaTwitter, FaPinterestP].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-3 bg-color-primary-dark rounded-full hover:bg-color-primary transition-all duration-300 transform hover:scale-105"
              >
                <Icon size={18} className="text-color-surface" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col">
          <h3 className="text-color-primary font-semibold mb-4 text-lg border-b border-color-primary pb-2">Navigation</h3>
          <ul className="space-y-3">
            {navigationLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text[-var( --color-primary-light)] hover:text-color-primary transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-color-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col">
          <h3 className="text-color-primary font-semibold mb-4 text-lg border-b border-color-primary pb-2">Categories</h3>
          <ul className="space-y-3">
            {categoriesLinks.map((cat) => (
              <li key={cat.label}>
                <Link
                  to={cat.to}
                  className="text-color-primary-light hover:text-color-primary transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-color-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Zodiac Topics */}
        <div className="flex flex-col">
          <h3 className="text-color-primary font-semibold mb-4 text-lg border-b border-color-primary pb-2">Zodiac Topics</h3>
          <ul className="grid grid-cols-2 gap-2 text-color-primary-light text-sm">
            {zodiacTopics.map((topic) => (
              <li 
                key={topic} 
                className="hover:text-color-primary transition-colors duration-300 cursor-pointer p-1 rounded hover:bg-color-primary/10"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-color-border pt-6 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <h4 className="text-center text-color-primary-light text-sm font-medium mb-4">We Accept</h4>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <div className="bg-color-surface p-2 rounded-md shadow-sm">
              <FaCcVisa size={28} className="text-color-text" />
            </div>
            <div className="bg-color-surface p-2 rounded-md shadow-sm">
              <FaCcMastercard size={28} className="text-color-text" />
            </div>
            <div className="bg-color-surface p-2 rounded-md shadow-sm">
              <FaCcPaypal size={28} className="text-color-text" />
            </div>
            <div className="bg-color-surface p-2 rounded-md shadow-sm">
              <img src={upiLogo} alt="UPI" className="h-7 w-auto" />
            </div>
            <div className="bg-color-surface p-2 rounded-md shadow-sm">
              <img src={gpayLogo} alt="GPay" className="h-7 w-auto" />
            </div>
            <div className="bg-color-surface p-2 rounded-md shadow-sm">
              <img src={netbankingLogo} alt="Netbanking" className="h-7 w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-color-border py-4 text-center text-color-text-muted text-xs sm:text-sm bg-color-primary-light/30">
        <div className="max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} Zodiac Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;