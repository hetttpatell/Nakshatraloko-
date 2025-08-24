import Input from "../Input/Input";
import React, { useState } from "react";
import AccordionItem from "./AccordionItem"
import { useParams } from "react-router-dom";
import { BsHandIndexFill } from "react-icons/bs";

const products = [
  {
    id: 1,
    name: "Stellar Dainty Diamond Hoop",
    brand: "STYLIUM",
    rating: 4.5,
    reviews: 22,
    price: 900,
    size: ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"],
    material: ["Gemstone", "Pendant", "Necklace"],
    images: [
      { src: "/s1.jpeg", alt: "Product Image 1" },
      { src: "/s2.jpeg", alt: "Product Image 2" },
      { src: "/s3.jpeg", alt: "Product Image 3" },
    ],
    description:
      "Cool off this summer in the Mini Ruffle Smocked Tank Top from our very own LA Hearts. This tank features a smocked body, adjustable straps, scoop neckline, ruffled hems, and a cropped fit.",
    advantages: [
      "Smocked body",
      "Adjustable straps",
      "Scoop neckline",
      "Ruffled hems",
      "Cropped length",
      "Model is wearing a small",
      "100% rayon",
      "Machine washable",
    ],
    shipping:
      "We offer Free Standard Shipping for all orders over $75 to the 50 states and the District of Columbia...",
    reviewList: [
      { user: "Het Patel", comment: "Amazing quality! Worth the price.", rating: 5 },
      { user: "Priya Shah", comment: "Looks good but delivery was late.", rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Another Product Name",
    brand: "PEARLIX",
    rating: 3.8,
    reviews: 12,
    price: 1200,
    size: ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"],
    material: ["Silver", "Gold", "Copper"],
    images: [
      { src: "/s2.jpeg", alt: "Product Image 1" },
      { src: "/s3.jpeg", alt: "Product Image 2" },
    ],
    description: "This is another product description.",
    advantages: ["Feature 1", "Feature 2", "Feature 3"],
    shipping: "Shipping info for product 2",
    reviewList: [
      { user: "Rahul Kumar", comment: "Good product overall.", rating: 4 },
    ],
  },
];
const productquestions = [
  {
    title: "Benefits",
    content: (
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        <li>Pukhraj promotes good health, supporting physical and mental well-being.</li>
        <li>It enhances immunity, helping the body resist illnesses and ailments.</li>
        <li>Pukhraj encourages healing, speeding up recovery and overall resilience.</li>
        <li>It boosts energy levels, fostering vitality and positivity.</li>
      </ul>
    ),
  },
  {
    title: "How to wear?",
    content: (
      <p className="text-sm text-gray-700">
        Wear Pukhraj on your index finger set in gold on a Thursday morning after
        sunrise. Chant Jupiter’s mantra for best results.
      </p>
    ),
  },
  {
    title: "Style tip",
    content: (
      <p className="text-sm text-gray-700">
        Pair it with ethnic outfits or minimal western wear to highlight its
        vibrant yellow shine.
      </p>
    ),
  },
  {
    title: "Best day to wear",
    content: (
      <p className="text-sm text-gray-700">Thursday is considered the most auspicious day.</p>
    ),
  },
  {
    title: "Packaging",
    content: (
      <p className="text-sm text-gray-700">
        Comes in premium jewelry packaging with authenticity certificate.
      </p>
    ),
  },
  {
    title: "Returns + Exchanges",
    content: (
      <p className="text-sm text-gray-700">
        30-day return and exchange policy applies. Conditions apply.
      </p>
    ),
  },
]
const colorOptions = [
  { value: "blue", color: "#314d62" },
  { value: "white", color: "#eee" },
  { value: "gold", color: "#e9b844" },
];




const Productdetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [mainImage, setMainImage] = useState(product?.images[0]?.src || "");
  const [selectedSize, setSelectedSize] = useState(product?.size[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState(product?.material[0] || "");

  // New state for tabs
  const [activeTab, setActiveTab] = useState("description");

  if (!product) return <div className="text-center mt-20">Product not found!</div>;
  const getAdjustedPrice = () => {
    if (!product || typeof product.price !== "number") return 0; // safeguard

    let extra = 0;
    if (selectedMaterial === "Necklace") {
      extra = 1000;
    } else if (selectedMaterial === "Pendant") {
      extra = 1500;
    } 

    return (product.price + extra) * Number(quantity || 1);
  };


  return (
    <div className="bg-[#f6f1eb] min-h-screen font-serif">
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 py-8">
        <nav className="text-xs text-[#404040] mb-4 opacity-80">Home / {product.name}</nav>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Section */}
          <div className="flex flex-col lg:flex-row gap-5 lg:w-1/2">
            <div className="flex flex-col lg:sticky top-20 self-start lg:flex-row gap-4 lg:items-start">

              {/* Main image */}
              <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-lg shadow mx-auto order-1 lg:order-2">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-90 h-full object-cover rounded-lg"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-3 mt-3 lg:mt-0 overflow-x-auto lg:overflow-visible px-2 lg:px-0 order-2 lg:order-1">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.src}
                    alt={img.alt}
                    className={`w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-md cursor-pointer border transition 
          ${mainImage === img.src ? "ring ring-black" : "ring-1 ring-gray-200 hover:ring-gray-400"}`}
                    onClick={() => setMainImage(img.src)}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-3xl flex items-center">
                  {"★".repeat(Math.floor(product.rating)) + "☆".repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="text-xs text-gray-400">({product.reviews})</span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#222] leading-tight mb-5">{product.name}</h1>
            </div>

            {/* Size Picker */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-gray-700">SELECT SIZE</label>
              <div className="flex flex-wrap gap-3">
                {product.size.map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${selectedSize === item
                      ? "bg-[#222] text-white border-[#222]"
                      : "border-gray-400 text-gray-700"
                      }`}
                    onClick={() => setSelectedSize(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Picker */}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-gray-700">SELECT JWELLERY</label>
              <div className="flex flex-wrap gap-3">
                {product.material.map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${selectedMaterial === item
                      ? "bg-[#222] text-white border-[#222]"
                      : "border-gray-400 text-gray-700"
                      }`}
                    onClick={() => setSelectedMaterial(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="flex items-center gap-8 mb-4">
              <div className="flex items-center border rounded overflow-hidden bg-white">
                <button
                  className="px-3 py-1 text-lg text-[#222]"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  className="w-10 text-center bg-transparent focus:outline-none"
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                />
                <button className="px-3 py-1 text-lg text-[#222]" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
              <div>
                <span className="text-sm text-gray-700">PRICE TOTAL</span>
                <div className="text-lg font-bold text-[#222]">₹ {getAdjustedPrice()}</div>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-5">
              <button className="bg-[#222] text-white px-8 py-2 rounded font-semibold text-sm">ADD TO BAG</button>
              <button className="border border-[#222] px-8 py-2 rounded font-semibold text-sm text-[#222]">SAVE</button>
            </div>
            {/* Delivery Section */}
            <div className="bg-[#fcf8f4] border border-gray-400 rounded p-4 flex flex-col gap-3 text-[15px]">
              <div className="flex gap-2 items-center">
                <span className="inline-block w-6 text-center text-lg">🚚</span>
                <div>
                  <div className="font-semibold text-gray-700">Free Shipping</div>
                  <div className="text-xs text-gray-500">
                    Enter your Postal code for Delivery Availability
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <span className="inline-block w-6 text-center text-lg">↩️</span>
                <div>
                  <div className="font-semibold text-gray-700">Return Delivery</div>
                  <div className="text-xs text-gray-500">
                    Free 30 days Delivery Return. Details
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-[#fcf8f4] border border-gray-400 mt-5 rounded p-4 flex flex-col gap-3 text-[15px]">
              <div className="flex flex-col gap-2 mt-3">
                <div className="font-semibold text-gray-700 flex items-center gap-2">
                  🎟️ Apply Coupon
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#222]"
                  />
                  <button className="bg-[#222] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#333]">
                    APPLY
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Use code <span className="font-semibold text-[#222]">SAVE10</span> for 10% off
                </p>
              </div>
            </div>
            <div className=" mt-8">
              {/* Information secttion (tabs) */}
              {productquestions.map((item, index) => (
                <AccordionItem key={index} title={item.title}>
                  {item.content}
                </AccordionItem>
              ))}
            </div>

          </div>
        </div>



        {/* Tabs Section */}
        <div className="mt-12 w-full">
          <div className="flex gap-7 border-b border-gray-300 text-lg font-medium mb-6">
            <button
              className={`${activeTab === "description" ? "border-b-2 border-[#222] text-[#222]" : "text-gray-400"} pb-2`}
              onClick={() => setActiveTab("description")}
            >
              DESCRIPTION
            </button>
            <button

              className={`${activeTab === "reviews" ? "border-b-2 border-[#222] text-[#222]" : "text-gray-400"} pb-2`}
              onClick={() => setActiveTab("reviews")}
            >
              REVIEWS
            </button>
          </div>

          {activeTab === "description" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="uppercase font-bold text-xs mb-2 text-[#222]">ABOUT PRODUCT</h3>
                <p className="text-sm text-[#333] mb-2">{product.description}</p>
                <h4 className="uppercase font-semibold text-xs mb-2 text-[#222]">ADVANTAGES</h4>
                <ul className="list-disc ml-5 text-sm text-[#333] mb-2">
                  {product.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="uppercase font-bold text-xs mb-2 text-[#222]">SHIPPING</h3>
                <p className="text-sm text-[#333] mb-2">{product.shipping}</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-section">
              <h3 className="uppercase font-bold text-sm mb-6 text-[#222] tracking-wide">
                CUSTOMER REVIEWS
              </h3>

              {/* Review List */}
              {product.reviewList.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {product.reviewList.map((rev, idx) => (
                    <div key={idx} className="border-b pb-5">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#314d62] flex items-center justify-center text-white font-bold">
                          {rev.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[#222]">{rev.user}</h4>
                          <span className="text-xs text-gray-500">3 days ago</span>
                        </div>
                      </div>

                      {/* Title + Rating */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-500 text-sm">
                          {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                        </span>
                        <p className="font-medium text-sm text-[#222]">{rev.comment.split(" ")[0]} Product</p>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>

                      {/* Actions */}
                      <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <button className="hover:underline">👍 Like</button>
                        <button className="hover:underline">↩️ Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
              )}

              {/* View All Reviews */}
              {product.reviewList.length > 2 && (
                <div className="text-center mt-5">
                  <button className="text-sm font-medium underline text-[#222] hover:text-gray-700">
                    View All Reviews
                  </button>
                </div>
              )}

              {/* Write Review Form */}
              <div className="mt-10 p-5 border rounded bg-[#fcf8f4]">
                <h4 className="font-bold text-base text-[#222] mb-3">Write a Review</h4>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What is it like to Product?
                  </label>
                  <div className="flex text-yellow-500 text-xl cursor-pointer">
                    {"★".repeat(5)}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title
                  </label>
                  <input
                    type="text"
                    placeholder="Great Products"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#222]"
                  />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Content
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your review here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#222]"
                  />
                </div>

                <button className="bg-[#222] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#333]">
                  Submit Review
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div >
  );
};

export default Productdetails;
