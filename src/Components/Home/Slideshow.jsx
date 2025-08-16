import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const length = slides.length;

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % length);
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + length) % length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  const swipeConfidenceThreshold = 100;

  const handleDragEnd = (event, info) => {
    if (info.offset.x > swipeConfidenceThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeConfidenceThreshold) {
      nextSlide();
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] md:h-[880px] shadow-2xl rounded-b-[10px] overflow-hidden">
      <AnimatePresence custom={direction}>
        <motion.div
          key={slides[current].id}
          className="absolute w-full h-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", duration: 1}}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-0 w-full h-20 sm:h-28 md:h-32 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute top-1/4 sm:top-1/3 left-4 sm:left-8 md:left-12 text-white max-w-xs sm:max-w-md md:max-w-lg max-h-[60%] overflow-y-auto pr-2">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-xl">
              {slides[current].title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-200 drop-shadow-md">
              {slides[current].description}
            </p>
            <div className="flex gap-4 flex-wrap">
              {slides[current].buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.link}
                  className={`px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-lg font-semibold shadow-lg transition ${
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

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-center">
        <div className="flex gap-2 sm:gap-3 bg-black/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-sm shadow-md">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
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
