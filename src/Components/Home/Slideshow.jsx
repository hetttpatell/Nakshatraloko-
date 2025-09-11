import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/d.jpeg",
    title: "Dive into Brilliance",
    description: "Discover the sparkle of handpicked gemstones crafted in 925 Silver.",
    buttons: [
      { text: "Explore Collection", link: "#", primary: true },
      { text: "Know More", link: "#" },
    ],
  },
  {
    id: 2,
    image: "/d1.jpeg",
    title: "Luxury Beyond Time",
    description: "Experience timeless elegance with our exclusive signature designs.",
    buttons: [
      { text: "Shop Now", link: "#", primary: true },
      { text: "Learn More", link: "#" },
    ],
  },
  {
    id: 3,
    image: "/d.jpeg",
    title: "Ocean Blue Gemstone",
    description: "Our signature ocean blue gemstone brings beauty to every moment.",
    buttons: [
      { text: "View Collection", link: "#", primary: true },
      { text: "Details", link: "#" },
    ],
  },
  {
    id: 4,
    image: "/d1.jpeg",
    title: "Elegance Redefined",
    description: "Crafted with precision, made for those who value true beauty.",
    buttons: [
      { text: "Explore Now", link: "#", primary: true },
      { text: "Discover", link: "#" },
    ],
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const length = slides.length;

  // Autoplay logic
  useEffect(() => {
    let interval;
    if (autoPlay) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, length]);

  // Preload next image
  useEffect(() => {
    const nextIndex = (current + 1) % length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [current]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + length) % length);
  }, [length]);

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  // Swipe support for mobile
  const swipeThreshold = 50;
  const handleDragEnd = (event, info) => {
    if (info.offset.x > swipeThreshold) prevSlide();
    else if (info.offset.x < -swipeThreshold) nextSlide();
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[500px] md:h-[880px] overflow-hidden rounded-b-[10px] shadow-2xl">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slides[current].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute w-full h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute bottom-0 w-full h-20 sm:h-28 md:h-32 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-15 sm:bottom-12 md:bottom-16 left-4 sm:left-8 md:left-12 text-white max-w-xs sm:max-w-md md:max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-xl"
            >
              {slides[current].title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-200 drop-shadow-md"
            >
              {slides[current].description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 flex-wrap"
            >
              {slides[current].buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href={btn.link}
                  className={`px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-lg font-semibold shadow-lg transition ${
                    btn.primary
                      ? "bg-[var(--color-primary)] text-black hover:bg-[var(--color-primary-light)]"
                      : "bg-transparent border border-white hover:bg-white hover:text-black"
                  }`}
                >
                  {btn.text}
                </a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-2 sm:bottom-4 w-full flex justify-center">
        <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md">
          <button
            onClick={prevSlide}
            className="p-1 sm:p-2 text-white hover:text-[var(--color-primary)] transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex gap-2 sm:gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  current === index 
                    ? "bg-[var(--color-primary)]" 
                    : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="p-1 sm:p-2 text-white hover:text-[var(--color-primary)] transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="p-1 sm:p-2 text-white hover:text-[var(--color-primary)] transition-colors ml-1 sm:ml-2"
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoPlay ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}