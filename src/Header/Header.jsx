import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, User, ChevronDown, Menu, X, UserCog, Search, Sparkles, LogOut } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import LoginSignup from "../Components/Login/Login";
import logo from "/Logo.png";
import axios from "axios";

// ---------- MENU DATA ----------
const menuItems = [
  { label: "Home", to: "/" },
  { label: "Gemstones", to: "/gemstones" },
  {
    label: "Categories",
    to: "/",
    subMenu: [
      { label: "Pendant", to: "/categories/pendant" },
      { label: "Necklace", to: "/categories/necklace" },
      { label: "Jewellery", to: "/categories/jewellery" },
      { label: "Rudraksh", to: "/categories/rudraksh" },
    ],
  },
  { label: "FAQs", to: "/faqs" },
  { label: "Blogs", to: "/blogs" },
];

const userMenuItems = [
  { to: "/cart", icon: ShoppingBag, badgeType: "cart" },
  { to: "/wishlist", icon: Heart, badgeType: "wishlist" },
  { to: "/account", icon: User },
];

// Pages where search should be visible
const searchEnabledPages = ["/gemstones", "/categories", "/faqs", "/blogs"];

// ---------- HELPER COMPONENTS ----------
const Badge = ({ count }) =>
  count > 0 && (
    <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full ring-2 ring-white shadow-md animate-pulse">
      {count > 99 ? "99+" : count}
    </span>
  );

// Enhanced animated underline with glow effect
const AnimatedUnderline = ({ menuItems, navRef, location }) => {
  const [underlineStyle, setUnderlineStyle] = useState({ opacity: 0 });
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // First hide the underline
    setUnderlineStyle(prev => ({ ...prev, opacity: 0 }));

    // Wait for the next frame to calculate positions
    timeoutRef.current = setTimeout(() => {
      if (!navRef.current) return;

      // Find the active menu item
      let activeItem = null;
      for (const item of menuItems) {
        if (location.pathname === item.to ||
          (item.subMenu && item.subMenu.some(sub => location.pathname.startsWith(sub.to)))) {
          activeItem = item;
          break;
        }
      }

      if (!activeItem) return;

      const activeNavItem = navRef.current.querySelector(`a[href="${activeItem.to}"]`);
      if (!activeNavItem) return;

      const itemRect = activeNavItem.getBoundingClientRect();
      const containerRect = navRef.current.getBoundingClientRect();

      // Calculate position relative to container
      const left = itemRect.left - containerRect.left;
      const width = itemRect.width;

      // Smoothly animate to new position with glow effect
      setUnderlineStyle({
        left: `${left}px`,
        width: `${width}px`,
        opacity: 1,
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: '0 0 20px rgba(184, 159, 122, 0.6)'
      });
    }, 50); // Small delay to ensure DOM is updated

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, menuItems, navRef]);

  return (
    <div
      className="absolute bottom-0 h-1 bg-gradient-to-r from-[var(--color-primary)]/80 via-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full"
      style={underlineStyle}
    />
  );
};

