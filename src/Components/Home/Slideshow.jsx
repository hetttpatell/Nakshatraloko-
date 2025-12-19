import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

// Default slide data
const DEFAULT_SLIDE = {
  productId: 72,
  productName: "Featured Product",
  Description: "Discover our exclusive collection.",
  ProductRatings: "5",
  primaryImage: "/product-1758482729279-741274473.jpeg",
  imageAlt: "Featured Product",
  Price: "55.00",
  DummyPrice: "655.00"
};

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const length = slides.length;

  // Transform product data to slideshow format
  const transformProductToSlide = (product, index) => {
    let imageUrl = product.primaryImage?.trim() || "";

   
    if (imageUrl.startsWith("http")) {
      // Already a full URL
      imageUrl = imageUrl.replace(/([^:]\/)\/+/g, "$1");
    } else {  
      // If missing "uploads", prepend it
      if (!imageUrl.startsWith("/uploads/")) {
        imageUrl = `/uploads/${imageUrl}`;
      }
      imageUrl = `${IMG_URL}${imageUrl}`.replace(/([^:]\/)\/+/g, "$1");
      // console.log({imageUrl})
    }

    return {
      id: product.productId || index + 1,
      image: imageUrl,
      title: product.productName || "Featured Product",
      description: product.Description || "Discover our exclusive collection.",
      buttons: [
        { text: "Shop Now", link: `/product/${product.productId}`, primary: true },
        { text: "View Details", link: `/product/${product.productId}` },
      ],
      productData: product,
    };
  };

  // Fetch slideshow products from API
  useEffect(() => {
    const fetchSlideshowProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${BACKEND_URL}slideshowProducts`);

        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // Transform API data to match the slideshow format
          const transformedSlides = response.data.data.map((product, index) => 
            transformProductToSlide(product, index)
          );
          setSlides(transformedSlides);
        } else {
          // Use default slide when no products are available
          const defaultSlide = transformProductToSlide(DEFAULT_SLIDE, 0);
          setSlides([defaultSlide]);
        }
      } catch (error) {
        console.error("Error fetching slideshow products:", error);
        // Use default slide when API fails
        const defaultSlide = transformProductToSlide(DEFAULT_SLIDE, 0);
        setSlides([defaultSlide]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlideshowProducts();
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (slides.length === 0) return;

    let interval;
    if (autoPlay) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrent((prev) => (prev + 1) % length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, length, slides.length]);

  // Preload next image
  useEffect(() => {
    if (slides.length === 0) return;

    const nextIndex = (current + 1) % length;
    if (slides[nextIndex]?.image) {
      const img = new Image();
      img.src = slides[nextIndex].image;
    }
  }, [current, slides, length]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % length);
  }, [length, slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + length) % length);
  }, [length, slides.length]);

  const goToSlide = (index) => {
    if (slides.length === 0) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  // Swipe support for mobile
  const swipeThreshold = 50;
  const handleDragEnd = (event, info) => {
    if (slides.length === 0) return;
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

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-[500px] sm:h-[500px] md:h-[880px] overflow-hidden rounded-b-[10px] shadow-2xl flex items-center justify-center bg-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading slideshow...</p>
        </div>
      </div>
    );
  }

  // No need for empty state check since we always have at least the default slide

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
              onError={(e) => {
                // console.error("Error loading image:", slides[current].image);
                e.target.style.display = 'none';
              }}
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
                  className={`px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base rounded-lg font-semibold shadow-lg transition ${btn.primary
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

      {/* Navigation - Only show if there's more than one slide */}
      {slides.length > 1 && (
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
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${current === index
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
      )}
    </div>
  );
}