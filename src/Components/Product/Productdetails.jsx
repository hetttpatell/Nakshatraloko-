import React, { useState, useEffect } from "react";
import AccordionItem from "./AccordionItem";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineLike,
  AiFillLike,
  AiFillHeart,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { FiChevronRight, FiZoomIn, FiUser } from "react-icons/fi";
import { BsStarHalf } from "react-icons/bs";
import Recommendation from "./Recommendation";
import Button from "../Button/Button";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import Toast from "./Toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useProtectedAction } from "../../CustomHooks/useProductAction";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

const productquestions = [
  {
    title: "What is the return policy?",
    content:
      "We offer a 30-day return policy for all unworn items in their original packaging with proof of purchase.",
  },
  {
    title: "Are the gemstones authentic?",
    content:
      "Yes, all our gemstones are 100% authentic and come with a certificate of authenticity.",
  },
  {
    title: "Do you offer custom designs?",
    content:
      "Yes, we offer custom design services. Please contact our customer service team for more information.",
  },
  {
    title: "How long does shipping take?",
    content:
      "Standard shipping takes 3-5 business days. Express shipping is available for an additional fee with 1-2 day delivery.",
  },
];

const ProductDetails = () => {
  const { id } = useParams(); // id must match productId
  const { state } = useLocation();
  const passedProduct = state?.product;
  const navigate = useNavigate();
  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    content: "",
    hoverRating: 0,
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Existing states
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [likedReviews, setLikedReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [customToast, setCustomToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [applicableCoupons, setApplicableCoupons] = useState([]);
  const { addToWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();
  const { protectedCartAction, protectedWishlistAction, isAuthenticated } =
    useProtectedAction();

  const normalizeImage = (url) => {
    if (!url) return "/s1.jpeg";

    url = url.trim();

    // Remove leading slashes
    url = url.replace(/^\/+/, "");

    // If file does not include uploads → add it
    if (!url.startsWith("uploads/")) {
      url = "uploads/" + url;
    }

    // Ensure IMG_URL ends with /
    const base = IMG_URL.endsWith("/") ? IMG_URL : IMG_URL + "/";

    return base + url;
  };

  // Fetch reviews
  const fetchReviews = async () => {
    if (!id) return; // don't call API if id is missing
    // console.log("Fetching reviews for product:", id);

    const token = localStorage.getItem("authToken");
    if (!token) {
      // console.warn("No auth token found!");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}getReviewsByProduct/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setReviews(
          Array.isArray(response.data.reviews) ? response.data.reviews : []
        );
      } else {
        // console.warn(response.data.message);
        setReviews([]);
      }
    } catch (error) {
      // console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "reviews") {
      fetchReviews();
    }
  };

  const handleAddToCart = () => {
    protectedCartAction(
      () => {
        addToCart({ productid: product.id, quantity: quantity });
        showToast(`${product.name} added to cart successfully!`, "success");
      },
      {
        showToast: showToast,
        successMessage: `${product.name} added to cart successfully!`,
      }
    );
  };

  // Enhanced wishlist handler with professional UX
  const handleWishlistToggle = async () => {
    protectedWishlistAction(
      async () => {
        try {
          const res = await toggleWishlist(product.id);
          if (res.success) {
            const action = product.isInWishlist ? "removed from" : "added to";
            showToast(`${product.name} ${action} your wishlist!`, "success");

            // Update local state if needed
            if (res.data?.wishlistUpdated) {
              // You might want to refresh the wishlist context here
            }
          } else {
            showToast(res.message || "Failed to update wishlist", "error");
          }
        } catch (error) {
          showToast("Failed to update wishlist. Please try again.", "error");
        }
      },
      {
        showToast: showToast,
      }
    );
  };

  // Submit review
  const submitReview = async () => {
    if (
      !reviewForm.rating ||
      !reviewForm.title.trim() ||
      !reviewForm.content.trim()
    ) {
      showToast("Please fill in all fields and provide a rating", "error");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const token = localStorage.getItem("authToken");

      const productId = product.id;
      const response = await axios.post(
        `${BACKEND_URL}saveProductReview`,
        {
          productId: productId, // You need to define productId from your component's context
          rating: reviewForm.rating,
          reviewText: reviewForm.content.trim(),
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        showToast("Review submitted successfully!", "success");
        setReviewForm({
          rating: 0,
          title: "",
          content: "",
          hoverRating: 0,
        });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        showToast(response.data.message || "Failed to submit review", "error");
      }
    } catch (error) {
      // console.error("Error submitting review:", error);
      showToast(
        error.response?.data?.message || "Failed to submit review",
        "error"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fetch featured categories with coupons
  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        setLoadingCoupons(true);
        const token = localStorage.getItem("authToken");

        const response = await axios.post(
          `${BACKEND_URL}activeCouponProducts`,
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.data.success) {
          setFeaturedCategories(response.data.data);

          // Find coupons applicable to this product
          const applicable = response.data.data.filter(
            (item) => item.productid === parseInt(id)
          );
          setApplicableCoupons(applicable);
        }
      } catch (error) {
        // console.error("Error fetching featured categories:", error);
      } finally {
        setLoadingCoupons(false);
      }
    };

    fetchFeaturedCategories();
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // const loadProduct = async () => {
    //   try {
    //     const res = await axios.post(`${BACKEND_URL}getProductById/${id}`);
    //     const productData = res.data?.data?.product;

    //     if (!isMounted || !productData) return;

    //     // Map API response to UI-friendly structure
    //     const mapped = {
    //       id: productData.id,
    //       name: productData.name,
    //       description: productData.description,
    //       howToWear: productData.howToWear || "",
    //       brand: "Unknown Brand",

    //       // ⭐ Rating setup
    //       rating:
    //         productData.avgRating && productData.avgRating <= 5
    //           ? productData.avgRating
    //           : 0, // fallback: no rating yet, safe default
    //       reviews: productData.reviews || 0,
    //       reviewList: productData.reviewList || [],

    //       // Usage for images array
    //       images: productData.images.map((img) => ({
    //         src: normalizeImage(img.imageData),
    //         alt: img.altText || productData.name,
    //       })),

    //       // Apply to main image
    //       mainImage: productData.images[0]
    //         ? normalizeImage(productData.images[0].imageData)
    //         : "",

    //       size: productData.sizes.map((s) => s.size), // extract just size
    //       sizeDetails: productData.sizes, // keep full details
    //       material: ["Leather", "Synthetic"], // fallback until API provides
    //       advantages: productData.advantages
    //         ? productData.advantages.split(",").map((a) => a.trim())
    //         : [],
    //       shipping: "Delivered in 5-7 business days",
    //     };

    //     // console.log("Mapped Product:", mapped);
    //     setProduct(mapped);
    //     setMainImage(mapped.mainImage);
    //     setSelectedSize(mapped.size[0] || "");
    //     setSelectedMaterial(mapped.material[0] || "");
    //     setLoading(false);
    //   } catch (err) {
    //     // console.error("Error loading product:", err);
    //     if (isMounted) {
    //       setError("Failed to load product.");
    //       setLoading(false);
    //     }
    //   }
    // };

    const loadProduct = async () => {
      try {
        const token = localStorage.getItem("authToken");
        let userId = null;

        // ✅ Decode userId from JWT (if logged in)
        if (token) {
          try {
            const decoded = jwtDecode(token);
            userId = decoded?.id || decoded?.userId || null; // adjust based on your JWT payload key
          } catch (err) {
            console.warn("Invalid token:", err);
          }
        }

        // ✅ Make request
        const res = await axios.post(
          `${BACKEND_URL}getProductById/${id}`,
          { userId }, // include userId in body
          {
            headers: token ? { Authorization: token } : {},
          }
        );

        const productData = res.data?.data?.product;
        if (!isMounted || !productData) return;

        // --- map productData as before ---
        const mapped = {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          howToWear: productData.howToWear || "",
          brand: "Unknown Brand",
          rating:
            productData.avgRating && productData.avgRating <= 5
              ? productData.avgRating
              : 0,
          reviews: productData.reviews || 0,
          reviewList: productData.reviewList || [],
          images: productData.images.map((img) => ({
            src: normalizeImage(img.imageData),
            alt: img.altText || productData.name,
          })),
          mainImage: productData.images[0]
            ? normalizeImage(productData.images[0].imageData)
            : "",
          size: productData.sizes.map((s) => s.size),
          sizeDetails: productData.sizes,
          material: ["Leather", "Synthetic"],
          advantages: productData.advantages
            ? productData.advantages.split(",").map((a) => a.trim())
            : [],
          shipping: "Delivered in 5-7 business days",
          isInWishlist: !!productData.isInWishlist,
        };

        setProduct(mapped);
        setMainImage(mapped.mainImage);
        setSelectedSize(mapped.size[0] || "");
        setSelectedMaterial(mapped.material[0] || "");
        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load product.");
          setLoading(false);
        }
      }
    };

    loadProduct();
    fetchReviews(); // Fetch reviews when component mounts

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Add this function to your component
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<AiFillStar key={`full-${i}`} className="text-lg" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" className="text-lg" />);
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<AiOutlineStar key={`empty-${i}`} className="text-lg" />);
    }

    return stars;
  };

  const isWishlisted =
    product?.isInWishlist || wishlist.some((item) => item.id === product?.id);

  const showToast = (message, type = "success") => {
    setCustomToast({ message, type, visible: true });
  };

  const toggleLike = async (reviewId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}review/${reviewId}/like`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setLikedReviews((prev) =>
          prev.includes(reviewId)
            ? prev.filter((id) => id !== reviewId)
            : [...prev, reviewId]
        );
      }
    } catch (error) {
      // console.error("Error toggling review like:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const getOriginalPrice = () => {
    const selected = product?.sizeDetails?.find((s) => s.size === selectedSize);
    return selected ? selected.dummyPrice : 0;
  };

  const getAdjustedPrice = () => {
    if (!product || !product.sizeDetails) return 0;

    // Find the size object that matches the selected size
    const selected = product.sizeDetails.find((s) => s.size === selectedSize);

    if (!selected) return 0;

    return selected.price * quantity;
  };

  const handleImageZoom = (e) => {
    if (!isImageZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
  };

  const resetZoom = () => {
    setZoomStyle({});
    setIsImageZoomed(false);
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-xl text-color-text-muted font-light">
        Loading product...
      </div>
    );

  if (error || !product) {
    return (
      <div className="text-center mt-20 text-xl text-color-text-muted font-light">
        {error || "Product not found!"}
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-color-primary text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Function to toggle wishlist
  const toggleWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}manageWishlist`,
        { productId }, // body
        {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`, // JWT
          },
        }
      );

      return data; // { success, message }
    } catch (error) {
      // console.error("Wishlist API Error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error updating wishlist",
      };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-color-background min-h-screen">
      <div className="w-full max-w-[1400px] mx-auto px-5 md:px-12 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-color-text-muted mb-6 flex items-center">
          <span
            className="hover:text-color-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          {/* <FiChevronRight className="mx-2 text-xs" />
          <span className="hover:text-color-primary cursor-pointer">
            Jewelry
          </span> */}
          <FiChevronRight className="mx-2 text-xs" />
          <span className="text-color-primary">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:w-1/2">
            <div className="flex flex-col lg:sticky top-24 self-start lg:flex-row gap-6 lg:items-start">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible px-2 lg:px-0 order-2 lg:order-1 hide-scrollbar">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-sm cursor-pointer border transition-all duration-300 ease-in-out
                      ${
                        mainImage === img.src
                          ? "ring-2 ring-color-primary ring-offset-2 scale-105 border-color-primary"
                          : "border-color-border hover:border-color-primary opacity-80 hover:opacity-100"
                      }`}
                    onClick={() => {
                      setMainImage(img.src);
                      resetZoom();
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Main image */}
              <div
                className={`relative w-full max-w-lg aspect-[3/4] bg-color-surface rounded-lg shadow-lg mx-auto order-1 lg:order-2 overflow-hidden group ${
                  isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
                onMouseMove={handleImageZoom}
                onMouseLeave={resetZoom}
              >
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-500"
                  style={zoomStyle}
                />

                <div className="absolute bottom-4 right-4 bg-black/70 text-color-surface text-xs px-3 py-2 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiZoomIn className="text-sm" />
                  {isImageZoomed ? "Click to zoom out" : "Click to zoom"}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-sm font-medium text-color-primary uppercase tracking-wider mb-2">
                {product.brand}
              </h2>
              <h1 className="text-3xl font-serif font-normal text-color-text leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-color-rating">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-color-text-muted">
                  ({reviews.length} reviews)
                </span>
                <span className="text-sm font-medium text-color-accent-green ml-4">
                  In Stock
                </span>
              </div>
              <div className="text-2xl font-light text-color-text mb-2">
                <span className="line-through text-color-text-muted mr-2">
                  ₹ {getOriginalPrice()}
                </span>
                ₹ {getAdjustedPrice()}
              </div>
            </div>

            {/* Size Picker */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-3 text-color-text tracking-wider uppercase">
                SELECT SIZE
              </label>
              <div className="flex flex-wrap gap-3">
                {product.size.map((item) => (
                  <button
                    key={item}
                    className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${
                      selectedSize === item
                        ? "bg-color-primary text-color-surface border border-color-primary shadow-md"
                        : "bg-color-surface text-color-text border border-color-border hover:border-color-primary hover:shadow-md"
                    }`}
                    onClick={() => setSelectedSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Picker */}
            {/* <div className="mb-6">
              <label className="block text-xs font-semibold mb-3 text-color-text tracking-wider uppercase">SELECT JEWELRY TYPE</label>
              <div className="flex flex-wrap gap-3">
                {product.material.map((item) => (
                  <button
                    key={item}
                    className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${selectedMaterial === item
                      ? "bg-color-primary text-color-surface border border-color-primary shadow-md"
                      : "bg-color-surface text-color-text border border-color-border hover:border-color-primary hover:shadow-md"
                      }`}
                    onClick={() => setSelectedMaterial(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Quantity & Price */}
            <div className="flex items-center gap-10 mb-6">
              <div className="flex items-center border border-color-border rounded-sm overflow-hidden bg-color-surface">
                <button
                  className="px-4 py-2 text-lg text-color-text-muted hover:bg-color-primary hover:text-color-surface transition-all duration-200"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  className="w-12 text-center bg-transparent focus:outline-none text-color-text font-medium"
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                />
                <button
                  className="px-4 py-2 text-lg text-color-text-muted hover:bg-color-primary hover:text-color-surface transition-all duration-200"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              <div>
                <span className="text-xs text-color-text-muted block mb-1">
                  TOTAL PRICE
                </span>
                <div className="text-xl font-semibold text-color-primary">
                  ₹ {getAdjustedPrice()}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                className="bg-color-primary text-color-surface px-10 py-3.5 font-medium text-sm hover:bg-color-primary-dark transition-all duration-300 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z"
                  />
                </svg>
                <span className="relative">
                  ADD TO BAG
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-color-surface group-hover:w-full transition-all duration-300 ease-out"></span>
                </span>
              </Button>

              <Button
                onClick={handleWishlistToggle}
                className={`px-8 py-3.5 font-medium text-sm transition-all duration-300 ease-out transform hover:scale-105 flex items-center justify-center gap-3 group ${
                  isWishlisted
                    ? "bg-gradient-to-r from-color-primary to-color-primary-dark text-color-surface shadow-lg hover:shadow-xl"
                    : "bg-color-surface text-color-text border-2 border-color-border hover:border-color-primary hover:shadow-md"
                }`}
              >
                {isWishlisted ? (
                  <>
                    <AiFillHeart className="text-lg animate-pulse group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative">
                      WISHLISTED
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-color-surface group-hover:w-full transition-all duration-300 ease-out"></span>
                    </span>
                  </>
                ) : (
                  <>
                    <AiOutlineHeart className="text-lg group-hover:scale-110 group-hover:text-color-primary transition-all duration-300" />
                    <span className="relative">
                      ADD TO WISHLIST
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-color-primary group-hover:w-full transition-all duration-300 ease-out"></span>
                    </span>
                  </>
                )}
              </Button>
            </div>
            {/* Delivery Section */}
            {/* <div className="bg-color-surface border border-color-border rounded-sm p-5 flex flex-col gap-4 text-sm mb-6">
              <div className="flex gap-3 items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-color-primary-light rounded-full text-center text-color-primary">
                  🚚
                </span>
                <div>
                  <div className="font-semibold text-color-text">Free Shipping</div>
                  <div className="text-xs text-color-text-muted">
                    On orders over ₹5,000
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-color-primary-light rounded-full text-center text-color-primary">
                  ↩️
                </span>
                <div>
                  <div className="font-semibold text-color-text">Return Delivery</div>
                  <div className="text-xs text-color-text-muted">
                    Free 30 days Delivery Return
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-color-primary-light rounded-full text-center text-color-primary">
                  🔒
                </span>
                <div>
                  <div className="font-semibold text-color-text">Secure Payment</div>
                  <div className="text-xs text-color-text-muted">
                    Your transaction is secured with SSL encryption
                  </div>
                </div>
              </div>
            </div> */}

            {/* Coupon Section */}
            <div className="bg-color-surface border border-color-border rounded-sm p-5 flex flex-col gap-4 text-sm mb-6">
              <div className="flex gap-3 items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-color-primary-light rounded-full text-center text-color-primary">
                  🎫
                </span>
                <div>
                  <div className="font-semibold text-color-text">
                    Special Offers
                  </div>
                  <div className="text-xs text-color-text-muted">
                    Available discounts for your order
                  </div>
                </div>
              </div>

              {!loadingCoupons &&
                applicableCoupons.map((coupon, index) => {
                  const copyToClipboard = () => {
                    navigator.clipboard
                      .writeText(coupon.couponcode)
                      .then(() => {
                        const element = document.getElementById(
                          `coupon-${index}`
                        );
                        if (element) {
                          element.textContent = "✓ Copied!";
                          setTimeout(() => {
                            element.textContent = "Tap to copy"; // message after 2 seconds
                          }, 2000);
                        }
                      })
                      .catch((err) => {
                        // console.error('Failed to copy: ', err);
                      });
                  };

                  return (
                    <div key={index} className="flex gap-3 items-center mt-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-color-accent-green/20 rounded-full text-center text-color-accent-green">
                        🔖
                      </span>
                      <div className="flex-1">
                        <div
                          className="font-semibold text-color-text cursor-pointer"
                          onDoubleClick={copyToClipboard}
                        >
                          Use code:{" "}
                          <span className="text-color-primary">
                            {coupon.couponcode}
                          </span>
                          <span
                            id={`coupon-${index}`}
                            className="ml-2 text-xs text-color-text-muted"
                          >
                            Double tap to copy
                          </span>
                        </div>
                        <div className="text-xs text-color-text-muted">
                          Save{" "}
                          {coupon.DiscountType === "PERCENTAGE"
                            ? `${coupon.DiscountValue}%`
                            : `₹${coupon.DiscountValue}`}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {loadingCoupons && (
                <div className="flex gap-3 items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-color-primary-light rounded-full text-center text-color-primary">
                    🎫
                  </span>
                  <div>
                    <div className="font-semibold text-color-text">
                      Checking for offers...
                    </div>
                    <div className="text-xs text-color-text-muted">
                      Loading available discounts
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion FAQs */}
            <div className="mt-2">
              {productquestions.map((item, index) => (
                <AccordionItem key={index} title={item.title}>
                  {item.content}
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-color-border mb-8 mt-12">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === "description"
                  ? "border-color-primary text-color-primary"
                  : "border-transparent text-color-text-muted hover:text-color-text"
              }`}
              onClick={() => handleTabChange("description")}
            >
              DESCRIPTION
            </button>

            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === "reviews"
                  ? "border-color-primary text-color-primary"
                  : "border-transparent text-color-text-muted hover:text-color-text"
              }`}
              onClick={() => handleTabChange("reviews")}
            >
              REVIEWS ({reviews.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "description" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-8">
            {/* Left Column: About & Advantages */}
            <div>
              {/* About This Masterpiece */}
              <h3 className="text-xl font-serif font-normal text-color-text mb-6">
                About This Masterpiece
              </h3>
              <p className="text-color-text-light mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* How to Wear */}
              {product.howToWear && (
                <>
                  <h4 className="text-lg font-serif font-medium text-color-text mb-2">
                    How to Wear
                  </h4>
                  <p className="text-color-text-light mb-6 leading-relaxed">
                    {product.howToWear}
                  </p>
                </>
              )}

              {/* Craftsmanship & Advantages */}
              {product.advantages.length > 0 && (
                <>
                  <h4 className="text-xl font-serif font-normal text-color-text mb-4">
                    Craftsmanship & Advantages
                  </h4>
                  <ul className="text-color-text-light space-y-3">
                    {product.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-color-primary mr-3">•</span>
                        {adv}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Right Column: Shipping & Care */}
            <div>
              <h3 className="text-xl font-serif font-normal text-color-text mb-6">
                Shipping & Care
              </h3>
              <p className="text-color-text-light mb-6 leading-relaxed">
                {product.shipping}
              </p>

              <div className="bg-color-background-alt p-6 border border-color-border rounded-sm">
                <h4 className="font-serif font-normal text-color-text mb-3">
                  Jewelry Care Instructions
                </h4>
                <ul className="text-sm text-color-text-light space-y-2">
                  <li className="flex items-start">
                    <span className="text-color-primary mr-2">•</span>
                    Store in a soft pouch to prevent scratches
                  </li>
                  <li className="flex items-start">
                    <span className="text-color-primary mr-2">•</span>
                    Avoid contact with perfumes and chemicals
                  </li>
                  <li className="flex items-start">
                    <span className="text-color-primary mr-2">•</span>
                    Clean with a soft, dry cloth after wear
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="py-8">
            {/* Review Header */}
            {/* Review Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-serif font-normal text-color-text mb-2">
                  Customer Reviews
                </h2>
                <div className="flex items-center">
                  <div className="flex text-color-rating mr-2">
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(product.rating)) {
                        // Full star
                        return <AiFillStar key={i} className="text-lg" />;
                      } else if (
                        i === Math.floor(product.rating) &&
                        product.rating % 1 !== 0
                      ) {
                        // Half star
                        return <BsStarHalf key={i} className="text-lg" />;
                      } else {
                        // Empty star
                        return <AiOutlineStar key={i} className="text-lg" />;
                      }
                    })}
                  </div>
                  <span className="text-color-text-muted text-sm">
                    Based on {reviews.length} reviews
                  </span>
                </div>
              </div>

              <button
                className="bg-color-primary text-color-surface px-6 py-3 rounded-sm text-sm font-medium hover:bg-opacity-90 transition-colors"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <div className="bg-color-surface border-2 border-color-border rounded-lg p-8 mb-10 shadow-sm">
                <h3 className="text-xl font-serif font-normal text-color-text mb-2">
                  Write a Review
                </h3>
                <p className="text-color-text-muted text-sm mb-8">
                  What is it like to use this Product?
                </p>

                {/* Rating Section */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-color-text mb-3 uppercase tracking-wider">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl transition-colors duration-200 hover:scale-110"
                        onMouseEnter={() =>
                          setReviewForm((prev) => ({
                            ...prev,
                            hoverRating: star,
                          }))
                        }
                        onMouseLeave={() =>
                          setReviewForm((prev) => ({ ...prev, hoverRating: 0 }))
                        }
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating: star }))
                        }
                      >
                        {star <=
                        (reviewForm.hoverRating || reviewForm.rating) ? (
                          <AiFillStar className="text-color-rating" />
                        ) : (
                          <AiOutlineStar className="text-color-text-muted" />
                        )}
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-color-text-muted">
                      {reviewForm.rating > 0 &&
                        `${reviewForm.rating} star${
                          reviewForm.rating > 1 ? "s" : ""
                        }`}
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-color-text mb-3 uppercase tracking-wider">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Great Product!"
                    className="w-full px-4 py-3 border-2 border-color-border rounded-sm bg-color-background focus:border-color-primary focus:outline-none text-color-text placeholder-color-text-muted transition-colors duration-200"
                    maxLength={100}
                  />
                  <div className="text-right text-xs text-color-text-muted mt-1">
                    {reviewForm.title.length}/100
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-color-text mb-3 uppercase tracking-wider">
                    Review Content *
                  </label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Share your thoughts about this product..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-color-border rounded-sm bg-color-background focus:border-color-primary focus:outline-none text-color-text placeholder-color-text-muted resize-none transition-colors duration-200"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-color-text-muted mt-1">
                    {reviewForm.content.length}/500
                  </div>
                </div>

                {/* Review Tips */}
                <div className="bg-color-background border-2 border-color-border rounded-sm p-6 mb-8">
                  <h4 className="text-sm font-semibold text-color-text mb-3 uppercase tracking-wider">
                    Review Tips
                  </h4>
                  <ul className="text-sm text-color-text-light space-y-2">
                    <li className="flex items-start">
                      <span className="text-color-primary mr-3 mt-1">•</span>
                      Focus on the product's features and your experience
                    </li>
                    <li className="flex items-start">
                      <span className="text-color-primary mr-3 mt-1">•</span>
                      Mention quality, comfort, and value for money
                    </li>
                    <li className="flex items-start">
                      <span className="text-color-primary mr-3 mt-1">•</span>
                      Be honest and helpful to other customers
                    </li>
                    <li className="flex items-start">
                      <span className="text-color-primary mr-3 mt-1">•</span>
                      Avoid personal information and irrelevant details
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={submitReview}
                    disabled={
                      isSubmittingReview ||
                      !reviewForm.rating ||
                      !reviewForm.title.trim() ||
                      !reviewForm.content.trim()
                    }
                    className="bg-color-primary text-color-surface px-8 py-3 rounded-sm text-sm font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewForm({
                        rating: 0,
                        title: "",
                        content: "",
                        hoverRating: 0,
                      });
                    }}
                    className="border-2 border-color-border px-8 py-3 rounded-sm text-sm font-semibold text-color-text hover:border-color-primary transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
              {reviewsLoading ? (
                <div className="text-center py-12">
                  <div className="text-color-text-muted">
                    Loading reviews...
                  </div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-16 border-2 border-color-border border-dashed rounded-lg">
                  <div className="text-color-text-muted mb-2">
                    No reviews yet
                  </div>
                  <p className="text-sm text-color-text-light mb-4">
                    Be the first to share your thoughts!
                  </p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-color-primary text-color-surface px-6 py-2 rounded-sm text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    WRITE THE FIRST REVIEW
                  </button>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.ReviewID}
                    className="bg-color-surface border-2 border-color-border rounded-lg p-8"
                  >
                    {/* Review Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-color-background rounded-full flex items-center justify-center border-2 border-color-border">
                          <FiUser className="text-xl text-color-text-muted" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-color-text">
                            {review.UserName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-color-rating">
                              {[...Array(5)].map((_, i) => {
                                if (i < Math.floor(review.Rating)) {
                                  return (
                                    <AiFillStar key={i} className="text-sm" />
                                  );
                                } else if (
                                  i === Math.floor(review.Rating) &&
                                  review.Rating % 1 !== 0
                                ) {
                                  return (
                                    <BsStarHalf key={i} className="text-sm" />
                                  );
                                } else {
                                  return (
                                    <AiOutlineStar
                                      key={i}
                                      className="text-sm text-color-text-muted"
                                    />
                                  );
                                }
                              })}
                            </div>
                            <span className="text-sm text-color-text-muted">
                              {formatDate(review.Created_Date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Like Button (optional since API doesn’t return likes yet) */}
                      {/* <button
                        onClick={() => toggleLike(review.ReviewID)}
                        className="flex items-center gap-2 text-sm text-color-text-muted hover:text-color-primary transition-colors duration-200"
                      >
                        {likedReviews.includes(review.ReviewID) ? (
                          <AiFillLike className="text-lg" />
                        ) : (
                          <AiOutlineLike className="text-lg" />
                        )}
                        <span>Helpful</span>
                      </button> */}
                    </div>

                    {/* Review Content */}
                    <div className="mb-6">
                      {/* <h5 className="font-semibold text-color-text mb-3 text-lg">
                       Review Title
                      </h5> */}
                      <p className="text-color-text-light text-lg leading-relaxed">
                        {review.ReviewText}
                      </p>
                    </div>

                    {/* Review Metadata */}
                    <div className="flex flex-wrap gap-4 text-xs text-color-text-muted">
                      {/* <span>Review ID: {review.ReviewID}</span> */}
                      {/* <span>•</span> */}
                      {/* <span>User ID: {review.UserID}</span> */}
                      {/* <span>•</span> */}
                      {/* <span>Product Name:  {review.UserName}</span> */}
                      {/* <span>•</span>
                      <span>Product: {review.ProductName}</span> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-20">
          {/* <h3 className="text-2xl font-serif font-normal text-color-text mb-10 text-center">You May Also Like</h3> */}
          <Recommendation products={recommendedProducts} />
        </div>
      </div>

      {/* Toast Notification */}
      {customToast.visible && (
        <Toast
          message={customToast.message}
          type={customToast.type}
          onClose={() =>
            setCustomToast((prev) => ({ ...prev, visible: false }))
          }
          duration={customToast.type === "success" ? 3000 : 4000}
        />
      )}
    </div>
  );
};

export default ProductDetails;
