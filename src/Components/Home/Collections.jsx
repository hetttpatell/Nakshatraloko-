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
      <div className="mt-100 h-max">
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
              <Link key={index} to={item.path}>
                <div className="aspect-square">
                  <img
                    key={index}
                    src={item.img}
                    alt={item.name}
                    className="h-80 w-full lg:h-170 object-cover rounded-2xl shadow-lg
             transform transition duration-500 ease-out
             hover:scale-105 hover:shadow-2xl hover:-translate-y-2"/>
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4 
                  translate-y-full group-hover:translate-y-0 transition duration-500 ease-out">
                    <div
                      className="absolute bottom-0 left-0 w-full 
      bg-gradient-to-t from-black/70 via-black/50 to-transparent 
      text-white p-4 
      translate-y-full opacity-0
      group-hover:translate-y-0 group-hover:opacity-100
      transition-all duration-500 ease-out rounded-b-2xl"
                    >
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm">Some description about this image.</p>
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