const NavItem = ({ item, location, isMobile, closeMenu, navRef, onItemHover, categoryData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemRef = useRef(null);

  const handleMouseEnter = () => {
    if (item.subMenu && !isMobile) {
      setDropdownOpen(true);
    }
    if (onItemHover) {
      onItemHover(itemRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (item.subMenu && !isMobile) {
      setDropdownOpen(false);
    }
  };

  const handleClick = () => {
    if (item.subMenu && isMobile) {
      setDropdownOpen(!dropdownOpen);
    } else if (isMobile) {
      closeMenu();
    }
  };

  const isParentActive =
    item.subMenu && item.subMenu.some((sub) => location.pathname.startsWith(sub.to));

  const isActive = location.pathname === item.to || isParentActive;

  return (
    <li
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <NavLink
        to={item.to}
        onClick={handleClick}
        className={({ isActive }) =>
          `flex items-center gap-2 px-6 py-4 transition-all duration-300 relative group/item ${isActive || isParentActive
            ? "text-[var(--color-primary)] font-semibold"
            : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
          } ${isMobile ? "justify-between border-b border-[var(--color-border)]" : ""}`
        }
        ref={itemRef}
      >
        {item.label}
        {item.subMenu && (
          <ChevronDown
            className={`w-4 h-4 transition-all duration-300 ${dropdownOpen ? "rotate-180 text-[var(--color-primary)]" : ""
              }`}
          />
        )}

        {/* Enhanced hover effect background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 -z-10" />
      </NavLink>

      {item.subMenu && (
        <ul
          className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border)] ${isMobile
            ? `pl-6 transition-all duration-300 ease-out ${dropdownOpen ? "max-h-96 mt-2" : "max-h-0"
            }`
            : `absolute left-0 mt-2 min-w-[280px] transform transition-all duration-300 ease-out z-50 ${dropdownOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }`
            }`}
        >
          {categoryData && categoryData.map((cat, index) => (
            <li key={cat.CategoryName}>
              <NavLink
                to={`/category/${cat.CategoryName}`}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `group/sub block px-6 py-4 text-sm transition-all duration-300 border-b [var(--color-border)] last:border-b-0 relative overflow-hidden ${isActive
                    ? "bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 text-[var(--color-primary)] font-semibold"
                    : "text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/50 hover:to-[var(--color-primary-light)]/30 hover:text-[var(--color-primary)]"
                  }`
                }
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="font-medium">{cat.CategoryName}</div>

                {/* Slide in effect */}
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] transform -translate-x-full group-hover/sub:translate-x-0 transition-transform duration-300" />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const UserMenuIcon = ({ to, Icon, badgeCount, closeMenu, className = "" }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative p-3 rounded-xl transition-all duration-300 ease-out flex items-center justify-center group/icon ${isActive
        ? "bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 text-[var(--color-primary)] shadow-lg"
        : "text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md"
      } ${className}`
    }
    onClick={closeMenu}
  >
    <Icon className="h-5 w-5 transition-all duration-300 group-hover/icon:scale-110" />
    {badgeCount > 0 && <Badge count={badgeCount} />}
  </NavLink>
);
// Add this function to handle authenticated requests
const makeAuthenticatedRequest = async (url, method = 'GET', data = null) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setShowLogin(true);
      return null;
    }

    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: data ? JSON.stringify(data) : null
    });

    if (response.status === 401) {
      // Token expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      setShowLogin(true);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
};

// Example usage in your component:
const handleCreateProduct = async (productData) => {
  const result = await makeAuthenticatedRequest('/admin/products', 'POST', productData);
  if (result) {
    // Handle success
    console.log('Product created:', result);
  }
};


// ---------- MAIN HEADER ----------
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverUnderlineStyle, setHoverUnderlineStyle] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);



useEffect(() => {
  const token = localStorage.getItem("authToken"); // 👈 we’ll store this in login
  const userData = localStorage.getItem("user");

  if (token) {
    setIsLoggedIn(true);

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
        setUser(null);
      }
    }
  } else {
    setIsLoggedIn(false);
    setUser(null);
  }
}, [showLogin]); // 👈 re-run when login modal closes

  // Check login state when modal closes
  useEffect(() => {
    if (!showLogin) {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, [showLogin]);

  const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  setIsLoggedIn(false);
  setUser(null);
};


  const isAdmin = isLoggedIn && user?.role?.toLowerCase() === 'admin';
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const navRef = useRef(null);

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const closeMenu = () => setMenuOpen(false);

  // Check if search should be shown on current page
  const shouldShowSearch = searchEnabledPages.some(path =>
    location.pathname.startsWith(path)
  );

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchOpen) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, searchOpen]);

  // Handle menu item hover for additional underline effect
  const handleItemHover = (itemElement) => {
    if (!itemElement || !navRef.current) return;

    const itemRect = itemElement.getBoundingClientRect();
    const containerRect = navRef.current.getBoundingClientRect();

    setHoverUnderlineStyle({
      left: `${itemRect.left - containerRect.left}px`,
      width: `${itemRect.width}px`,
      opacity: 0.3,
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
  };

  const handleMenuLeave = () => {
    setHoverUnderlineStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-xl py-3 border-b border-[var(--color-border)]"
          : "bg-white/95 backdrop-blur-md py-4 shadow-lg"
          }`}
      >
        {/* Enhanced gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)]/80 via-[var(--color-primary)] to-[var(--color-primary-dark)]"></div>

        <nav className="container mx-auto px-4 flex items-center justify-between">
          {/* Enhanced Logo */}
          <NavLink
            to="/"
            className="flex-shrink-0 cursor-pointer z-50 flex items-center transition-all duration-500 ease-out group"
            onClick={closeMenu}
          >
            <div className="relative flex items-center">
              {/* Enhanced logo background with glow */}
              <div className="relative">
                <img
                  src={logo}
                  alt="Nakshatraloko Logo"
                  className={`transition-all duration-500 ease-out ${scrolled ? "h-10" : "h-12"} filter invert relative z-10`}
                />
                {/* Glow effect behind logo */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/60 to-[var(--color-primary)]/40 rounded-lg blur-md opacity-20 group-hover:opacity-40 transition-all duration-500 ${scrolled ? "scale-90" : "scale-100"}`}></div>
              </div>

              <div className="absolute -right-2 -top-1 animate-spin-slow">
                <Sparkles className="h-4 w-4 text-[var(--color-primary)] transition-all duration-500 ease-out" fill="currentColor" />
              </div>

              <span className={`ml-3 text-[var(--color-text)] font-bold transition-all duration-500 ease-out hidden sm:block ${scrolled ? "text-lg" : "text-xl"}`}>
                Nakshatra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">Loko</span>
              </span>
            </div>
          </NavLink>

          {/* Enhanced Desktop Menu */}
          <div
            className="hidden lg:flex relative"
            ref={navRef}
            onMouseLeave={handleMenuLeave}
          >
            <ul className="flex items-center space-x-2 text-[1.05rem] font-medium">
              {menuItems.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  location={location}
                  navRef={navRef}
                  onItemHover={handleItemHover}
                  categoryData={categoryData}
                />
              ))}
            </ul>
            <AnimatedUnderline
              menuItems={menuItems}
              navRef={navRef}
              location={location}
            />
            {/* Enhanced hover underline effect */}
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-[var(--color-primary)]/50 to-[var(--color-primary)]/30 rounded-full transition-all duration-300 ease-out"
              style={hoverUnderlineStyle}
            />
          </div>

          {/* Enhanced Search Bar - Conditionally Rendered */}
          {shouldShowSearch && (
            <div ref={searchRef} className="hidden md:flex relative">
              <div className={`relative overflow-hidden transition-all duration-500 ease-out ${searchOpen ? "w-80 opacity-100" : "w-0 opacity-0"}`}>
                <input
                  type="text"
                  placeholder="Discover exquisite jewelry..."
                  className="w-full px-5 py-3 pl-12 rounded-2xl border-2 border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary-light)] to-white text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-300 ease-out placeholder-[var(--color-text-muted)]"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-primary)]/70" />
              </div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-3 rounded-2xl ml-3 transition-all duration-300 ease-out ${searchOpen
                  ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg shadow-[var(--color-primary)]/30"
                  : "text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary-light)]/80 hover:text-[var(--color-primary)]"
                  }`}
              >
                <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              </button>
            </div>
          )}

          {/* Enhanced Desktop User Icons / Login */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {isLoggedIn ? (
              <>
                {userMenuItems.map(({ to, icon: Icon, badgeType }, idx) => (
                  <UserMenuIcon
                    key={idx}
                    to={to}
                    Icon={Icon}
                    badgeCount={
                      badgeType === "cart" ? cartCount : badgeType === "wishlist" ? wishlistCount : 0
                    }
                  />
                ))}

                {/* Admin Panel Icon - Always show if user is admin */}
                {isAdmin && (
                  <UserMenuIcon
                    to="/admin"
                    Icon={UserCog}
                    badgeCount={0}
                    className="bg-gradient-to-r from-[var(--color-accent-amber)]/20 to-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)] border border-[var(--color-accent-amber)]/20"
                  />
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md transition-all duration-300 ease-out"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="ml-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-primary-dark)] text-white font-semibold hover:from-[var(--color-primary)]/90 hover:via-[var(--color-primary)]/80 hover:to-[var(--color-primary-dark)] transition-all duration-300 ease-out shadow-xl hover:shadow-[var(--color-primary)]/30 relative overflow-hidden group transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/90 via-[var(--color-primary)]/80 to-[var(--color-primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Search - Conditionally Rendered */}
            {shouldShowSearch && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors duration-300 ease-out md:hidden"
              >
                <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              </button>
            )}

            {/* Mobile Icons - Show cart and admin panel if logged in */}
            {isLoggedIn && (
              <div className="flex items-center space-x-1 mr-2">
                <UserMenuIcon
                  to="/cart"
                  Icon={ShoppingBag}
                  badgeCount={cartCount}
                  closeMenu={closeMenu}
                />

                {/* Admin Panel Icon for Mobile */}
                {isAdmin && (
                  <UserMenuIcon
                    to="/admin"
                    Icon={UserCog}
                    badgeCount={0}
                    className="bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    closeMenu={closeMenu}
                  />
                )}
              </div>
            )}

            <button
              aria-label="Toggle Menu"
              className={`p-3 rounded-xl transition-all duration-300 ease-out ${menuOpen
                ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rotate-180"
                : "text-[var(--color-text)] bg-gradient-to-r from-[var(--color-background)] to-[var(--color-background-alt)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary-dark)] hover:text-white"
                }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Search Panel - Conditionally Rendered */}
        {searchOpen && shouldShowSearch && (
          <div className="md:hidden container mx-auto px-4 py-4 border-t border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary-light)] to-white transition-all duration-500 ease-out">
            <div className="relative">
              <input
                type="text"
                placeholder="Discover exquisite jewelry..."
                className="w-full px-5 py-3 pl-12 rounded-2xl border-2 border-[var(--color-border)] bg-white text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-300 ease-out placeholder-[var(--color-text-muted)]"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-primary)]/70" />
            </div>
          </div>
        )}

        {/* Enhanced Mobile Menu */}
        <div
          ref={menuRef}
          className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out border-t border-[var(--color-border)] ${menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
            }`}
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={item.label} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-in-left">
                  <NavItem
                    item={item}
                    location={location}
                    isMobile={true}
                    closeMenu={closeMenu}
                    navRef={navRef}
                    categoryData={categoryData}
                  />
                </div>
              ))}
            </ul>

            {/* Enhanced Mobile Login/User Section */}
            <div className="pt-6 mt-6 border-t border-[var(--color-border)] transition-all duration-300 ease-out">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-around bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 p-4 rounded-2xl">
                    {userMenuItems.map(({ to, icon: Icon, badgeType }, idx) => (
                      <UserMenuIcon
                        key={idx}
                        to={to}
                        Icon={Icon}
                        badgeCount={
                          badgeType === "cart"
                            ? cartCount
                            : badgeType === "wishlist"
                              ? wishlistCount
                              : 0
                        }
                        closeMenu={closeMenu}
                      />
                    ))}

                    {/* Admin Panel Icon for Mobile Menu */}
                    {isAdmin && (
                      <UserMenuIcon
                        to="/admin"
                        Icon={UserCog}
                        badgeCount={0}
                        closeMenu={closeMenu}
                        className="bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      />
                    )}
                  </div>

                  {/* Logout Button in Mobile */}
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-2xl bg-[var(--color-primary)] text-white font-semibold transition-all duration-300 ease-out flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    closeMenu();
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/90 to-[var(--color-primary-dark)] text-white font-semibold hover:from-[var(--color-primary)]/90 hover:via-[var(--color-primary)]/80 hover:to-[var(--color-primary-dark)] transition-all duration-300 ease-out shadow-xl flex items-center justify-center gap-2"
                >
                  <User className="h-5 w-5" />
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Add spacing for fixed header */}
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled ? "h-20" : "h-24"}`}></div>

      {/* Login Modal */}
      {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}
    </>
  );
}