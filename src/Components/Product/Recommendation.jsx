import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import axios from "axios";

const Recommendation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();

  // Helper function to map product data to consistent format
  const mapProductData = (product) => {
  return {
    id: product.ID || product.id,
    name: product.Name || product.name,
    price: typeof product.Price === 'string' 
      ? parseFloat(product.Price.replace(/[^\d.]/g, "")) 
      : product.Price || product.price,
    image: product.Image || product.image || "/placeholder.jpg",  // fallback image
    rating: product.Rating || product.rating || 4.5,
    brand: product.Brand || product.brand || "STYLIUM"
  };
};

  // Fetch all products and select 4 random ones
  const fetchRecommendedProducts = async () => {
  try {
    const res = await axios.post("http://localhost:8001/api/getAllProducts");

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommendedProducts.map((product) => {
        return (
          <div key={product.id} className="group relative bg-color-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <Link 
              to={`/product/${product.id}`} 
              state={{ product }}
              className="block"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`http://localhost:8001/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-color-primary text-color-surface text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </div>
              </div>
            </Link>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-color-text-muted mb-1">{product.brand}</h3>
                  <Link 
                    to={`/product/${product.id}`} 
                    state={{ product }}
                    className="font-normal text-color-text hover:text-color-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                </div>
                <button
                  onClick={() => handleWishlistClick(product)}
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
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating) ?
                      <AiFillStar key={i} className="text-sm" /> :
                      <AiOutlineStar key={i} className="text-sm" />
                  ))}
                </div>
                <span className="text-xs text-color-text-muted">({product.rating})</span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-light text-color-text">₹ {product.price.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="text-xs font-medium bg-color-primary text-color-surface px-3 py-2 rounded hover:bg-color-primary-dark transition-colors"
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Recommendation;