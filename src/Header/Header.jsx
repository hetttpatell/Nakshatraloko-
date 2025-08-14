import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = ["Home","GEMSTONES", "CUSTOM", "CATAGORIES", "FAQs","BLOGS"];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-navy)] shadow-md">
  <nav className="relative w-full py-4 flex items-center justify-between">
    {/* Logo - Left */}
    <div className="text-white font-bold text-2xl pl-6 z-20">
      Nakshatraloko
    </div>

        {/* Desktop Menu - Center */}
  <ul className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-20 font-medium text-white menu-font">
  {menuItems.map((item) => (
    <li key={item}>
      <NavLink
        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
        className={({ isActive }) =>
          `transition-transform duration-200 px-3 py-2 h-10 flex items-center
          ${isActive
            ? "text-orange-400"
            : "hover:text-orange-400 hover:scale-110"}`
        }
      >
        {item}
      </NavLink>
    </li>
  ))}
</ul>

        {/* Hamburger Menu - Mobile */}
        <button
          className="lg:hidden text-white focus:outline-none z-20 mr-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
           <ul className={`lg:hidden absolute top-full left-0 w-full bg-[var(--color-navy)] transition-all duration-300 ${isOpen ? "block" : "hidden"} menu-font text-white`}>
  {menuItems.map((item) => (
    <li key={item}>
      <NavLink
        to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
        className={({ isActive }) =>
          `transition-transform duration-200 px-3 py-2 h-10 flex items-center
          ${isActive
            ? "text-orange-400"
            : "hover:text-orange-400 hover:scale-110"}`
        }
      >
        {item}
      </NavLink>
    </li>
  ))}
</ul>

        </div>
      </nav>
    </header>
  );
}
