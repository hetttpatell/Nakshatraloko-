import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star, ThumbsUp, Share, Grid, Layout } from "lucide-react";

const maleImg = "https://www.w3schools.com/howto/img_avatar.png";
const femaleImg = "https://www.w3schools.com/howto/img_avatar2.png";

const reviews = [
  {
    id: 1,
    name: "Dayal Singh Solanki",
    title: "CEO, Company X",
    description: "I am thoroughly impressed with the exceptional service provided by Brand Expert. Their attention to detail and professionalism exceeded my expectations. The team delivered our project ahead of schedule with outstanding quality that has significantly improved our brand perception.",
    img: maleImg,
    stars: 5,
    date: "January 15, 2023",
    category: "Brand Design"
  },
  {
    id: 2,
    name: "Priya Patel",
    title: "Marketing Director",
    description: "Working with this team transformed our digital presence. Their strategic approach to our rebranding resulted in a 40% increase in customer engagement. I would recommend them to any business looking to elevate their brand.",
    img: femaleImg,
    stars: 5,
    date: "March 22, 2023",
    category: "Digital Marketing"
  },
  {
    id: 3,
    name: "Sudhakar_33",
    title: "Company Manager",
    description: "Great and awesome work. Really I was worried because I couldn't trust anyone online, but they delivered beyond what I imagined possible. The communication was excellent throughout the process.",
    img: maleImg,
    stars: 5,
    date: "April 5, 2023",
    category: "Web Development"
  },
  {
    id: 4,
    name: "Ajay Sharma",
    title: "Brand Designer",
    description: "ब्रांड एक्सपर्ट लोगोस डिज़ाइनर जैसे नाम से ही ब्रांड क्वालिटी शब्द का उच्चारण होता है. उनका काम वाकई में प्रशंसनीय है. मैं निश्चित रूप से फिर से उनके साथ काम करूंगा।",
    img: maleImg,
    stars: 5,
    date: "May 18, 2023",
    category: "Logo Design"
  },
  {
    id: 5,
    name: "Laxman Lokare",
    title: "Product Manager",
    description: "They are very prompt and responsive. It has been extremely smooth working with them. The final deliverables were exactly what we needed for our product launch and helped us exceed our Q3 targets.",
    img: maleImg,
    stars: 5,
    date: "June 30, 2023",
    category: "Product Strategy"
  },
  {
    id: 6,
    name: "Ananya Desai",
    title: "Creative Director",
    description: "The creativity and innovation brought to our project was remarkable. They understood our vision perfectly and executed it with precision. Our new brand identity has received countless compliments.",
    img: femaleImg,
    stars: 5,
    date: "August 12, 2023",
    category: "Creative Direction"
  }
];

const ModernTestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [liked, setLiked] = useState({});
  const [viewMode, setViewMode] = useState("carousel");

  // Auto-play always
  useEffect(() => {
    if (viewMode === "carousel") {
      const interval = setInterval(() => {
        setDirection(0);
        setCurrent((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews.length, viewMode]);

  const handleNext = () => {
    setDirection(0);
    setCurrent((prev) => (prev + 1) % reviews.length);
  };
  
  const handlePrev = () => {
    setDirection(1);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index) => {
    setDirection(index > current ? 0 : 1);
    setCurrent(index);
  };

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async (review) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Testimonial from ${review.name}`,
          text: review.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${review.name}: ${review.description}`);
      // alert('Testimonial copied to clipboard!');
    }
  };

  const review = reviews[current];

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction === 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction === 0 ? -400 : 400,
      opacity: 0,
      scale: 0.9
    })
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative py-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[var(--color-text)] mb-4"
          >
            What Our <span className="text-[var(--color-primary)]">Clients Say</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[var(--color-text-light)] text-lg max-w-2xl mx-auto"
          >
            Discover why customers trust us with their jewelry needs
          </motion.p>

          {/* View Toggle */}
          <motion.div 
            className="flex justify-center gap-4 mb-8 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${viewMode === 'carousel' ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-lg)]' : 'bg-white text-[var(--color-text)] hover:bg-[var(--color-primary-light)] shadow-[var(--shadow-md)]'}`}
            >
              <Layout size={20} />
              Carousel View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-lg)]' : 'bg-white text-[var(--color-text)] hover:bg-[var(--color-primary-light)] shadow-[var(--shadow-md)]'}`}
            >
              <Grid size={20} />
              Grid View
            </button>
          </motion.div>
        </div>

        {viewMode === 'carousel' ? (
          /* Carousel View */
          <div className="relative flex items-center justify-center">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              aria-label="Previous Review"
              className="absolute left-0 sm:-left-4 p-3 rounded-full bg-white shadow-[var(--shadow-lg)] z-10 transition-all hover:bg-[var(--color-primary)] hover:text-white hover:scale-110 group"
            >
              <ArrowLeft size={24} className="text-[var(--color-text)] group-hover:text-white" />
            </button>

            {/* Testimonial Card */}
            <div className="w-full max-w-5xl mx-4 overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={review.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  className="bg-white rounded-2xl shadow-[var(--shadow-lg)] p-8 flex flex-col md:flex-row items-center gap-8"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <motion.img
                      src={review.img}
                      alt={review.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-[var(--shadow-lg)]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <motion.div 
                      className="absolute -bottom-2 -right-2 bg-[var(--color-primary)] rounded-full p-2 shadow-[var(--shadow-md)]"
                      whileHover={{ rotate: 15 }}
                    >
                      <Quote size={20} className="text-white" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx}
                          size={20}
                          className={`${idx < review.stars ? "text-[var(--color-primary)] fill-[var(--color-primary)]" : "text-gray-300"} mx-0.5`}
                        />
                      ))}
                    </div>
                    
                    <motion.blockquote 
                      className="text-[var(--color-text)] text-lg mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      "{review.description}"
                    </motion.blockquote>
                    
                    <div className="mb-4">
                      <h3 className="text-[var(--color-text)] font-bold text-xl">{review.name}</h3>
                      <p className="text-[var(--color-text-light)]">{review.title}</p>
                      <p className="text-[var(--color-text-light)] text-sm mt-1">{review.date} • {review.category}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center md:justify-start gap-4 mt-6">
                      <button 
                        onClick={() => toggleLike(review.id)}
                        className={`p-2 rounded-full transition-all ${liked[review.id] ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)]'}`}
                      >
                        <ThumbsUp size={18} className={liked[review.id] ? "fill-[var(--color-primary)]" : ""} />
                      </button>
                      <button 
                        onClick={() => handleShare(review)}
                        className="p-2 rounded-full bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all"
                      >
                        <Share size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              aria-label="Next Review"
              className="absolute right-0 sm:-right-4 p-3 rounded-full bg-white shadow-[var(--shadow-lg)] z-10 transition-all hover:bg-[var(--color-primary)] hover:text-white hover:scale-110 group"
            >
              <ArrowRight size={24} className="text-[var(--color-text)] group-hover:text-white" />
            </button>
          </div>
        ) : (
          /* Grid View */
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={gridVariants}
                className="bg-white rounded-2xl shadow-[var(--shadow-lg)] p-6 hover:shadow-[var(--shadow-xl)] transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-[var(--shadow-md)]"
                  />
                  <div>
                    <h3 className="text-[var(--color-text)] font-bold text-lg">{review.name}</h3>
                    <p className="text-[var(--color-text-light)] text-sm">{review.title}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx}
                      size={16}
                      className={`${idx < review.stars ? "text-[var(--color-primary)] fill-[var(--color-primary)]" : "text-gray-300"} mx-0.5`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-[var(--color-text)] text-base mb-4 leading-relaxed line-clamp-4">
                  "{review.description}"
                </blockquote>
                
                <p className="text-[var(--color-text-light)] text-xs mb-4">{review.date} • {review.category}</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleLike(review.id)}
                    className={`p-2 rounded-full transition-all ${liked[review.id] ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)]'}`}
                  >
                    <ThumbsUp size={16} className={liked[review.id] ? "fill-[var(--color-primary)]" : ""} />
                  </button>
                  <button 
                    onClick={() => handleShare(review)}
                    className="p-2 rounded-full bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] transition-all"
                  >
                    <Share size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dots Indicator - Only show in carousel mode */}
        {viewMode === 'carousel' && (
          <div className="flex gap-2 mt-12 justify-center">
            {reviews.map((_, idx) => (
              <motion.button
                key={idx}
                className={`w-3 h-3 rounded-full ${idx === current ? "bg-[var(--color-primary)]" : "bg-gray-300"}`}
                onClick={() => goToSlide(idx)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--color-primary-light)] rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[var(--color-primary-light)] rounded-full blur-3xl opacity-40"></div>
      <div className="absolute top-1/2 left-20 w-24 h-24 bg-[var(--color-secondary)]/20 rounded-full blur-2xl opacity-20"></div>
    </section>
  );
};

export default ModernTestimonialsCarousel;