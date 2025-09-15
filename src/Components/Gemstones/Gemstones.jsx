import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, StarHalf, Filter, X, Sparkles, Eye, ArrowRight } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import img from"./s1.jpeg"
const ProductsPage = () => {
  const { category } = useParams();

  const [filters, setFilters] = useState({
    Ratings: "",
    Categories: "",
    Price: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products separately
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.post("http://localhost:8001/api/getAllCatogary");
        if (res.data.success) {
          setCategories(res.data.data.map(c => c.Name));
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);
useEffect(() => {
  if (category) {
    // Map URL param back to your category name
    const formattedCategory = category.replace(/-/g, ' ');
    setFilters(prev => ({ ...prev, Categories: formattedCategory }));
  }
}, [category]);

  // Fetch all products initially
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.post("http://localhost:8001/api/getFilteredProducts", {
          p_min_price: null,
          p_max_price: null,
          p_catogaryname:  filters.Categories || null,
          p_rating: null,
        });

        if (res.data.success) {
          const productsData = res.data.data.map(p => ({
            id: p.productid,
            name: p.name,
            category: p.catogaryname,
            description: p.description,
            price: p.firstsizeprice
              ? `₹ ${parseFloat(p.firstsizeprice).toLocaleString("en-IN")}`
              : "₹ 0",
            img: p.primaryimage || null,
            rating: parseFloat(p.avgrating || 0),
            stock: p.stock,
            dummyPrice: p.firstdummyprice
              ? `₹ ${parseFloat(p.firstdummyprice).toLocaleString("en-IN")}`
              : null,
            discount: p.discount
              ? `₹ ${parseFloat(p.discount).toLocaleString("en-IN")}`
              : null,
            discountPercentage: p.discountpercentage || 0,
            numericPrice: p.firstsizeprice ? parseFloat(p.firstsizeprice) : 0,
          }));

          setAllProducts(productsData);
          setProducts(productsData);

          // Extract categories dynamically
          const categories = [...new Set(productsData.map(p => p.category))];
          setCategoryData(categories.map(c => ({ CategoryName: c })));
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch filtered products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let minPrice = null, maxPrice = null;
        if (filters.Price) {
          [minPrice, maxPrice] = filters.Price.split(" - ").map(Number);
        }

        let minRating = null;
        if (filters.Ratings) {
          const [min] = filters.Ratings.split(" - ").map(Number);
          minRating = min;
        }

        const res = await axios.post("http://localhost:8001/api/getFilteredProducts", {
          p_min_price: minPrice,
          p_max_price: maxPrice,
          p_catogaryname: filters.Categories,
          p_rating: minRating,
        });

        if (res.data.success) {
          const productsData = res.data.data.map(p => ({
            id: p.productid,
            name: p.name,
            category: p.catogaryname,
            description: p.description,
            price: p.firstsizeprice
              ? `₹ ${parseFloat(p.firstsizeprice).toLocaleString("en-IN")}`
              : "₹ 0",
            img: p.primaryimage || null,
            rating: parseFloat(p.avgrating || 0),
            stock: p.stock,
            dummyPrice: p.firstdummyprice
              ? `₹ ${parseFloat(p.firstdummyprice).toLocaleString("en-IN")}`
              : null,
            discount: p.discount
              ? `₹ ${parseFloat(p.discount).toLocaleString("en-IN")}`
              : null,
            discountPercentage: p.discountpercentage || 0,
            numericPrice: p.firstsizeprice ? parseFloat(p.firstsizeprice) : 0,
          }));

          setProducts(productsData);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, [filters]);

  // Filter options for dropdowns - use allProducts instead of products
  const optionsfilter = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return { Ratings: [], Categories: [], Price: [] };

    const ratingsSet = new Set();
    const priceRangesSet = new Set();

    allProducts.forEach(p => {
      const r = Math.floor(p.rating);
      ratingsSet.add(`${r} - ${r + 1}`);

      const price = p.numericPrice;
      const min = Math.floor(price / 1000) * 1000;
      const max = min + 999;
      priceRangesSet.add(`${min} - ${max}`);
    });

    return {
      Ratings: Array.from(ratingsSet).sort(),
      Categories: [...new Set(allProducts.map(p => p.category))],
      Price: Array.from(priceRangesSet).sort((a, b) => Number(a.split(" - ")[0]) - Number(b.split(" - ")[0])),
    };
  }, [allProducts]);

  // Sorting options
  const sortOptions = [
    { value: "", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "name-asc", label: "Name: A to Z" },
  ];

  // Filtered & sorted products
// Filtered & sorted products
const filteredAndSortedProducts = useMemo(() => {
  let filtered = products.filter(product => {
    return Object.keys(filters).every(key => {
      if (!filters[key] || filters[key] === "") return true;

      if (key === "Categories") {
  return product.category.toLowerCase() === filters[key].toLowerCase();
}


      if (key === "Ratings") {
        const [min, max] = filters[key].split(" - ").map(Number);
        return product.rating >= min && product.rating < max;
      }

      if (key === "Price") {
        const [min, max] = filters[key].split(" - ").map(Number);
        return product.numericPrice >= min && product.numericPrice <= max;
      }

      return true;
    });
  });

  let sorted = [...filtered];
  switch (sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.numericPrice - b.numericPrice);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.numericPrice - a.numericPrice);
      break;
    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return sorted;
}, [products, filters, sortBy]);


  // Handle filter change
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  // Reset filters
  const resetFilters = () => {
    setFilters({ Ratings: "", Categories: "", Price: "" });
    setSortBy("");
    setProducts(allProducts); // Reset to show all products
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "") || sortBy !== "";

  return (
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

        {/* Error */}
        {error && <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"><p className="text-yellow-800">{error}</p></div>}

        {/* Controls */}
        {/* <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow"> */}
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all">
              <Filter size={18} /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>}
            </button>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                <X size={16} /> Clear All
              </button>
            )}
          </div>
          {/* <div className="flex items-center gap-3">
            <span className="text-[var(--color-text-light)] text-sm">Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 border border-[var(--color-border)] rounded-xl bg-white text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)]/50">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div> */}
        {/* </div> */}

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.keys(optionsfilter).map(key => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">{key}</label>

                  {key === "Categories" ? (
                    <select
                      value={filters[key]}
                      onChange={e => handleFilterChange(key, e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-[var(--color-text)]"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={filters[key]}
                      onChange={e => handleFilterChange(key, e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white text-[var(--color-text)]"
                    >
                      <option value="">All {key}</option>
                      {optionsfilter[key].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}


        {/* Results count */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-[var(--color-text-light)]">
            Showing <span className="text-[var(--color-primary)] font-semibold">{filteredAndSortedProducts.length}</span> of {allProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="pb-16">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Sparkles className="w-16 h-16 text-[var(--color-primary)] mb-4" />
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No products found</h3>
              <p className="text-[var(--color-text-light)] mb-6">Try adjusting your filters to see more results.</p>
              <button onClick={resetFilters} className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors">Reset Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} state={{ product }} className="group bg-[var(--color-surface)] rounded-2xl overflow-hidden border border-[var(--color-border)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative w-full aspect-square overflow-hidden">
                    <img src={product.img ? `http://localhost:8001/uploads/${product.img}` : img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={e => e.target.src = img} loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wide mb-1">{product.category}</p>
                    <h3 className="font-semibold text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const fullStars = Math.floor(product.rating);
                          const hasHalfStar = product.rating % 1 >= 0.5;
                          if (i < fullStars) return <Star key={i} className="w-4 h-4 text-[var(--color-rating)] fill-[var(--color-rating)]" />;
                          if (i === fullStars && hasHalfStar) return <StarHalf key={i} className="w-4 h-4 text-[var(--color-rating)] fill-[var(--color-rating)]" />;
                          return <Star key={i} className="w-4 h-4 text-gray-300" />;
                        })}
                      </div>
                      <span className="text-sm text-[var(--color-text-light)]">({product.rating})</span>
                    </div>
                    <div className="flex flex-col gap-2 pt-3 border-t border-[var(--color-border-light)]">
                      {product.dummyPrice && product.discountPercentage && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400 line-through">{product.dummyPrice}</p>
                          <p className="text-sm text-green-600 font-semibold">-{product.discountPercentage}%</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-[var(--color-primary)]">{product.price}</p>
                        <button className="flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium text-sm transition-colors">
                          View Details <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;