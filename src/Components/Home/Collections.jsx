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
    className={`absolute ${size} rounded-full ${color}`}
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
            ? `${IMG_URL}uploads/${category.Image}`
            : "/abot.jpg",
            path: `/category/${category.Name.toLowerCase().replace(/\s+/g, '-')}`,
            items: `${category.active_product_count} Products`, // use active product count
            color: "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]",
            description: category.Description, // optional if you want to show description
          }));
          setCategoryData(transformedData);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--color-primary-light)]/50 to-[var(--color-background)] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="Absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--color-primary-light)]/30 to-[var(--color-primary-light)]/20"></div>

      {/* Multiple background circles */}
      <BackgroundCircle top={10} left={5} size="w-16 h-16" color="bg-[var(--color-primary)]/10" delay={0} duration={8} yMovement={15} />
      <BackgroundCircle top={80} left={90} size="w-20 h-20" color="bg-[var(--color-primary)]/10" delay={1} duration={7} yMovement={-12} />
      <BackgroundCircle top={30} left={85} size="w-12 h-12" color="bg-[var(--color-primary)]/10" delay={2} duration={9} yMovement={10} />
      <BackgroundCircle top={70} left={10} size="w-24 h-24" color="bg-[var(--color-primary)]/10" delay={0.5} duration={10} yMovement={-15} />
      <BackgroundCircle top={20} left={50} size="w-14 h-14" color="bg-[var(--color-primary)]/10" delay={1.5} duration={8} yMovement={8} />
      <BackgroundCircle top={60} left={70} size="w-18 h-18" color="bg-[var(--color-primary)]/10" delay={2.5} duration={7} yMovement={-10} />
      <BackgroundCircle top={40} left={30} size="w-10 h-10" color="bg-[var(--color-primary)]/10" delay={0.8} duration={9} yMovement={12} />
      <BackgroundCircle top={90} left={40} size="w-22 h-22" color="bg-[var(--color-primary)]/10" delay={1.2} duration={11} yMovement={-18} />
      <BackgroundCircle top={50} left={30} size="w-14 h-20" color="bg-[var(--color-primary)]/10" delay={1.2} duration={11} yMovement={-18} />
      <BackgroundCircle top={55} left={20} size="w-12 h-32" color="bg-[var(--color-primary)]/10" delay={1.2} duration={11} yMovement={-18} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Zap size={16} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
            <span className="text-sm font-medium">Premium Collections</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-5"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Discover Our <span className="text-[var(--color-primary)] relative">
              Exquisite
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 20">
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
            className="text-lg text-[var(--color-text-light)] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore our handcrafted collections designed to enhance your spiritual journey and personal style.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
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
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={collection.path} className="block h-full">
                {/* Fixed image container height */}
                <div className="relative h-130 overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Content */}
                <motion.div
                  className="p-5 text-white absolute bottom-0 left-0 right-0 z-10"
                  variants={contentVariants}
                >
                  <h3 className="text-lg font-bold mb-1.5">{collection.name}</h3>
                  <p className="text-sm text-[var(--color-primary-light)]/90 mb-3">{collection.items}</p>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-sm font-medium">Explore Now</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Color accent bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${collection.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/gemstones"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-full transition-all duration-300 hover:gap-3 shadow-lg hover:shadow-[var(--color-primary)]/20 hover:shadow-xl"
          >
            View All Collections
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}