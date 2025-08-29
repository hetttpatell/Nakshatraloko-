import React, { useState } from "react";
import Input from "../Input/Input";
import { Link } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import Imagepreview from "./Imagepreview";

export default function Gemstones() {
  const [filters, setFilters] = useState({
    Ratings: "",
    Categories: "",
    Price: "",
    Features: "",
  });

  const products = [
    { id: 1, name: "Stellar Dainty Diamond Hoop id-1", category: "Women | Earrings", price: "₹ 4,554.00", feature: "Energy Booster", img: "/s3.jpeg", rating: 4.5 },
    { id: 2, name: "Another Product Name id-2", category: "Men | Earrings", price: "₹ 5,554.00", feature: "Inner Strength", img: "/s2.jpeg", rating: 3.8 },
    { id: 3, name: "Another Product Name id-3", category: "Women | Earrings", price: "₹ 3,554.00", feature: "Peace & Harmony", img: "/s4.jpeg", rating: 5 },
    { id: 4, name: "Another Product Name id-4", category: "Men | Earrings", price: "₹ 4,054.00", feature: "Inner Strength", img: "/s1.jpeg", rating: 4.2 },
    { id: 5, name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Women | Earrings", price: "₹ 2,554.00", feature: "Peace & Harmony", img: "/s3.jpeg", rating: 3.5 },
    { id: 6, name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Men | Earrings", price: "₹ 5,554.00", feature: "Inner Strength", img: "/s2.jpeg", rating: 4 },
    { id: 7, name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Women | Earrings", price: "₹ 2,554.00", feature: "Energy Booster", img: "/s1.jpeg", rating: 2.5 },
    { id: 8, name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Men | Earrings", price: "₹ 3,554.00", feature: "Energy Booster", img: "/s4.jpeg", rating: 4.8 },
    { id: 9, name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Unisex | Earrings", price: "₹ 1,554.00", feature: "Peace & Harmony", img: "/s2.jpeg", rating: 4.1 },
    { id: 10, name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Unisex | Earrings", price: "₹ 2,554.00", feature: "Inner Strength", img: "/s2.jpeg", rating: 3.9 },
    { id: 11, name: "Crystal Aura Studs", category: "Women | Earrings", price: "₹ 999.00", feature: "Energy Booster", img: "/s1.jpeg", rating: 1.8 },
    { id: 12, name: "Bold Onyx Studs", category: "Men | Earrings", price: "₹ 1,899.00", feature: "Inner Strength", img: "/s2.jpeg", rating: 2.2 },
    { id: 13, name: "Tranquil Pearl Drops", category: "Unisex | Earrings", price: "₹ 3,099.00", feature: "Peace & Harmony", img: "/s3.jpeg", rating: 3.2 },
    { id: 14, name: "Royal Sapphire Hoops", category: "Women | Earrings", price: "₹ 4,999.00", feature: "Energy Booster", img: "/s4.jpeg", rating: 4.9 },
    { id: 15, name: "Emerald Mystic Studs", category: "Men | Earrings", price: "₹ 5,899.00", feature: "Inner Strength", img: "/s1.jpeg", rating: 5 },
  ];

  const optionsfilter = {
    Ratings: ["1 - 2", "2 - 3", "3 - 4", "4 - 5"],
    Categories: ["Men | Earrings", "Women | Earrings", "Unisex | Earrings"],
    Price: ["999 - 1999", "1999 - 2999", "2999 - 3999", "3999 - 4999", "4999 - 5999"],
    Features: ["Inner Strength", "Peace & Harmony", "Energy Booster"],
  };

  // 🔥 Pro Filtering
  const filteredProducts = products.filter((product) => {
    let matches = true;

    // Ratings
    if (filters.Ratings) {
      const [min, max] = filters.Ratings.split(" - ").map(Number);
      if (!(product.rating >= min && product.rating <= max)) {
        matches = false;
      }
    }

    // Categories
    if (filters.Categories) {
      if (product.category !== filters.Categories) {
        matches = false;
      }
    }

    // Price
    if (filters.Price) {
      const [min, max] = filters.Price.split(" - ").map(Number);
      const price = Number(product.price.replace(/[^\d]/g, ""));
      if (!(price >= min && price <= max)) {
        matches = false;
      }
    }

    // Features
    if (filters.Features) {
      if (product.feature !== filters.Features) {
        matches = false;
      }
    }

    return matches;
  });

  // 🔄 Reset Filters
  const clearFilters = () => {
    setFilters({ Ratings: "", Categories: "", Price: "", Features: "" });
  };

  return (
    <>
      <Imagepreview />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]">
        
        {/* Filters Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-10">
          {Object.keys(optionsfilter).map((item) => (
            <div key={item} className="w-full">
              <Input
                type="select"
                options={optionsfilter[item]}
                value={filters[item]}
                className="w-full rounded-xl border border-[#e0dcb8] 
                  bg-gradient-to-r from-[#fafaf0] to-[var(--color-bg)]
                  px-4 py-2 text-sm shadow-sm hover:shadow-md
                  focus:border-[#c5c09c] focus:ring-2 focus:ring-[#e0dcb8]/60
                  transition duration-300 font-medium text-gray-700"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [item]: e.target.value,
                  }))
                }
                placeholder={`Choose from ${item}`}
              />
            </div>
          ))}
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="mb-8 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition"
        >
          Clear All Filters
        </button>

        {/* Products Section */}
        <div className="bg-[var(--color-bg)] py-12 w-full">
          {filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-240">
              <p className="text-gray-500 text-lg mb-140 font-semibold">
                No products found matching your filters. Try different filters.
              </p>
            </div>
          ) : (
            <div className="max-w-8xl h-max mx-auto grid grid-cols-2 gap-4 lg:gap-12 rounded-2xl sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white border rounded-md overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition duration-400 block"
                >
                  {/* Image + Feature Badge */}
                  <div className="relative w-full aspect-square sm:aspect-[4/5] overflow-hidden">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-0">
                      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-[11px] sm:text-xs font-semibold tracking-wide px-3 py-1 rounded-r-full shadow-lg backdrop-blur-sm">
                        {product.feature}
                      </span>
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">{product.category}</p>

                    {/* Price + Rating */}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-blue-900 font-semibold text-sm sm:text-base">{product.price}</p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const fullStars = Math.floor(product.rating);
                          const hasHalfStar = product.rating % 1 >= 0.5;
                          if (i < fullStars) {
                            return <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
                          } else if (i === fullStars && hasHalfStar) {
                            return <StarHalf key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
                          } else {
                            return <Star key={i} className="w-4 h-4 text-gray-300" />; // empty star
                          }
                        })}
                        <span className="ml-1 text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
