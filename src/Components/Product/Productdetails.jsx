import React, { useState, useEffect } from "react";
import AccordionItem from "./AccordionItem";
import { useParams, useLocation } from "react-router-dom";
import { AiOutlineLike, AiFillLike, AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiChevronRight, FiZoomIn } from "react-icons/fi";
import Recommendation from "./Recommendation";
import Button from "../Button/Button";
import { useWishlist } from "../../Context/WishlistContext";
import { useCart } from "../../Context/CartContext";
import Toast from "./Toast";
import axios from "axios";

const productquestions = [
  {
    title: "What is the return policy?",
    content: "We offer a 30-day return policy for all unworn items in their original packaging with proof of purchase."
  },
  {
    title: "How do I care for my gemstone jewelry?",
    content: "Clean with a soft, dry cloth. Avoid contact with chemicals, perfumes, and water. Store in a soft pouch separately from other jewelry."
  },
  {
    title: "Are the gemstones authentic?",
    content: "Yes, all our gemstones are 100% authentic and come with a certificate of authenticity."
  },
  {
    title: "Do you offer custom designs?",
    content: "Yes, we offer custom design services. Please contact our customer service team for more information."
  },
  {
    title: "How long does shipping take?",
    content: "Standard shipping takes 3-5 business days. Express shipping is available for an additional fee with 1-2 day delivery."
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const passedProduct = state?.product;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [likedReviews, setLikedReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });
  const [zoomStyle, setZoomStyle] = useState({});
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const { addToWishlist, wishlist } = useWishlist();
  const { addToCart } = useCart();

  // Helper function to map product data from API to our expected format
  const mapProductData = (data) => ({
    id: data.ID || data.id || id,
    name: data.Name || data.name || "Gemstone Product",
    brand: data.Brand || data.brand || "STYLIUM",
    rating: data.Rating || data.rating || 4.5,
    reviews: data.Reviews || data.reviews || 0,
    price: typeof data.price === "string"
      ? parseFloat(data.price.replace(/[^\d.]/g, ""))
      : parseFloat(data.Price || data.price || 0),
    inStock: data.InStock !== undefined ? data.InStock : true,
    mainImage: data.Image || data.image || data.mainImage || data.img || "/s2.jpeg",
    size: Array.isArray(data.Size) ? data.Size : ["5 Ratti", "6 Ratti"],
    material: Array.isArray(data.Material) ? data.Material : ["Gemstone", "Pendant", "Necklace"],
    images: Array.isArray(data.Images)
      ? data.Images.map((img) => ({ src: img, alt: "Product Image" }))
      : [
          {
            src: data.Image || data.image || "/s1.jpeg",
            alt: "Product Image",
          },
        ],
    description: data.Description || data.description || "Beautiful gemstone jewelry",
    advantages: Array.isArray(data.Advantages)
      ? data.Advantages
      : typeof data.Advantages === "string"
      ? [data.Advantages]
      : ["Feature 1", "Feature 2", "Feature 3"],
    shipping: data.Shipping || "Free standard shipping on orders over ₹5,000",
    reviewList: Array.isArray(data.ReviewList) ? data.ReviewList : [],
  });

  // Fetch recommended products
  const fetchRecommendedProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/getAllProducts");
      const apiProducts = Array.isArray(res.data) ? res.data : res.data?.products || [];
      const filtered = apiProducts.filter(p => (p.ID || p.id) !== id);
      const recommended = filtered.map(p => mapProductData(p));
      setRecommendedProducts(recommended.slice(0, 4)); // pick first 4
    } catch (err) {
      console.error("Error fetching recommended products:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadProduct = async () => {
      try {
        let productData = passedProduct;

        if (!productData) {
          const res = await axios.get(`http://localhost:8001/api/getProductById/${id}`);
          productData = res.data;
        }

        if (!isMounted) return;

        const mapped = mapProductData(productData);
        setProduct(mapped);
        setMainImage(mapped.mainImage);
        setSelectedSize(mapped.size[0] || "");
        setSelectedMaterial(mapped.material[0] || "");
        setLoading(false);

        fetchRecommendedProducts();
      } catch (err) {
        console.error("Error loading product:", err);
        if (isMounted) {
          setError("Failed to load product.");
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, passedProduct]);

  const isWishlisted = wishlist.some((item) => item.id === product?.id);

  const showToast = (message, type = "success") =>
    setToast({ message, type, visible: true });

  const toggleLike = (idx) =>
    setLikedReviews((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const getAdjustedPrice = () => {
    if (!product || typeof product.price !== "number") return 0;
    let extra = 0;
    if (selectedMaterial === "Necklace") extra = 1000;
    else if (selectedMaterial === "Pendant") extra = 1500;
    return (product.price + extra) * quantity;
  };

  const handleImageZoom = (e) => {
    if (!isImageZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
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

  if (error || !product)
    return (
      <div className="text-center mt-20 text-xl text-color-text-muted font-light">
        {error || "Product not found!"}
      </div>
    );

  return (
    <div className="bg-color-background min-h-screen">  
      <div className="w-full max-w-[1400px] mx-auto px-5 md:px-12 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-color-text-muted mb-6 flex items-center">
          <span className="hover:text-color-primary cursor-pointer">Home</span>
          <FiChevronRight className="mx-2 text-xs" />
          <span className="hover:text-color-primary cursor-pointer">Jewelry</span>
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
                      ${mainImage === img.src
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
                className={`relative w-full max-w-lg aspect-[3/4] bg-color-surface rounded-lg shadow-lg mx-auto order-1 lg:order-2 overflow-hidden group ${isImageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
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
                  {isImageZoomed ? 'Click to zoom out' : 'Click to zoom'}
                </div>

                {/* Premium badge */}
                <div className="absolute top-4 left-4 bg-color-primary text-color-surface text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  LUXURY COLLECTION
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-sm font-medium text-color-primary uppercase tracking-wider mb-2">{product.brand}</h2>
              <h1 className="text-3xl font-serif font-normal text-color-text leading-tight mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-color-rating">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating) ?
                      <AiFillStar key={i} className="text-lg" /> :
                      <AiOutlineStar key={i} className="text-lg" />
                  ))}
                </div>
                <span className="text-sm text-color-text-muted">({product.reviews} reviews)</span>
                <span className="text-sm font-medium text-color-accent-green ml-4">In Stock</span>
              </div>

              <div className="text-2xl font-light text-color-text mb-2">₹ {getAdjustedPrice().toLocaleString('en-IN')}</div>
            </div>

            {/* Size Picker */}
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-3 text-color-text tracking-wider uppercase">SELECT SIZE</label>
              <div className="flex flex-wrap gap-3">
                {product.size.map((item) => (
                  <button
                    key={item}
                    className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 ${selectedSize === item
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
            <div className="mb-6">
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
            </div>

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
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                />
                <button
                  className="px-4 py-2 text-lg text-color-text-muted hover:bg-color-primary hover:text-color-surface transition-all duration-200"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <div>
                <span className="text-xs text-color-text-muted block mb-1">TOTAL PRICE</span>
                <div className="text-xl font-semibold text-color-primary">₹ {getAdjustedPrice().toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={() => {
                  addToCart(product);
                  showToast(`${product.name} added to Bag`, "success");
                }}
                className="bg-color-primary text-color-surface px-10 py-3.5 font-medium text-sm hover:bg-color-primary-dark transition-all duration-300 shadow-md hover:shadow-lg flex-1"
              >
                ADD TO BAG
              </Button>

              <Button
                onClick={() => {
                  addToWishlist(product);
                  showToast(`${product.name} ${isWishlisted ? 'removed from' : 'added to'} Wishlist`, "success");
                }}
                className={`px-6 py-3.5 font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg border ${isWishlisted
                  ? "bg-color-primary border-color-primary text-color-surface"
                  : "border-color-primary text-color-primary hover:bg-color-primary hover:text-color-surface"
                  }`}
              >
                {isWishlisted ?
                  <AiFillHeart className="inline mr-2 text-lg" /> :
                  <AiOutlineHeart className="inline mr-2 text-lg" />
                }
                Wishlist
              </Button>
            </div>

            {/* Delivery Section */}
            <div className="bg-color-surface border border-color-border rounded-sm p-5 flex flex-col gap-4 text-sm mb-8">
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

        {/* Tabs Section */}
        <div className="mt-16 w-full">
          <div className="flex gap-10 border-b border-color-border text-lg font-medium mb-8">
            <button
              className={`${activeTab === "description" ? "border-b-2 border-color-primary text-color-text" : "text-color-text-muted"} pb-3 transition-all duration-300 font-serif`}
              onClick={() => setActiveTab("description")}
            >
              DESCRIPTION
            </button>
            <button
              className={`${activeTab === "reviews" ? "border-b-2 border-color-primary text-color-text" : "text-color-text-muted"} pb-3 transition-all duration-300 font-serif`}
              onClick={() => setActiveTab("reviews")}
            >
              REVIEWS ({product.reviews})
            </button>
          </div>

          {activeTab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-8">
              <div>
                <h3 className="text-xl font-serif font-normal text-color-text mb-6">About This Masterpiece</h3>
                <p className="text-color-text-light mb-6 leading-relaxed">{product.description}</p>
                <h4 className="text-xl font-serif font-normal text-color-text mb-6">Craftsmanship & Advantages</h4>
                <ul className="text-color-text-light space-y-3">
                  {product.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-color-primary mr-3">•</span>
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-serif font-normal text-color-text mb-6">Shipping & Care</h3>
                <p className="text-color-text-light mb-6 leading-relaxed">{product.shipping}</p>

                <div className="bg-color-background-alt p-6 border border-color-border rounded-sm">
                  <h4 className="font-serif font-normal text-color-text mb-3">Jewelry Care Instructions</h4>
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
            <div className="space-y-8 py-8">
              <h3 className="text-2xl font-serif font-normal text-color-text mb-8">Customer Experiences</h3>

              {/* Review List */}
              {product.reviewList.length > 0 ? (
                <div className="space-y-8">
                  {product.reviewList.map((rev, idx) => (
                    <div key={idx} className="border-b border-color-border pb-8 last:border-b-0">
                      {/* User Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-color-primary flex items-center justify-center text-color-surface font-bold text-lg">
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-color-text">{rev.user}</h4>
                          <span className="text-xs text-color-text-muted">Verified Purchase • 3 days ago</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-color-rating text-md">
                          {[...Array(5)].map((_, i) => (
                            i < rev.rating ?
                              <AiFillStar key={i} className="inline" /> :
                              <AiOutlineStar key={i} className="inline" />
                          ))}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-color-text-light leading-relaxed">{rev.comment}</p>

                      {/* Actions */}
                      <div className="flex gap-5 text-sm text-color-text-muted mt-4">
                        <button
                          className="flex items-center gap-1 hover:text-color-primary transition-colors duration-200"
                          onClick={() => toggleLike(idx)}
                        >
                          {likedReviews.includes(idx) ? (
                            <AiFillLike className="text-color-primary text-lg" />
                          ) : (
                            <AiOutlineLike className="text-lg hover:text-color-primary" />
                          )}
                          <span>{likedReviews.includes(idx) ? "Liked" : "Helpful"}</span>
                        </button>
                        <button className="hover:text-color-primary transition-colors duration-200">
                          Reply
                        </button>
                        <button className="hover:text-color-primary transition-colors duration-200">
                          Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-color-text-muted italic text-center py-10">No reviews yet. Be the first to share your experience with this exquisite piece.</p>
              )}

              {/* Write Review Form */}
              <div className="mt-12 p-8 border border-color-border rounded-sm bg-color-surface">
                <h4 className="font-serif text-xl font-normal text-color-text mb-6">Share Your Experience</h4>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-color-text mb-3">
                    Your Rating
                  </label>
                  <div className="flex text-color-rating text-2xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform duration-200 hover:scale-110 mr-1"
                      >
                        {star <= (hover || rating) ? <AiFillStar /> : <AiOutlineStar />}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-color-text mb-3">
                    Review Title
                  </label>
                  <input
                    type="text"
                    placeholder="Share your overall impression"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-color-border rounded-sm focus:outline-none focus:ring-1 focus:ring-color-primary transition-all duration-200"
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-color-text mb-3">
                    Your Review
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell others about your experience with this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-color-border rounded-sm focus:outline-none focus:ring-1 focus:ring-color-primary transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  onClick={() => {
                    if (rating === 0 || !comment.trim()) {
                      showToast("Please give a rating and write your review!", "error");
                      return;
                    }
                    const newReview = {
                      user: "You",
                      rating,
                      comment: `${title ? title + " - " : ""}${comment}`,
                    };
                    console.log("Submitted Review:", newReview);
                    showToast("Thank you for your review!", "success");
                  }}
                  className="bg-color-primary text-color-surface px-8 py-3.5 rounded-sm font-medium hover:bg-color-primary-dark transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Share Your Review
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-20">
          <h3 className="text-2xl font-serif font-normal text-color-text mb-10 text-center">You May Also Like</h3>
          <Recommendation products={recommendedProducts} />
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </div>
  );
};

export default ProductDetails;