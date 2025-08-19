import React from "react";
import { Link } from "react-router-dom";

export default function Featured() {
  const Heading = {
    first: "Featured",
    second: "Items",
    message:
      "Handpicked selections crafted with precision and elegance, curated just for you.",
  };

  const products = [
    {
      id: 1,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
    {
      id: 2,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
    {
      id: 3,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
    {
      id: 4,
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
  ];

  return (
    <>
      
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center text-white">

            <h2
              className="group text-4xl md:text-5xl font-serif font-bold relative 
              inline-block hover:scale-105 transition-transform duration-300"
            >
              {Heading.first}
              <span className="text-yellow-400 ml-3">{Heading.second}</span>

              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-[-10px]
                w-24 h-1 bg-yellow-400 rounded-full 
                transition-all duration-500 ease-in-out group-hover:w-40"
              ></span>
            </h2>

            <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
              {Heading.message}
            </p>
          </div>
        </div>
      

      {/* {Product Grid} */}
      <div className="bg-[var(--color-bg)] py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-7 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white border rounded-md overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition duration-300 block"
            >
              {/* Image + Discount Badge */}
              <div className="relative w-full aspect-square sm:aspect-[4/5]">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-blue-900 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg">
                  {product.discount}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">{product.category}</p>
                <p className="text-blue-900 font-semibold mt-2 sm:mt-3 text-sm sm:text-base">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </>
  );
}
