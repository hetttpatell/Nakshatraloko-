import React from "react";
import { Link } from "react-router-dom";

const Recommendation = ({ products }) => {
  return (
    <div className="bg-[var(--color-bg)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {/* Image + Optional Discount Badge */}
              <div className="relative w-full aspect-square sm:aspect-[4/5]">
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-blue-900 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">{product.brand}</p>
                <p className="text-blue-900 font-semibold mt-2 sm:mt-3 text-sm sm:text-base">
                  ₹ {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
