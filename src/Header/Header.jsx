import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, ChevronDown, Menu, X, UserCog, Search, Sparkles, LogOut } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import LoginSignup from "../Components/Login/Login";
import logo from "/Logo.png";
import axios from "axios";

// ---------- MENU DATA ---------- 
const initialMenuItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/gemstones" },
  {
    label: "Categories",
    to: "/",
    subMenu: [],
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
  const clickTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    // Clear any pending leave timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    
    if (item.subMenu && !isMobile) {
      setDropdownOpen(true);
    }
    if (onItemHover) {
      onItemHover(itemRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Set a timeout before closing the dropdown to allow for cursor movement to submenu
    if (item.subMenu && !isMobile) {
      leaveTimeoutRef.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 300); // 300ms delay before closing
    }
  };

  const handleDropdownMouseEnter = () => {
    // Clear any pending leave timeout when entering the dropdown
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    // Close dropdown when leaving the dropdown area
    if (item.subMenu && !isMobile) {
      leaveTimeoutRef.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 200); // 200ms delay before closing
    }
  };

  const handleClick = () => {
    if (item.subMenu && isMobile) {
      // Delay toggling the dropdown
      clickTimeoutRef.current = setTimeout(() => {
        setDropdownOpen(prev => !prev);
      }, 200); // 200ms delay
    } else if (isMobile) {
      closeMenu();
    }
  };

  const isParentActive =
    item.subMenu && item.subMenu.some((sub) => location.pathname.startsWith(sub.to));

  const isActive = location.pathname === item.to || isParentActive;

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

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
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {item.subMenu.map((subItem, index) => (
            <li key={subItem.label}>
              <NavLink
                to={subItem.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `group/sub block px-6 py-4 text-sm transition-all duration-300 border-b [var(--color-border)] last:border-b-0 relative overflow-hidden ${isActive
                    ? "bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 text-[var(--color-primary)] font-semibold"
                    : "text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/50 hover:to-[var(--color-primary-light)]/30 hover:text-[var(--color-primary)]"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="font-medium">{subItem.label}</div>
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] transform -translate-x-full group-hover/sub:translate-x-0 transition-transform duration-300" />
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const UserMenuIcon = ({ to, Icon, badgeCount, closeMenu, className = "", onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative p-3 rounded-xl transition-all duration-300 ease-out flex items-center justify-center group/icon ${isActive
        ? "bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 text-[var(--color-primary)] shadow-lg"
        : "text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md"
      } ${className}`
    }
    onClick={() => {
      if (onClick) onClick();
      closeMenu();
    }}
  >
    <Icon className="h-5 w-5 transition-all duration-300 group-hover/icon:scale-110" />
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userrole, setUserrole] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const navRef = useRef(null);

  const { cart, fetchCart } = useCart();
  const { wishlist, setWishlist, fetchWishlist } = useWishlist();

  const location = useLocation();

  // Calculate cart and wishlist counts
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const closeMenu = () => setMenuOpen(false);

  // Check if search should be shown on current page
  const shouldShowSearch = searchEnabledPages.some(path =>
    location.pathname.startsWith(path)
  );

  // Fetch cart data when component mounts or login state changes
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          await fetchCart();
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartData();
  }, [isLoggedIn, fetchCart]);

  // Fetch wishlist data when component mounts or login state changes
  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          await fetchWishlist();
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlistData();
  }, [isLoggedIn, fetchWishlist, setWishlist]);

  // Initialize menu items
  useEffect(() => {
    axios
      .post("http://localhost:8001/api/getAllCatogary")
      .then((res) => {
        if (res.data.success) {
          const transformedData = res.data.data.map((category) => ({
            CategoryName: category.Name,
            Image: category.Image || "/abot.jpg",
          }));
          setCategoryData(transformedData);

          // Update the Categories menu item with subMenu data
          setMenuItems(prevItems =>
            prevItems.map(item =>
              item.label === "Categories"
                ? {
                  ...item,
                  subMenu: transformedData.map(cat => ({
                    label: cat.CategoryName,
                    to: `/category/${cat.CategoryName}`
                  }))
                }
                : item
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Check login state when modal closes
  useEffect(() => {
    if (!showLogin) {
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          if (parsedUser?.role) {
            setUserrole(parsedUser.role.toLowerCase() === "admin");
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setUserrole(false);
      }
    }
  }, [showLogin]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setUserrole(false);
    // Clear cart and wishlist on logout
    setWishlist([]);
  };

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
        setSearchQuery("");
        setSearchResults([]);
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

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Call your search API endpoint
      const response = await axios.post("http://localhost:8001/api/search", {
        query: query,
      });

      if (response.data.success) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle search result selection
  const handleSearchResultClick = (result) => {
    navigate(result.url);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
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
                  alt="Nakshatraloka Logo"
                  className={`transition-all duration-500 ease-out ${scrolled ? "h-10" : "h-12"} filter invert relative z-10`}
                />
                {/* Glow effect behind logo */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/60 to-[var(--color-primary)]/40 rounded-lg blur-md opacity-20 group-hover:opacity-40 transition-all duration-500 ${scrolled ? "scale-90" : "scale-100"}`}></div>
              </div>

              <div className="absolute -right-2 -top-1 animate-spin-slow">
                <Sparkles className="h-4 w-4 text-[var(--color-primary)] transition-all duration-500 ease-out" fill="currentColor" />
              </div>

              <span className={`ml-3 text-[var(--color-text)] font-bold transition-all duration-500 ease-out hidden sm:block ${scrolled ? "text-lg" : "text-xl"}`}>
                Nakshatra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">Loka</span>
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
                  onItemHover={handleItemHover}
                  categoryData={categoryData}
                />
              ))}
            </ul>

            {/* Enhanced animated underline */}
            <AnimatedUnderline
              menuItems={menuItems}
              navRef={navRef}
              location={location}
            />

            {/* Hover underline effect */}
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-[var(--color-primary)]/30 via-[var(--color-primary)]/20 to-[var(--color-primary-dark)]/30 rounded-full transition-all duration-300"
              style={hoverUnderlineStyle}
            />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Search icon - only show on pages where search is enabled */}
            {shouldShowSearch && (
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (!searchOpen) {
                    // Focus on search input when opening
                    setTimeout(() => {
                      const searchInput = document.querySelector('input[type="text"]');
                      if (searchInput) searchInput.focus();
                    }, 100);
                  } else {
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
                className={`p-3 rounded-xl transition-all duration-300 ease-out ${searchOpen
                  ? "bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary-light)]/80 text-[var(--color-primary)] shadow-lg"
                  : "text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md"
                  }`}
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {/* User menu icons */}
            <div className="flex items-center gap-2">
              {userMenuItems.map((item) => (
                <UserMenuIcon
                  key={item.to}
                  to={item.to}
                  Icon={item.icon}
                  badgeCount={
                    item.badgeType === "cart"
                      ? cartCount
                      : item.badgeType === "wishlist"
                        ? wishlistCount
                        : 0
                  }
                  closeMenu={closeMenu}
                  onClick={
                    item.badgeType === "wishlist"
                      ? fetchWishlist // Call API only on wishlist click
                      : undefined
                  }
                />
              ))}

              {/* Admin Panel icon - only show if logged in AND role is admin */}
              {isLoggedIn && userrole && (
                <UserMenuIcon
                  to="/admin"
                  Icon={UserCog}
                  closeMenu={closeMenu}
                  className="hidden lg:flex"
                />
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl transition-all duration-300 ease-out text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="p-3 rounded-xl transition-all duration-300 ease-out text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-3 rounded-xl transition-all duration-300 ease-out text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md ml-2"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Enhanced Mobile Menu */}
        <div
          ref={menuRef}
          className={`lg:hidden fixed top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl border-t border-[var(--color-border)] transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40 overflow-y-auto ${menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
            }`}
          style={{ maxHeight: "calc(100vh - 100%)" }}
        >
          <ul className="py-4">
            {menuItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                location={location}
                isMobile={true}
                closeMenu={closeMenu}
                navRef={navRef}
                categoryData={categoryData}
              />
            ))}

            {/* Mobile user menu */}
            <li className="px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-4">
                {/* Admin Panel icon in mobile menu - only show if logged in AND role is admin */}
                {isLoggedIn && userrole && (
                  <UserMenuIcon
                    to="/admin"
                    Icon={UserCog}
                    closeMenu={closeMenu}
                    className="flex-1 justify-center"
                  />
                )}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex-1 p-3 rounded-xl transition-all duration-300 ease-out text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md flex items-center justify-center"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      closeMenu();
                    }}
                    className="flex-1 p-3 rounded-xl transition-all duration-300 ease-out text-[var(--color-text)] hover:bg-gradient-to-r hover:from-[var(--color-primary-light)]/30 hover:to-[var(--color-primary-light)]/20 hover:text-[var(--color-primary)] hover:shadow-md flex items-center justify-center"
                  >
                    <User className="h-5 w-5" />
                  </button>
                )}
              </div>
            </li>
          </ul>
        </div>

        {/* Enhanced Search Panel */}
        {shouldShowSearch && (
          <div
            ref={searchRef}
            className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-[var(--color-border)] transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40 ${searchOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
              }`}
          >
            <div className="container mx-auto px-4 py-6">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for gemstones, categories, or products..."
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Loading indicator */}
                {isSearching && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-primary)]"></div>
                  </div>
                )}

                {/* Clear search button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </form>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="max-w-2xl mx-auto mt-4 bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden">
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-[var(--color-primary-light)]/20 cursor-pointer transition-colors duration-200"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="font-medium text-[var(--color-text)]">
                          {result.name}
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          {result.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="max-w-2xl mx-auto mt-4 text-center text-[var(--color-text-muted)]">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login/Signup Modal */}
      {showLogin && (
        <LoginSignup
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            const token = localStorage.getItem("authToken") || localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (token && userData) {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              setIsLoggedIn(true);
              setUserrole(parsedUser.role?.toLowerCase() === "admin");

              // Fetch cart and wishlist data after successful login
              fetchCart();
              fetchWishlist();
            }
            setShowLogin(false);
          }}
        />
      )}

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className={`h-24 transition-all duration-500 ease-out ${scrolled ? "h-20" : "h-24"}`}></div>
    </>
  );
}