import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Footer = () => {
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Company contact information
  const companyInfo = {
    phone: "+919601394272",
    phoneDisplay: "+91 96013 94272",
    email: "customercare@nakshatraloka.com",
    address: "Gujarat, India",
    businessName: "Nakshatraloka"
  };

  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location]);

  // Function to handle phone call
  const handlePhoneClick = () => {
    // Using tel: protocol for mobile devices
    window.location.href = `tel:${companyInfo.phone}`;
  };

  // Function to handle email
  const handleEmailClick = () => {
    // Using mailto: protocol with pre-filled subject
    const subject = encodeURIComponent(`Inquiry - ${companyInfo.businessName}`);
    const body = encodeURIComponent("Hello,\n\nI would like to inquire about...");

    window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${BACKEND_URL}getAllCatogary`);

        if (response.data.data) {
          const formattedCategories = response.data.data.map(category => ({
            id: category._id || category.id || category.ID,
            name: category.name || category.Name || "",
            slug: (category.name || category.Name || "").toLowerCase().replace(/\s+/g, '-'),
            description: category.description || category.Description || "",
            productCount: 0,
            isShown:
              category.isShown !== undefined
                ? category.isShown
                : category.IsShown !== undefined
                  ? category.IsShown
                  : true,
            isActive:
              category.isActive !== undefined
                ? category.isActive
                : category.IsActive !== undefined
                  ? category.IsActive
                  : true,
            isFeatured: category.isFeatured || false,
            image: category.image || ""
          }));

          setCategories(formattedCategories);
        }
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer
      className={`relative overflow-hidden transition-all duration-500 ${isHomePage
        ? "bg-gradient-to-b from-[#f9f7f3] to-[#f5f2eb] border-t border-[var(--color-primary-light)]"
        : "bg-[var(--color-background-alt)] border-t border-[var(--color-border)]"
        }`}
    >
      {/* Background pattern/image for homepage */}
      {isHomePage && (
        <div className="absolute inset-0 z-0 opacity-10 bg-[var(--color-primary)]"></div>
      )}

      {/* Main Footer Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 overflow-hidden">
        {/* Brand Section */}
        <div className="flex flex-col space-y-4 items-start">
          {/* Brand Logo */}
          <div>
            <img
              src="/Logo.png"
              alt="Nakshatraloka Logo"
              className="w-24 h-auto object-contain filter invert"
            />
          </div>

          {/* Brand Description */}
          <p className="text-[var(--color-text-light)] text-sm leading-relaxed">
            Discover exquisite gemstones and jewelry crafted with precision. Each piece is thoughtfully designed to complement your unique style and energy.
          </p>

          {/* Social Icons */}
          {/* Social Icons */}
          <div className="flex space-x-3 mt-2">
            {[
              {
                icon: FaInstagram,
                label: "Instagram",
                link: "https://www.instagram.com/nakshatraloka_/?next=%2F&hl=en"
              },
              {
                icon: FaFacebookF,
                label: "Facebook",
                link: "https://www.facebook.com/profile.php?id=61579053167053"
              }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${isHomePage
                  ? "bg-white hover:bg-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] hover:bg-[var(--color-primary)]"
                  }`}
                aria-label={social.label}
              >
                <social.icon
                  size={16}
                  className={`${isHomePage
                    ? "text-[var(--color-primary-dark)] hover:text-white"
                    : "text-[var(--color-text)] hover:text-white"
                    }`}
                />
              </a>
            ))}
          </div>

          {/* <div className="flex space-x-3 mt-2">
            {[
              { icon: FaInstagram, label: "Instagram" },
              { icon: FaFacebookF, label: "Facebook" },
              { icon: FaTwitter, label: "Twitter" },
              { icon: FaPinterestP, label: "Pinterest" }
            ].map((social, idx) => (
              <a
                key={idx}
                href="#"
                className={`p-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${isHomePage
                  ? "bg-white hover:bg-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] hover:bg-[var(--color-primary)]"
                  }`}
                aria-label={social.label}
              >
                <social.icon
                  size={16}
                  className={`${isHomePage
                    ? "text-[var(--color-primary-dark)] hover:text-white"
                    : "text-[var(--color-text)] hover:text-white"
                    }`}
                />
              </a>
            ))}
          </div> */}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className={`font-semibold mb-4 text-lg pb-2 border-b ${isHomePage
            ? "text-[var(--color-primary-dark)] border-[var(--color-primary-light)]"
            : "text-[var(--color-text)] border-[var(--color-primary)]"
            }`}>
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { label: "Home", to: "/" },
              { label: "Product", to: "/gemstones" },
              { label: "FAQs", to: "/faqs" },
              { label: "Blogs", to: "/blogs" }
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={(e) => {
                    if (item.to === "/" && location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity 
            "bg-[var(--color-primary)]"`}
                  ></span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col">
          <h3 className={`font-semibold mb-4 text-lg pb-2 border-b ${isHomePage
            ? "text-[var(--color-primary-dark)] border-[var(--color-primary-light)]"
            : "text-[var(--color-text)] border-[var(--color-primary)]"
            }`}>
            Categories
          </h3>
          <ul className="space-y-3">
            {isLoading ? (
              <li className="text-[var(--color-text-light)] text-sm">Loading categories...</li>
            ) : error ? (
              <li className="text-[var(--color-accent-red)] text-sm">{error}</li>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${isHomePage ? "bg-[var(--color-primary-dark)]" : "bg-[var(--color-primary)]"}`}></span>
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-[var(--color-text-light)] text-sm">No categories available</li>
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col">
          <h3 className={`font-semibold mb-4 text-lg pb-2 border-b ${isHomePage
            ? "text-[var(--color-primary-dark)] border-[var(--color-primary-light)]"
            : "text-[var(--color-text)] border-[var(--color-primary)]"
            }`}>
            Contact Us
          </h3>

          <div className="space-y-3 text-[var(--color-text-light)] text-sm">
            {/* Address */}
            <div className="flex items-start">
              <FaMapMarkerAlt
                className={`mt-1 mr-3 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary)]"
                  }`}
              />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Gujarat, India"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {companyInfo.address}
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center">
              <FaPhone
                className={`mr-3 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary)]"
                  }`}
              />
              <button
                onClick={() => {
                  window.location.href = `tel:${companyInfo.phone}`;
                }}
                className="hover:underline text-left transition-colors duration-200 hover:text-[var(--color-primary)]"
                aria-label={`Call ${companyInfo.phoneDisplay}`}
              >
                {companyInfo.phoneDisplay}
              </button>
            </div>


            {/* Email */}
            <div className="flex items-center">
              <FaEnvelope
                className={`mr-3 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary)]"}`}
              />
              <button
                onClick={() => {
                  window.open(
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${companyInfo.email}`,
                    "_blank"
                  );
                }}
                className="hover:underline text-left transition-colors duration-200 hover:text-[var(--color-primary)]"
                aria-label={`Email ${companyInfo.email}`}
              >
                {companyInfo.email}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className={`border-t relative z-10  
         "bg-white/80 border-[var(--color-primary)]"`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2 text-xs text-[var(--color-text-light)]">
              <span>© {new Date().getFullYear()} {companyInfo.businessName}. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-[var(--color-text-light)]">We accept:</span>
              <div className="flex space-x-2">
                <FaCcVisa size={24} className="text-[var(--color-text)]" />
                <FaCcMastercard size={24} className="text-[var(--color-text)]" />
                <FaCcPaypal size={24} className="text-[var(--color-text)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;