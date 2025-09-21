import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL

const Recommendation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();

  // Helper function to map product data to consistent format
  const mapProductData = (product) => {
    let imagePath = product.PrimaryImage;

    // If already absolute URL (starts with http), use directly
    if (imagePath?.startsWith("http")) {
      return {
        id: product.ID || product.id,
        name: product.Name || product.name,
        price:
          typeof product.Price === "string"
            ? parseFloat(product.Price.replace(/[^\d.]/g, ""))
            : product.Price || product.price,
        image: imagePath, // use as-is
        rating: product.Rating || product.rating || 4.5,
        brand: product.Brand || product.brand || "STYLIUM",
      };
    }

    // Else treat it as relative path → prepend backend URL
    return {
      id: product.ID || product.id,
      name: product.Name || product.name,
      price:
        typeof product.Price === "string"
          ? parseFloat(product.Price.replace(/[^\d.]/g, ""))
          : product.Price || product.price,
      image: `${IMG_URL}uploads${imagePath}`, // prepend correctly
      rating: product.Rating || product.rating || 4.5,
      brand: product.Brand || product.brand || "STYLIUM",
    };
  };



  // Fetch all products and select 4 random ones
  const fetchRecommendedProducts = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}getAllProducts`);

      const apiProducts = Array.isArray(res.data?.data) ? res.data.data : [];

      const mappedProducts = apiProducts.map(p => mapProductData(p));

      const shuffled = [...mappedProducts].sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4));

      setLoading(false);
    } catch (err) {
      console.error("Error fetching recommended products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  const handleWishlistClick = async (product) => {
    if (isWishlisted(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        mainImage: product.image,
        brand: product.brand
      });
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      mainImage: product.image,
      brand: product.brand
    }, 1, "", "");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommendedProducts.map((product) => {
        return (
          <div
            key={product.id}
            className="group relative bg-color-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Entire card clickable */}
            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              className="block absolute inset-0 z-10"
            />

            <div className="relative z-0">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4 relative z-20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-color-text-muted mb-1">{product.brand}</h3>
                    <span className="font-normal text-color-text line-clamp-1">
                      {product.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigating when clicking wishlist
                      handleWishlistClick(product);
                    }}
                    className="text-lg hover:text-color-primary transition-colors"
                  >
                    {isWishlisted(product.id) ? (
                      <AiFillHeart className="text-color-primary" />
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-color-rating">
                    {[...Array(5)].map((_, i) =>
                      i < Math.floor(product.rating) ? (
                        <AiFillStar key={i} className="text-sm" />
                      ) : (
                        <AiOutlineStar key={i} className="text-sm" />
                      )
                    )}
                  </div>
                  <span className="text-xs text-color-text-muted">({product.rating})</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-light text-color-text">₹ {product.price.toLocaleString('en-IN')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigating when clicking add to bag
                      handleAddToCart(product);
                    }}
                    className="text-xs font-medium bg-color-primary text-color-surface px-3 py-2 rounded hover:bg-color-primary-dark transition-colors"
                  >
                    ADD TO BAG
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

  );
};

export default Recommendation;