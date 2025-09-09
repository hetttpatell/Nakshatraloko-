import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Recommendation = ({ 
  permission = true, 
  Slogan = "Discover more products curated just for you — blending quality, design, and style.",
  Text = "You May Also",
  HighlightText = "Like",
   products = [
  {
    id: 1,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s1.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  {
    id: 2,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s2.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  {
    id: 3,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s3.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  {
    id: 4,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s1.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  {
    id: 5,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s1.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  {
    id: 6,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s1.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  {
    id: 7,
    name: "14KT Yellow Gold Diamond Hoop Earrings",
    category: "earrings",
    subcategory: "Women | Earrings",
    price: "₹ 4,554.00",
    originalPrice: "₹ 6,505.00",
    discount: "-30%",
    rating: 4.8,
    reviews: 42,
    img: "/s1.jpeg",
    description: "Elegant diamond hoop earrings crafted in 14KT yellow gold, perfect for any occasion.",
    inStock: true,
    tags: ["Popular", "New Arrival"],
    featured: true
  },
  
]
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {permission && (
            <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-medium">Curated Selection</span>
            </div>
          )}
          
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            {Text} <span className="text-[var(--color-primary)]">{HighlightText}</span>
          </h2>
          
          <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
            {Slogan}
          </p>
        </motion.div>

        {/* Products Grid - Matching Featured Products style */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group bg-white rounded-xl overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20"
            >
              <Link to={`/product/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0]?.src || product.mainImage || "/fallback.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Badges */}
                  {product.discount && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-[var(--color-primary)] text-white text-xs font-semibold px-2 py-1 rounded">
                        {product.discount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-medium text-[var(--color-text)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors text-sm">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs text-[var(--color-text-light)] mb-2">{product.brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.floor(product.rating) 
                              ? "text-amber-500" 
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[var(--color-text-light)]">({product.reviews})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--color-primary)]">
                      ₹{product.price?.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-[var(--color-text-light)] line-through">
                        ₹{product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {permission && products.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-all shadow-md hover:shadow-lg"
            >
              View All Products
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Recommendation;


