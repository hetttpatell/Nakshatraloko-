import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star, ShoppingCart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const categories = [
  { id: "all", name: "All" },
  { id: "earrings", name: "Earrings" },
  { id: "necklaces", name: "Necklaces" },
  { id: "rings", name: "Rings" },
  { id: "bracelets", name: "Bracelets" },
];

export default function FeaturedProducts() {
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    axios.post("http://localhost:8001/api/getFeaturedProducts")
      .then((res) => {
        console.log("Raw API response:", res.data);

        if (isMounted) {
          // Extract the actual data array
          const apiProducts = Array.isArray(res.data?.data) ? res.data.data : [];

          // Map backend fields to frontend-friendly fields
          const mappedProducts = apiProducts.map((p) => ({
            id: p.ID,
            name: p.Name,
            description: p.Description,
            category: p.CatogaryName || "Uncategorized", // map to subcategory
            subcategory: p.CatogaryName || "Uncategorized",
            price: p.Price || "N/A",
            originalPrice: p.DummyPrice || null,          // original price shown as line-through
            img: `http://localhost:8001/uploads/${p.ImageText}` || "/placeholder.jpg", // full URL
            altText: p.Alt_Text || "product image",
            discount: p["Discount Percentage"] || null,
            rating: p.rating || 4,
            reviews: p.reviews || 10,
            inStock: p.inStock ?? true,
          }));


          setProducts(mappedProducts);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);


  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-8 md:py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-3 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
            <Sparkles size={14} />
            <span className="text-xs md:text-sm font-medium">
              Premium Collection
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-3 md:mb-4">
            Featured{" "}
            <span className="text-[var(--color-primary)]">Masterpieces</span>
          </h2>

          <p className="text-sm md:text-lg text-[var(--color-text-light)] max-w-2xl mx-auto px-2">
            Handpicked selections crafted with precision and elegance, curated
            just for you.
          </p>
        </div>

        {/* Category Filters */}
        {/* <div className="flex flex-wrap justify-center gap-1 md:gap-3 mb-6 md:mb-12 px-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-2 py-1 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-md)]"
                    : "bg-white text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-primary)]/5"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div> */}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-[var(--color-text-light)]">
            Loading products...
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8 mb-6 md:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product) => (
  <Link
    key={product.id}
    to={`/product/${product.id}`}
    state={{ product }}
    className="group block bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20"
  >
    {/* Image Container */}
    <div className="relative aspect-square overflow-hidden">
      <img
        src={product.img}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Badges */}
      <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col items-start gap-1">
        {product.discount && (
          <span className="bg-[var(--color-primary)] text-white text-xs font-semibold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded">
            {product.discount}
          </span>
        )}
        {product.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-white text-[var(--color-primary)] text-xs font-semibold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-white font-semibold bg-[var(--color-primary)] px-2 py-1 md:px-4 md:py-2 rounded text-xs">
            Out of Stock
          </span>
        </div>
      )}
    </div>

    {/* Product Details */}
    <div className="p-3 md:p-6">
      <h3 className="font-medium text-[var(--color-text)] line-clamp-2 mb-1 md:mb-2 group-hover:text-[var(--color-primary)] transition-colors text-xs md:text-base">
        {product.name}
      </h3>

      <p className="text-xs text-[var(--color-text-light)] mb-1 md:mb-3">
        {product.subcategory}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-1 md:mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={10}
              className={
                i < Math.floor(product.rating)
                  ? "text-amber-500 fill-amber-500"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-xs text-[var(--color-text-light)]">
          ({product.reviews})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-1 mb-2 md:mb-4">
        <p className="text-sm md:text-lg font-semibold text-[var(--color-primary)]">
          {product.price}
        </p>
        {product.originalPrice && (
          <p className="text-xs text-[var(--color-text-light)] line-through">
            {product.originalPrice}
          </p>
        )}
      </div>

      {/* Browse Button */}
      <div
        className={`w-full py-1.5 md:py-3 rounded-lg font-medium flex items-center justify-center gap-1 text-xs md:text-base ${product.inStock
          ? "bg-[var(--color-primary)] text-white"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
      >
        {product.inStock ? "Browse" : "Out of Stock"}
      </div>
    </div>
  </Link>
))}
  
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content goes here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
