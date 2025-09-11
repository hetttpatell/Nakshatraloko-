import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf, Filter, X, Sparkles, Eye, ArrowRight } from "lucide-react";
import useProducts from "../../CustomHooks/useProducts"
import axios from "axios";

// Helper to create slug/ID
const slugify = (str) =>
  str?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
  Math.random().toString(36).substr(2, 9);

export default function Gemstones() {
  const [filters, setFilters] = useState({
    Ratings: "",
    Categories: "",
    Price: "",
    Features: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const { products, loading, error } = useProducts();
  const [categoryData, setCategoryData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8001/api/getCategories")
      .then((res) => {
        if (res.data.success) {
          const transformedData = res.data.data.map((category) => ({
            CategoryName: category.CategoryName,
            Image: category.Image || "/abot.jpg",
          }));
          setCategoryData(transformedData);

          // Update the Categories menu item with subMenu data
          setMenuItems(prevItems =>
            prevItems.map(item =>
              item.label === "Categories"
                ? {
                  ...item,
                  subMenu: transformedData.map(cat => ({
                    label: cat.CategoryName,
                    to: `/category/${cat.CategoryName.toLowerCase().replace(/\s+/g, '-')}`
                  }))
                }
                : item
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const toggleFilter = (category) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  // useEffect(() => {
  //   let isMounted = true;
  //   // const abortController = new AbortController();

  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const res = await axios.post(
  //         "http://localhost:8001/api/getAllProducts",
  //         // {},
  //         // { signal: abortController.signal }
  //       );

  //       if (!isMounted) return;

  //       let apiProducts = [];

  //       // Handle different response structures more carefully
  //       if (Array.isArray(res.data)) {
  //         apiProducts = res.data;
  //       } else if (Array.isArray(res.data?.data)) {
  //         apiProducts = res.data.data;
  //       } else if (Array.isArray(res.data?.products)) {
  //         apiProducts = res.data.products;
  //       } else {
  //         // If response structure is unexpected, try to extract any array
  //         const possibleArrays = Object.values(res.data).filter(
  //           (item) => Array.isArray(item) && item.length > 0
  //         );
  //         if (possibleArrays.length > 0) {
  //           // Take the first array that seems to contain products
  //           apiProducts = possibleArrays[0];
  //         }
  //       }

  //       console.log("API Products:", apiProducts);

  //       // Use a Set to track unique product IDs to avoid duplicates
  //       const uniqueProducts = new Map();

  //       apiProducts.forEach((p, index) => {
  //         // Generate a unique ID for the product
  //         const productId = p.ID || p.id || slugify(p.Name || p.name) || `product-${index}`;

  //         // Skip if we've already processed this product
  //         if (uniqueProducts.has(productId)) return;

  //         // Process image URL to ensure it's valid
  //         let imgUrl = p.Image || p.image || p.img || "/default-gemstone.jpg";

  //         // Ensure the URL is properly formatted
  //         if (imgUrl && !imgUrl.startsWith("http") && !imgUrl.startsWith("/")) {
  //           imgUrl = `/${imgUrl}`;
  //         }

  //         uniqueProducts.set(productId, {
  //           id: productId,
  //           category: p.Category || p.category || "Uncategorized",
  //           name: p.Name || p.name || "Gemstone Product",
  //           description: p.Description || p.description || "Beautiful gemstone jewelry",
  //           price: `₹ ${parseFloat(p.Price || p.price || 0).toLocaleString("en-IN")}`,
  //           dummyPrice: p.DummyPrice || p.dummyPrice || "",
  //           discountPercentage: p.DiscountPercentage || p.discountPercentage || 0,
  //           stock: p.Stock || p.stock || 0,
  //           advantages: p.Advantages || p.advantages || "",
  //           howToWear: p.HowToWear || p.howToWear || "",
  //           isActive: p.IsActive ?? true,
  //           feature: p.Feature || p.feature || "",
  //           img: imgUrl,
  //           rating: parseFloat(p.Rating || p.rating || (Math.random() * 2 + 3).toFixed(1)),
  //         });
  //       });

  //       // Convert Map values back to array
  //       setProducts(Array.from(uniqueProducts.values()));
  //     } catch (err) {
  //       if (axios.isCancel(err)) {
  //         console.log("Request canceled:", err.message);
  //       } else {
  //         console.error("Error fetching Gemstone products:", err);
  //         if (isMounted) {
  //           setError("Failed to load products.");
  //           setProducts([]);
  //         }
  //       }
  //     } finally {
  //       if (isMounted) setLoading(false);
  //     }
  //   };

  //   fetchProducts();

  //   // return () => {
  //   //   isMounted = false;
  //   //   abortController.abort("Component unmounted");
  //   // };
  // }, []);

  // Filter Options
  const optionsfilter = useMemo(() => {
    if (!products || products.length === 0) return { Ratings: [], Categories: [], Price: [], Features: [] };

    const ratingsSet = new Set();
    const categoriesSet = new Set();
    const featuresSet = new Set();
    const priceRangesSet = new Set();

    products.forEach((p) => {
      // Ratings ranges
      const r = Math.floor(p.rating);
      ratingsSet.add(`${r} - ${r + 1}`);

      // Categories
      if (p.category) categoriesSet.add(p.category);

      // Features
      if (p.feature) featuresSet.add(p.feature);

      // Price ranges (rounded to nearest 1000)
      const price = Number(p.price.replace(/[^\d]/g, ""));
      const min = Math.floor(price / 1000) * 1000;
      const max = min + 999;
      priceRangesSet.add(`${min} - ${max}`);
    });

    return {
      Ratings: Array.from(ratingsSet).sort(),
      Categories: Array.from(categoriesSet).sort(),
      Price: Array.from(priceRangesSet).sort((a, b) => {
        const aMin = Number(a.split(" - ")[0]);
        const bMin = Number(b.split(" - ")[0]);
        return aMin - bMin;
      }),
      Features: Array.from(featuresSet).sort(),
    };
  }, [products]);

  // Sorting Options
  const sortOptions = [
    { value: "", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "name-asc", label: "Name: A to Z" },
  ];

  // Memoized filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    // Filtering
    const filtered = products.filter((product) => {
      let matches = true;

      if (filters.Ratings) {
        const [min, max] = filters.Ratings.split(" - ").map(Number);
        const rating = parseFloat(product.rating);
        if (!(rating >= min && rating <= max)) matches = false;
      }

      if (selectedFilters.length > 0 && !selectedFilters.includes(product.category)) {
        matches = false;
      }


      if (filters.Price) {
        const [min, max] = filters.Price.split(" - ").map(Number);
        const price = Number(product.price.replace(/[^\d]/g, ""));
        if (!(price >= min && price <= max)) matches = false;
      }

      if (filters.Features && product.feature !== filters.Features) {
        matches = false;
      }

      return matches;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (
            Number(a.price.replace(/[^\d]/g, "")) -
            Number(b.price.replace(/[^\d]/g, ""))
          );
        case "price-desc":
          return (
            Number(b.price.replace(/[^\d]/g, "")) -
            Number(a.price.replace(/[^\d]/g, ""))
          );
        case "rating-desc":
          return b.rating - a.rating;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, filters, sortBy]);

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      Ratings: "",
      Categories: "",
      Price: "",
      Features: "",
    });
    setSelectedFilters([]);
    setSortBy("");
  };


  const hasActiveFilters =
    Object.values(filters).some((v) => v !== "") ||
    sortBy !== "" ||
    selectedFilters.length > 0;



  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4 rounded-full"></div>
          <p className="text-[var(--color-text-light)]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--color-background)]">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[var(--color-text)] mb-4">
              Exquisite <span className="text-[var(--color-primary)]">Gemstone</span> Collection
            </h1>
            <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
              Discover our handcrafted gemstone jewelry, meticulously designed
              to enhance your spiritual journey and personal elegance.
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow">
            <div className="flex items-center gap-4 relative">
              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all"
              >
                <Filter size={18} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>
                )}
              </button>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3">
              <span className="text-[var(--color-text-light)] text-sm">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-xl bg-white text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)]/50"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.keys(optionsfilter).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">
                      {key}
                    </label>

                    {key === "Categories" ? (
                      <select
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-[var(--color-text)]"
                      >
                        <option value="">All Categories</option>
                        {categoryData.map((cat) => (
                          <option key={cat.CategoryName} value={cat.CategoryName}>
                            {cat.CategoryName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-[var(--color-text)]"
                      >
                        <option value="">All {key}</option>
                        {optionsfilter[key].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-8 flex justify-between items-center">
            <p className="text-[var(--color-text-light)]">
              Showing{" "}
              <span className="text-[var(--color-primary)] font-semibold">
                {filteredAndSortedProducts.length}
              </span>{" "}
              of {products.length} products
            </p>
          </div>

          {/* Products Grid - IMPROVED UI */}
          <div className="pb-16">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Sparkles className="w-16 h-16 text-[var(--color-primary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  No products found
                </h3>
                <p className="text-[var(--color-text-light)] mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    state={{ product }}
                    className="group bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/default-gemstone.jpg";
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {product.feature && (
                        <span className="absolute top-4 left-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-xs font-semibold px-3 py-2 rounded-r-xl shadow-md">
                          {product.feature}
                        </span>
                      )}
                      
                      {/* Quick view button */}
                      <div className="absolute bottom-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors">
                          <Eye className="w-4 h-4 text-[var(--color-text)]" />
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-5">
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wide mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const fullStars = Math.floor(product.rating);
                            const hasHalfStar = product.rating % 1 >= 0.5;
                            if (i < fullStars) {
                              return <Star key={i} className="w-4 h-4 text-[var(--color-rating)] fill-[var(--color-rating)]" />;
                            } else if (i === fullStars && hasHalfStar) {
                              return <StarHalf key={i} className="w-4 h-4 text-[var(--color-rating)] fill-[var(--color-rating)]" />;
                            } else {
                              return <Star key={i} className="w-4 h-4 text-gray-300" />;
                            }
                          })}
                        </div>
                        <span className="text-sm text-[var(--color-text-light)]">({product.rating})</span>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
                        <div>
                          <p className="text-lg font-bold text-[var(--color-primary)]">{product.price}</p>
                        </div>
                        <button className="flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium text-sm transition-colors">
                          View Details
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
);
}