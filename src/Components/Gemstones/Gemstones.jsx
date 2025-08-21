import React, { useState } from "react";
import Input from "../Input/Input";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import { Star, StarHalf, StarOff } from "lucide-react";
import Imagepreview from "./Imagepreview";


export default function Gemstones() {
  const [filters, setFilters] = useState({
    filter1: "",
    filter2: "",
    filter3: "",
    filter4: ""
  });

  const products = [
    {
      id: 1,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Healing Stone",
      img: "/s3.jpeg",
      rating: 4.5,
    },
    {
      id: 2,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Faster Growth",
      img: "/s2.jpeg",
      rating: 3.8,
    },
    {
      id: 3,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Positive Vibes",
      img: "/s4.jpeg",
      rating: 5,
    },
    {
      id: 4,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Good Fortune",
      img: "/s1.jpeg",
      rating: 4.2,
    },
    {
      id: 5,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Attracts Wealth",
     img: "/s3.jpeg",
      rating: 3.5,
    },
    {
      id: 6,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Spiritual Balance",
      img: "/s2.jpeg",
      rating: 4,
    },
    {
      id: 7,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Emotional Healing",
      img: "/s1.jpeg",
      rating: 2.5,
    },
    {
      id: 8,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Energy Booster",
      img: "/s4.jpeg",
      rating: 4.8,
    },
    {
      id: 9,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Peace & Harmony",
      img: "/s2.jpeg",
      rating: 4.1,
    },
    {
      id: 10,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      feature: "Inner Strength",
      img: "/s2.jpeg",
      rating: 3.9,
    },
  ];



  const optionsfilter = {
    filter1: ["Apple", "Banana", "Orange"],
    filter2: ["Apple1", "Banana1", "Orange1"],
    filter3: ["Apple2", "Banana2", "Orange2"],
    filter4: ["Apple3", "Banana3", "Orange3"],
  };

  return (
    <>
    <Imagepreview />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]">
        {/* Filters Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-10">
          {Object.keys(optionsfilter).map((item) => (
            <Input
              key={item}
              type="select"
              options={optionsfilter[item]}
              value={filters[item]}
              className="rounded-xl border border-[#e0dcb8] 
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
              placeholder={`Choose a ${item}`}
            />
          ))}
        </div>


        {/* Products Section */}
        <div className="bg-[var(--color-bg)] py-12 w-full">
          <div className="max-w-8xl h-max mx-auto grid grid-cols-2  gap-4 lg:gap-12 rounded-2xl sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white border rounded-md overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition duration-400 block"
              >
                {/* Image + Discount Badge */}
                <div className="relative w-full aspect-square sm:aspect-[4/5] overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Label from background */}
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

                  {/* ⭐ Price + Rating Row */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <p className="text-blue-900 font-semibold text-sm sm:text-base">
                      {product.price}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const fullStars = Math.floor(product.rating);
                        const hasHalfStar = product.rating % 1 >= 0.5;

                        if (i < fullStars) {
                          return (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-yellow-500"
                            />
                          );
                        } else if (i === fullStars && hasHalfStar) {
                          return (
                            <StarHalf
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-yellow-500"
                            />
                          );
                        }
                      })}
                      <span className="ml-1 text-xs text-gray-500">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

            ))}
          </div>
        </div>
      </div>
    </>
  );
}
