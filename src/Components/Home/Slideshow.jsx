import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/testing.jpeg",
    title: "Dive into Brilliance",
    description:
      "Discover the sparkle of handpicked gemstones crafted in 925 Silver.",
    buttons: [
      { text: "Explore Collection", link: "#", primary: true },
      { text: "Know More", link: "#" },
    ],
  },
  {
    id: 2,
    image: "/testing.jpeg",
    title: "Luxury Beyond Time",
    description:
      "Experience timeless elegance with our exclusive signature designs.",
    buttons: [
      { text: "Shop Now", link: "#", primary: true },
      { text: "Learn More", link: "#" },
    ],
  },
  {
    id: 3,
    image: "/testing.jpeg",
    title: "Ocean Blue Gemstone",
    description:
      "Our signature ocean blue gemstone brings beauty to every moment.",
    buttons: [
      { text: "View Collection", link: "#", primary: true },
      { text: "Details", link: "#" },
    ],
  },
  {
    id: 4,
    image: "/testing.jpeg",
    title: "Elegance Redefined",
    description:
      "Crafted with precision, made for those who value true beauty.",
    buttons: [
      { text: "Explore Now", link: "#", primary: true },
      { text: "Discover", link: "#" },
    ],
  },
];

export default function Slideshow() {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + length) % length );

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [length, current]);

  return (
    <div className="relative w-full h-[680px] overflow-hidden shadow-2xl 
    rounded-b-[10px]">
      <AnimatePresence>
        <motion.div
          key={slides[current].id}
          className="absolute w-full h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Bottom Fade Finish */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Text Content */}
          <div className="absolute top-1/3 left-12 text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-xl">
              {slides[current].title}
            </h1>
            <p className="text-lg mb-6 text-gray-200 drop-shadow-md">
              {slides[current].description}
            </p>
            <div className="flex gap-4">
              {slides[current].buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.link}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition ${
                    btn.primary
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-transparent border border-white hover:bg-white hover:text-black"
                  }`}
                >
                  {btn.text}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
            <button
         onClick={prevSlide}
         className="hidden"
       >
         <ChevronLeft size={28} />
       </button>
       <button
         onClick={nextSlide}
         className="hidden"
       >
         <ChevronRight size={28} />
       </button>


      {/* Dots Navigation inside pill-shaped container */}
      <div className="absolute bottom-4 w-full flex justify-center">
        <div className="flex gap-3 bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm shadow-md">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index
                  ? "bg-yellow-500"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
