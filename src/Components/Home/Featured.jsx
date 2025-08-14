import React from "react";

export default function Featured() {
  const Heading = {
    first: "Featured",
    second: "Items",
    message:
      "Handpicked selections crafted with precision and elegance, curated just for you.",
  };

  const products = [
    {
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
    {
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
    {
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
    {
      name: "14KT Yellow Gold Diamond Hoop Earrings",
      category: "Women | Earrings",
      price: "₹ 4,554.00",
      discount: "-30%",
      img: "/testing.jpeg",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-r mt-4 from-gray-900 via-gray-800 to-gray-900 py-16">
        {/* Heading */}
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-serif font-bold relative inline-block hover:scale-105 transition-transform duration-300">
            {Heading.first}{" "}
            <span className="text-yellow-400">{Heading.second}</span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-24 h-1 bg-yellow-400 rounded-full"></span>
          </h2>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
            {Heading.message}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-[#fdf3e7] py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border rounded-md overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
            >
              {/* Image + Discount Badge */}
              <div className="relative aspect-square">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-blue-900 text-white text-xs font-semibold px-2 py-1 rounded">
                  {product.discount}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">{product.category}</p>
                <p className="text-blue-900 font-semibold mt-2">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
