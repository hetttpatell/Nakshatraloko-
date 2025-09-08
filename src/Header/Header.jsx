import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, User, ChevronDown, Menu, X, UserCog, Search, Gem, Sparkles } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import LoginSignup from "../Components/Login/Login";
import logo from "/Logo.png";

// ---------- MENU DATA ----------
const menuItems = [
  { label: "Home", to: "/" },
  { label: "Gemstones", to: "/gemstones" },
  {
    label: "Categories",
    to: "/categories",
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
    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full ring-2 ring-white">
      {count}
    </span>
  );

// New component for the animated underline
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
      
      // Smoothly animate to new position
      setUnderlineStyle({
        left: `${left}px`,
        width: `${width}px`,
        opacity: 1,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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
      className="absolute bottom-0 h-0.5 bg-purple-500 transition-all duration-400 ease-out"
      style={underlineStyle}
    />
  );
};

const NavItem = ({ item, location, isMobile, closeMenu, navRef, onItemHover }) => {
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
          `flex items-center gap-1 px-5 py-4 transition-all duration-300 relative ${
            isActive || isParentActive 
              ? "text-purple-600 font-semibold" 
              : "text-gray-700 hover:text-purple-600"
          } ${isMobile ? "justify-between border-b border-gray-100" : ""}`
        }
        ref={itemRef}
      >
        {item.label}
        {item.subMenu && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </NavLink>

      {item.subMenu && (
        <ul
          className={`bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 ${
            isMobile 
              ? `pl-6 transition-all duration-300 ease-out ${dropdownOpen ? "max-h-96 mt-2" : "max-h-0"}`
              : `absolute left-0 mt-1 min-w-[220px] transform transition-all duration-300 ease-out z-50 ${
                  dropdownOpen 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`
          }`}
        >
          {item.subMenu.map((sub) => (
            <li key={sub.label}>
              <NavLink
                to={sub.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-5 py-3 text-sm font-medium transition-colors duration-300 ease-out border-b border-gray-50 last:border-b-0 ${
                    isActive 
                      ? "bg-purple-50 text-purple-700 font-semibold" 
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`
                }
              >
                {sub.label}
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
      `relative p-3 rounded-xl transition-all duration-300 ease-out flex items-center justify-center ${
        isActive 
          ? "bg-purple-100 text-purple-700" 
          : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
      } ${className}`
    }
    onClick={closeMenu}
  >
    <Icon className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
    {badgeCount > 0 && <Badge count={badgeCount} />}
  </NavLink>
);

// ---------- MAIN HEADER ----------
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoverUnderlineStyle, setHoverUnderlineStyle] = useState({});
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

  // Example login and role data
  const isLoggedIn = true; // change as needed
  const user = { role: "admin" }; // Replace with actual user data
  const isAdmin = isLoggedIn && user.role === "admin";

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
      opacity: 0.5,
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
  };

  const handleMenuLeave = () => {
    setHoverUnderlineStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <header 
  className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
    scrolled 
      ? "bg-white/90 backdrop-blur-lg shadow-md py-4 border-b border-gray-100" 
      : "bg-white py-5 shadow-sm"
  }`}
>

        {/* Purple accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
        
        <nav className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex-shrink-0 cursor-pointer z-50 flex items-center transition-all duration-500 ease-out"
            onClick={closeMenu}
          >
            <div className="relative flex items-center">
              <img 
  src={logo} 
  alt="Nakshatraloko Logo" 
  className={`transition-all duration-500 ease-out ${scrolled ? "h-12" : "h-14"} filter invert`} 
/>

              <div className="absolute -right-2 -top-1">
                <Sparkles className="h-4 w-4 text-purple-500 transition-all duration-500 ease-out" fill="currentColor" />
              </div>
              <span className="ml-2 text-gray-800 font-bold transition-all duration-500 ease-out hidden sm:block" style={{ fontSize: scrolled ? "1.25rem" : "1.5rem" }}>
                Nakshatra<span className="text-purple-600">Loko</span>
              </span>
            </div>
          </NavLink>

          {/* Desktop Menu */}
          <div 
            className="hidden lg:flex relative" 
            ref={navRef}
            onMouseLeave={handleMenuLeave}
          >
            <ul className="flex items-center space-x-6 text-[1.05rem] font-medium">

              {menuItems.map((item) => (
                <NavItem 
                  key={item.label} 
                  item={item} 
                  location={location} 
                  navRef={navRef}
                  onItemHover={handleItemHover}
                />
              ))}
            </ul>
            <AnimatedUnderline 
              menuItems={menuItems} 
              navRef={navRef}
              location={location}
            />
            {/* Hover underline effect */}
            <div 
              className="absolute bottom-0 h-0.5 bg-purple-300 transition-all duration-300 ease-out"
              style={hoverUnderlineStyle}
            />
          </div>

          {/* Search Bar - Conditionally Rendered */}
          {shouldShowSearch && (
            <div ref={searchRef} className="hidden md:flex relative">
              <div className={`overflow-hidden transition-all duration-500 ease-out ${searchOpen ? "w-64 opacity-100" : "w-0 opacity-0"}`}>
                <input 
                  type="text" 
                  placeholder="Search exquisite jewelry..." 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-300 transition-all duration-300 ease-out"
                />
              </div>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl ml-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300 ease-out"
              >
                <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              </button>
            </div>
          )}

          {/* Desktop User Icons / Login */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
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

                {isAdmin && (
                  <UserMenuIcon
                    to="/admin"
                    Icon={UserCog}
                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-600"
                  />
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="ml-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 ease-out shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Search - Conditionally Rendered */}
            {shouldShowSearch && (
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300 ease-out md:hidden"
              >
                <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              </button>
            )}
            
            {isLoggedIn && (
              <div className="flex items-center space-x-2 mr-2">
                {cartCount > 0 && (
                  <UserMenuIcon
                    to="/cart"
                    Icon={ShoppingBag}
                    badgeCount={cartCount}
                    closeMenu={closeMenu}
                  />
                )}
                {isAdmin && (
                  <UserMenuIcon
                    to="/admin"
                    Icon={UserCog}
                    className="bg-purple-500/10 text-purple-600"
                    closeMenu={closeMenu}
                  />
                )}
              </div>
            )}
            
            <button
              aria-label="Toggle Menu"
              className="p-2.5 rounded-xl text-gray-600 bg-gray-100 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-out"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5 transition-transform duration-300 ease-out" /> : <Menu className="w-5 h-5 transition-transform duration-300 ease-out" />}
            </button>
          </div>
        </nav>

        {/* Mobile Search Panel - Conditionally Rendered */}
        {searchOpen && shouldShowSearch && (
          <div className="md:hidden container mx-auto px-4 py-3 border-t border-gray-100 transition-all duration-500 ease-out">
            <input 
              type="text" 
              placeholder="Search exquisite jewelry..." 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-300 transition-all duration-300 ease-out"
            />
          </div>
        )}

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transform transition-all duration-500 ease-out border-t border-gray-100 ${
            menuOpen 
              ? "translate-y-0 opacity-100" 
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <NavItem 
                  key={item.label} 
                  item={item} 
                  location={location} 
                  isMobile={true}
                  closeMenu={closeMenu}
                  navRef={navRef}
                />
              ))}
            </ul>

            {/* Mobile Login/User Section */}
            <div className="pt-6 mt-6 border-t border-gray-100 transition-all duration-300 ease-out">
              {isLoggedIn ? (
                <div className="flex items-center justify-around">
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
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    closeMenu();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 ease-out shadow-lg"
                >
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