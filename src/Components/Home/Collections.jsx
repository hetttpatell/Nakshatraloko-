import { Link } from "react-router-dom";
import React from "react";

function Collection() {
  const Heading = {
    first: "Browse",
    second: "Our Products",
    message: "Discover stones that match your cosmic energy.",
  };

  // Fixed data structure
  const collections = [
    { name: "Necklace", img: "/abot.jpg", path: "/necklace" },
    { name: "Rudraksh", img: "/abot.jpg", path: "/rudraksh" },
    { name: "Gemstones", img: "/abot.jpg", path: "/gemstones" },
    { name: "Pandent", img: "/abot.jpg", path: "/pandent" },
  ];

  return (
    <>
      <div className="mt-60 lg:mt-90">
        {/* Heading Section */}
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

            <p className="mt-6 text-gray-300 font-lora text-lg max-w-2xl mx-auto">
              {Heading.message}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center mt-20 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map((item, index) => (
              <Link key={index} to={item.path} className="group block">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-80 w-full lg:h-170 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 z-10 flex items-end">
                    <div
                      className="w-full h-50 lg:h-100 p-4
                                  bg-gradient-to-t from-black/70 via-black/50 to-transparent
                                  translate-y-6 opacity-0
                                  transition-all duration-500 ease-out
                                  group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <h3 className="text-white text-xl lg:text-4xl mt-25 lg:mt-70 font-semibold font-lora">{item.name}</h3>
                      <p className="text-white/90 font-inter text-sm">Some description about this image.</p>
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

export default Collection;
