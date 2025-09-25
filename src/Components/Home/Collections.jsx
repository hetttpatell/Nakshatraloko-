import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
import axios from "axios"; // Make sure to import axios
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: {
    y: 40,
    opacity: 0,
    rotateY: 15
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hover: {
    y: -5,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  }
};

// Background circles with different animations
const BackgroundCircle = ({ top, left, size, color, delay, duration, yMovement }) => (
  <motion.div
    className={`absolute ${size} rounded-full ${color} hidden sm:block`}
    style={{ top: `${top}%`, left: `${left}%` }}
    animate={{
      y: [0, yMovement, 0],
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  />
);

export default function Collections() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    axios
      .post(`${BACKEND_URL}getAllFeaturedCategory`)
      .then((res) => {
        if (res.data.success) {
          const transformedData = res.data.data.map((category, index) => ({
            name: category.Name, // updated field
           img: category.Image
            ? `${IMG_URL}/uploads${category.Image}`
            : "/abot.jpg",
            path: `/category/${category.Name.toLowerCase().replace(/\s+/g, '-')}`,
            items: `${category.active_product_count} Products`,
            color: "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]",
            description: category.Description,
          }));
          setCategoryData(transformedData);
        }
      })
      // .catch((err) => console.log(err));
  }, []);

  return (
    <section className="py-10 md:py-16 lg:py-24 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-[var(--color-background)] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-100 bg-gradient-to-r from-[var(--color-primary-light)]/30 to-[var(--color-primary-light)]/20"></div>

      {/* Multiple background circles - hidden on mobile */}
      <BackgroundCircle top={10} left={5} size="w-12 h-12 md:w-16 md:h-16" color="bg-[var(--color-primary)]/10" delay={0} duration={8} yMovement={15} />
      <BackgroundCircle top={80} left={90} size="w-16 h-16 md:w-20 md:h-20" color="bg-[var(--color-primary)]/10" delay={1} duration={7} yMovement={-12} />
      <BackgroundCircle top={30} left={85} size="w-10 h-10 md:w-12 md:h-12" color="bg-[var(--color-primary)]/10" delay={2} duration={9} yMovement={10} />
      <BackgroundCircle top={70} left={10} size="w-20 h-20 md:w-24 md:h-24" color="bg-[var(--color-primary)]/10" delay={0.5} duration={10} yMovement={-15} />
      <BackgroundCircle top={20} left={50} size="w-12 h-12 md:w-14 md:h-14" color="bg-[var(--color-primary)]/10" delay={1.5} duration={8} yMovement={8} />
      <BackgroundCircle top={60} left={70} size="w-14 h-14 md:w-18 md:h-18" color="bg-[var(--color-primary)]/10" delay={2.5} duration={7} yMovement={-10} />
      <BackgroundCircle top={40} left={30} size="w-8 h-8 md:w-10 md:h-10" color="bg-[var(--color-primary)]/10" delay={0.8} duration={9} yMovement={12} />
      <BackgroundCircle top={90} left={40} size="w-18 h-18 md:w-22 md:h-22" color="bg-[var(--color-primary)]/10" delay={1.2} duration={11} yMovement={-18} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <motion.div
            className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] 
                        px-3 py-1 md:px-4 md:py-2 rounded-full mb-4 md:mb-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Zap size={14} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
            <span className="text-xs md:text-sm font-medium">Premium Collections</span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--color-text)] mb-4 md:mb-5"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Discover Our <span className="text-[var(--color-primary)] relative">
              Exquisite
              <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full" viewBox="0 0 200 20">
                <path
                  d="M 0 10 Q 50 15 100 10 T 200 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="opacity-30"
                />
              </svg>
            </span> Range
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-[var(--color-text-light)] max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore our handcrafted collections designed to enhance your spiritual journey and personal style.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categoryData.map((collection, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-md hover:shadow-lg md:shadow-lg md:hover:shadow-xl transition-shadow duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={collection.path} className="block h-full ">
                {/* Fixed image container height */}
                <div className="relative h-68 sm:h-32 md:h-40 lg:h-48 xl:h-150 overflow-hidden">
                  <motion.div
                    variants={imageVariants}
                    className="w-full h-full"
                  >
                    <img
                      src={collection.img}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 
                  group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Content */}
                <motion.div
                  className="p-3 md:p-4 lg:p-5 text-white absolute bottom-0 left-0 right-0 z-10"
                  variants={contentVariants}
                >
                  <h3 className="text-sm md:text-base lg:text-lg font-bold mb-1 md:mb-1.5 line-clamp-1">{collection.name}</h3>
                  <p className="text-xs md:text-sm text-[var(--color-primary-light)]/90 mb-2 md:mb-3">{collection.items}</p>

                  <div className="flex items-center gap-1 md:gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-xs md:text-sm font-medium">Explore Now</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Color accent bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${collection.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/gemstones"
            className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-full transition-all duration-300 hover:gap-3 shadow-lg hover:shadow-[var(--color-primary)]/20 hover:shadow-xl text-sm md:text-base"
          >
            View All Collections
            <ArrowRight size={14} className="md:size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}