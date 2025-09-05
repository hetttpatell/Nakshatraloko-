// components/SearchAndFilterBar.jsx
import React from "react";
import { FaSearch, FaChevronDown, FaFilter, FaTimes } from "react-icons/fa";

const SearchAndFilterBar = ({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  statusFilter,
  setStatusFilter,
  brandOptions,
  className = "",
  showFilters = true,
  onClearFilters
}) => {
  const hasActiveFilters = brandFilter !== "all" || statusFilter !== "all" || searchTerm !== "";

  const handleClearFilters = () => {
    setSearchTerm("");
    setBrandFilter("all");
    setStatusFilter("all");
    if (onClearFilters) onClearFilters();
  };

  return (
    <div className={`flex flex-col gap-4 mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, brand, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>
        
        {/* Filter Controls */}
        {showFilters && (
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="all">All Brands</option>
                {brandOptions.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>
            
            <div className="relative">
              <select
                className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                title="Clear all filters"
              >
                <FaTimes className="text-xs" />
                <span>Clear</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaFilter className="text-gray-400" />
          <span>Active filters:</span>
          
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Search: "{searchTerm}"
            </span>
          )}
          
          {brandFilter !== "all" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Brand: {brandFilter}
            </span>
          )}
          
          {statusFilter !== "all" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Status: {statusFilter === "inStock" ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterBar;