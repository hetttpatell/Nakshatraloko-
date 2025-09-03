// Slideshow.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

// Slides data (passed as props or imported)
const slides = [
  {
    id: 1,
    image: "/testing.jpeg",
    title: "Dive into Brilliance",
    description: "Discover the sparkle of handpicked gemstones crafted in 925 Silver.",
    buttons: [
      { text: "Explore Collection", link: "#", primary: true },
      { text: "Know More", link: "#" },
    ],
  },
  {
    id: 2,
    image: "/testing.jpeg",
    title: "Luxury Beyond Time",
    description: "Experience timeless elegance with our exclusive signature designs.",
    buttons: [
      { text: "Shop Now", link: "#", primary: true },
      { text: "Learn More", link: "#" },
    ],
  },
  {
    id: 3,
    image: "/testing.jpeg",
    title: "Ocean Blue Gemstone",
    description: "Our signature ocean blue gemstone brings beauty to every moment.",
    buttons: [
      { text: "View Collection", link: "#", primary: true },
      { text: "Details", link: "#" },
    ],
  },
  {
    id: 4,
    image: "/testing.jpeg",
    title: "Elegance Redefined",
    description: "Crafted with precision, made for those who value true beauty.",
    buttons: [
      { text: "Explore Now", link: "#", primary: true },
      { text: "Discover", link: "#" },
    ],
  },
];

// Animation variants for Framer Motion
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  }),
};

const Slideshow = ({ slides, autoPlay = true, autoPlayInterval = 5000 }) => {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const timerRef = useRef(null);
  
  // Preload current and next image for smooth transitions
  const preloadImages = useCallback(() => {
    const nextIndex = (current + 1) % slides.length;
    [current, nextIndex].forEach((i) => {
      const img = new Image();
      img.src = slides[i].image;
    });
  }, [current, slides]);

  useEffect(() => {
    preloadImages();
  }, [current, preloadImages]);

  // Autoplay logic
  useEffect(() => {
    if (!autoPlay) return;

    timerRef.current = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    // Cleanup to avoid memory leaks
    return () => clearInterval(timerRef.current);
  }, [current, autoPlay, autoPlayInterval]);

  // Change slide
  const paginate = (newDirection) => {
    setCurrent(([prevIndex]) => {
      const newIndex = (prevIndex + newDirection + slides.length) % slides.length;
      return [newIndex, newDirection];
    });
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="relative w-full overflow-hidden" {...handlers}>
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute w-full h-full flex flex-col items-center justify-center bg-black/30 text-white"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-[500px] md:h-[700px] object-cover"
            loading="lazy" // Lazy load offscreen images
          />
          <div className="absolute text-center px-4 md:px-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{slides[current].title}</h2>
            <p className="mb-6 text-lg md:text-2xl">{slides[current].description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {slides[current].buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href={btn.link}
                  className={`px-6 py-2 rounded-md font-semibold ${
                    btn.primary
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white/80 hover:bg-white text-black"
                  } transition-colors duration-300`}
                >
                  {btn.text}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent([idx, idx > current ? 1 : -1])}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return <Slideshow slides={slides} autoPlay={true} autoPlayInterval={4000} />;
}
