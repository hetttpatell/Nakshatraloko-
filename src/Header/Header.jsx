import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, Heart, User } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = ["Home", "GEMSTONES", "CUSTOM", "CATEGORIES", "FAQs", "BLOGS"];
  const UsermenuItems = [
    { to: "/cart", icon: ShoppingCart },
    { to: "/wishlist", icon: Heart },
    { to: "/account", icon: User }
  ]

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-navy)] shadow-md">
      <nav className="relative w-full py-4 flex items-center justify-between px-6">
        
        {/* Logo - Left */}
        <div className="text-white font-bold text-2xl z-20">
          Nakshatraloko
        </div>

        {/* Desktop Menu - Center */}
        <ul className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-20 font-medium text-white menu-font">
          {menuItems.map((item) => (
            <li key={item}>
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `transition-colors duration-200 px-3 py-2 h-10 flex items-center
                  ${isActive
                    ? "text-orange-400"
                    : "hover:text-orange-400"}`
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side Icons (Desktop) */}
       
        <div className="hidden mr-10 lg:flex items-center space-x-8 text-white">
  {UsermenuItems.map(({ to, icon: Icon }, index) => (
    <NavLink
      key={index}
      to={to}
      className="hover:text-orange-400 transition-colors duration-200"
    >
      <Icon className="h-6 w-6 stroke-[1.5]" />
    </NavLink>
  ))}
</div>


        {/* Hamburger Menu - Mobile */}
        <button
          className="lg:hidden text-white focus:outline-none z-20 mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-[var(--color-navy)] transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col items-center py-4 space-y-4 menu-font text-white">
            {menuItems.map((item) => (
              <li key={item}>
                <NavLink
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded-md transition-colors duration-200 ${
                      isActive
                        ? "text-orange-400"
                        : "hover:text-orange-400 hover:bg-white hover:bg-opacity-10"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </NavLink>
              </li>
            ))}

            {/* Mobile Icons */}
            <div className="flex items-center space-x-5 pt-4">
              <NavLink to="/cart" className="hover:text-orange-400 transition-colors duration-200">
                <ShoppingCart className="h-6 w-6 stroke-[1.5]" />
              </NavLink>
              <NavLink to="/wishlist" className="hover:text-orange-400 transition-colors duration-200">
                <Heart className="h-6 w-6 stroke-[1.5]" />
              </NavLink>
              <NavLink to="/account" className="hover:text-orange-400 transition-colors duration-200">
                <User className="h-6 w-6 stroke-[1.5]" />
              </NavLink>
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
}
