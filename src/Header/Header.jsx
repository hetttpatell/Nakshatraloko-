import React, { useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, User, ChevronDown, ChevronRight } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";
import LoginSignup from "../Components/Login/Login";

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
  { to: "/cart", icon: ShoppingCart, badgeType: "cart" },
  { to: "/wishlist", icon: Heart, badgeType: "wishlist" },
  { to: "/account", icon: User },
];

// ---------- HELPER COMPONENTS ----------
const Badge = ({ count }) =>
  count > 0 && (
    <span
      className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-semibold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm transition-transform duration-200 hover:scale-110"
    >
      {count}
    </span>
  );

const NavItem = ({ item, location }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeout = useRef(null);

  const handleMouseEnter = () => {
    if (item.subMenu) {
      clearTimeout(closeTimeout.current);
      setDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (item.subMenu) {
      closeTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
    }
  };

  const isParentActive =
    item.subMenu && item.subMenu.some((sub) => location.pathname.startsWith(sub.to));

  return (
    <li className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-1 px-3 py-2 transition-colors duration-300 relative rounded ${
            isActive || isParentActive
              ? "text-orange-400"
              : "text-white group-hover:text-orange-400"
          }`
        }
      >
        {item.label}
        {item.subMenu && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              dropdownOpen ? "rotate-180 text-orange-400" : "rotate-0"
            }`}
          />
        )}
        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
      </NavLink>

      {item.subMenu && (
        <ul
          className={`absolute left-0 mt-2 bg-white rounded shadow-lg min-w-[180px] transform transition-all duration-300 ${
            dropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {item.subMenu.map((sub) => (
            <li key={sub.label}>
              <NavLink
                to={sub.to}
                className={({ isActive }) =>
                  `block px-5 py-2 text-sm font-normal ${
                    isActive ? "bg-orange-100 text-orange-600" : "text-gray-900 hover:bg-orange-100"
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

const UserMenuIcon = ({ to, Icon, badgeCount, closeMenu }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative p-2 rounded-full transition-colors duration-300 ${
        isActive ? "text-orange-400" : "hover:text-orange-400"
      }`
    }
    onClick={closeMenu}
  >
    <Icon className="h-6 w-6 stroke-[1.5]" />
    {badgeCount > 0 && <Badge count={badgeCount} />}
  </NavLink>
);

// ---------- MAIN HEADER ----------
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const closeMenu = () => setMenuOpen(false);

  const isLoggedIn = false; // toggle login state

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-navy)]/95 backdrop-blur-md shadow-md border-b border-white/10">
        <nav className="relative w-full py-4 px-6 lg:px-12 flex items-center">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-white font-bold text-2xl tracking-wide cursor-pointer flex-shrink-0"
            onClick={closeMenu}
          >
            Nakshatraloko
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex flex-grow justify-center space-x-12 font-medium text-white menu-font text-xl">
            {menuItems.map((item) => (
              <NavItem key={item.label} item={item} location={location} />
            ))}
          </ul>

          {/* Desktop User Icons / Login */}
          <div className="hidden lg:flex items-center space-x-5 text-white flex-shrink-0">
            {isLoggedIn ? (
              userMenuItems.map(({ to, icon: Icon, badgeType }, idx) => (
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
                />
              ))
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 py-2 rounded bg-orange-400 text-white font-semibold hover:bg-orange-500 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger and Login */}
          <div className="lg:hidden flex items-center space-x-4 relative z-20 ml-auto">
            {!isLoggedIn && (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded bg-orange-400 text-white font-semibold hover:bg-orange-500 transition"
              >
                Login
              </button>
            )}

            <button
              aria-label="Toggle Menu"
              className="text-white focus:outline-none ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden fixed top-[64px] left-0 w-full bg-[var(--color-navy)]/95 backdrop-blur-md shadow-md transform transition-all duration-300 ease-in-out ${
              menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <ul className="flex flex-col items-center py-6 space-y-6 text-white font-medium text-lg px-4">
              {menuItems.map((item) => (
                <li key={item.label} className="w-full text-center">
                  {item.subMenu ? (
                    <>
                      <button
                        className="flex items-center justify-center gap-1 w-full text-white font-medium"
                        onClick={() =>
                          setOpenSubMenu(openSubMenu === item.label ? null : item.label)
                        }
                        aria-expanded={openSubMenu === item.label}
                      >
                        {item.label}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-300 ${
                            openSubMenu === item.label ? "rotate-90 text-orange-400" : ""
                          }`}
                        />
                      </button>
                      <ul
                        className={`overflow-hidden transition-all duration-300 ${
                          openSubMenu === item.label ? "max-h-40 mt-2" : "max-h-0"
                        }`}
                      >
                        {item.subMenu.map((sub) => (
                          <li key={sub.label}>
                            <NavLink
                              to={sub.to}
                              className="block py-2 text-sm text-orange-200 hover:text-orange-400"
                              onClick={closeMenu}
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      className="flex items-center justify-center gap-1 w-full text-white font-medium"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}

              {/* Mobile User Icons when logged in */}
              {isLoggedIn && (
                <div className="flex items-center space-x-4 pt-4">
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
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      {showLogin && <LoginSignup onClose={() => setShowLogin(false)} />}
    </>
  );
}
