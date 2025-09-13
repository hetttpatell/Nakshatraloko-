import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios"; // Make sure to import axios
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

const Footer = () => {
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:8001/api/getAllCatogary");

        if (response.data.data) {
          // Transform API data to match our component structure
          const formattedCategories = response.data.data.map(category => ({
            id: category._id || category.id || category.ID,
            name: category.name || category.Name || "",
            // Create a URL-friendly slug for the category link
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
        console.error("Error fetching categories:", err);
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
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {/* Brand Section */}
        <div className="flex flex-col space-y-4">
          <h3 className={`text-2xl font-playfair font-bold ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-text)]"}`}>
            Nakshatraloka
          </h3>
          <p className="text-[var(--color-text-light)] text-sm leading-relaxed">
            Discover exquisite gemstones and jewelry crafted with precision. Each piece is thoughtfully designed to complement your unique style and energy.
          </p>
          <div className="flex space-x-3 mt-2">
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
          </div>
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
              { label: "Collections", to: "/collections" },
              { label: "Gemstones", to: "/gemstones" },
              { label: "About Us", to: "/about" },
              { label: "FAQs", to: "/faqs" }
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors duration-300 text-sm flex items-center group"
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity 
                    "bg-[var(--color-primary)]"`}></span>
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
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isHomePage ? "bg-[var(--color-primary-dark)]" : "bg-[var(--color-primary)]"
                    }`}></span>
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
            <div className="flex items-start">
              <FaMapMarkerAlt className={`mt-1 mr-3 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary)]"}`} />
              <span>123 Jewelry Street, Gem City, GC 12345</span>
            </div>
            <div className="flex items-center">
              <FaPhone className={`mr-3 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary)]"}`} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <FaEnvelope className={`mr-3 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary)]"}`} />
              <span>info@nakshatraloka.com</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className={`font-medium mb-2 ${isHomePage ? "text-[var(--color-primary-dark)]" : "text-[var(--color-text)]"}`}>
              Newsletter
            </h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <button className={`px-3 py-2 text-sm rounded-r-md transition-colors ${
                isHomePage 
                  ? "bg-[var(--color-primary-dark)] text-white hover:bg-[var(--color-primary)]" 
                  : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              }`}>
                Subscribe
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
              <span>© {new Date().getFullYear()} Nakshatraloka. All rights reserved.</span>
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