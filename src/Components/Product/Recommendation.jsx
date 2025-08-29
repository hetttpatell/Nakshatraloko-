import React from "react";
import { Link } from "react-router-dom";
import HelpingForm from "../Home/HelpingForm"

const Recommendation = ({ permission = true, 
  Slogan = "Discover more products curated just for you — blending quality, design, and style.",
  Text = "You May Also",
  HighlightText = "Like",
  products = []
}) => {
  return (
    <div className="bg-[var(--color-productbg)] min-h-screen font-serif py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Elegant Section Heading */}
        {permission && (
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-3">
            Our Picks For You
          </p>
        )}
        <h2
          className="relative inline-block text-3xl sm:text-4xl md:text-5xl font-serif font-bold 
          text-blue-900 leading-tight group"
        >
          {Text}
          {permission &&<span className="text-yellow-500">{HighlightText}</span>}

          {/* Gradient underline bar */}
          <span
            className="block mx-auto mt-4 h-1 w-20 rounded-full 
            bg-gradient-to-r from-blue-900 via-yellow-500 to-blue-900 
            transition-all duration-500 ease-in-out group-hover:w-40"
          ></span>
        </h2>

        {/* Subheading description */}
        <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          {Slogan}
        </p>

        {/* Products Grid */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm 
                hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {/* Product Image + Optional Discount Badge */}
                <div className="relative w-full aspect-square sm:aspect-[4/5]">
                  <img
                    src={
                      product.img || product.image || product.images?.[0]?.src || "/fallback.jpg"
                    } 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-blue-900 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded shadow-md">
                      {product.discount}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {product.category || product.brand || "Uncategorized"}
                  </p>
                  <p className="text-blue-900 font-semibold mt-2 sm:mt-3 text-sm sm:text-base">
                    {product.price ? `₹ ${product.price}` : "Price on Request"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No recommendations available</p>
          )}
        </div>
      </div>
      {permission && <HelpingForm />}
    </div>
  );
};

export default Recommendation;
