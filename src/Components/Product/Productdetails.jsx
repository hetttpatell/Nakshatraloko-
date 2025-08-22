
// // import { useParams } from "react-router-dom";

// // export default function Product() {
// //     const { id } = useParams();


// //     const products = [
// //         {
// //             id: "1",
// //             name: "14KT Yellow Gold Diamond Hoop Earrings",
// //             category: "Women | Earrings",
// //             price: "₹ 4,554.00",
// //             feature: "Healing Stone",
// //             img: "/s3.jpeg",
// //             rating: 4.5
// //         },
// //         {
// //             id: "2",
// //             name: "14KT Yellow Gold Diamond Hoop Earrings",
// //             category: "Women | Earrings",
// //             price: "₹ 4,554.00",
// //             feature: "Faster Growth",
// //             img: "/s2.jpeg",
// //             rating: 3.8
// //         },
// //         {
// //             id: "3",
// //             name: "14KT Yellow Gold Diamond Hoop Earrings",
// //             category: "Women | Earrings",
// //             price: "₹ 4,554.00",
// //             feature: "Faster Growth",
// //             img: "/s4.jpeg",
// //             rating: 3.8
// //         },
// //     ];

// //     const product = products.find((p) => p.id === id);

// //     if (!product) return <p>Product not found!</p>;

// //     return (
// //         <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] p-6">
// //             <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
// //             <img src={product.img} alt={product.name} className="w-64 h-64 object-cover mb-4" />
// //             <p className="text-lg font-semibold">{product.price}</p>
// //             <p className="text-gray-500">{product.category}</p>
// //             <p className="mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white inline-block px-3 py-1 rounded">{product.feature}</p>
// //             <p className="mt-2">Rating: {product.rating}</p>
// //         </div>

// //     );

// // }

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";

// // Replace with your actual products array
// const products = [
//   {
//     id: 1,
//     name: "14KT Yellow Gold ffffreDiamond Hoop Earrings",
//     brand: "STYLIUM",
//     rating: 4.5,
//     reviews: 22,
//     price: 4554,
//     images: [
//       { src: "/s3.jpeg", alt: "Image 1" },
//       { src: "/s2.jpeg", alt: "Image 2" },
//       { src: "/s3.jpeg", alt: "Image 3" },
//     ],
//     description: "Beautiful diamond hoop earring.",
//     advantages: ["High quality", "Durable", "Elegant design"],
//     shipping: "Free shipping over ₹5000",
//   },
//   {
//     id: 2,
//     name: "14KT ddwdrdrwdff Yellow Gold Diamond Hoop Earrings",
//     brand: "PEARLIX",
//     rating: 3.8,
//     reviews: 12,
//     price: 4554,
//     images: [
//       { src: "/s2.jpeg", alt: "Image 1" },
//       { src: "/s3.jpeg", alt: "Image 2" },
//     ],
//     description: "Elegant earrings with healing properties.",
//     advantages: ["Healing stone", "Comfortable fit"],
//     shipping: "Ships worldwide",
//   },
//   // Add more products here...
// ];

// const colorOptions = [
//   { value: "blue", color: "#314d62" },
//   { value: "white", color: "#eee" },
//   { value: "gold", color: "#e9b844" },
// ];

// const Productdetails = () => {
//   const { id } = useParams(); // Get product ID from URL
//   const product = products.find((p) => p.id === parseInt(id));

//   const [selectedImage, setSelectedImage] = useState(product?.images[0]?.src || "");
//   const [quantity, setQuantity] = useState(1);
//   const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

//   if (!product) return <div className="text-center mt-20">Product not found!</div>;

//   return (
//     <div className="bg-[#f6f1eb] min-h-screen font-serif">
//       <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 py-8">
//         <nav className="text-xs text-[#404040] mb-4 opacity-80">Home / {product.name}</nav>

//         <div className="flex flex-col lg:flex-row gap-12">
//           {/* Images Section */}
//           <div className="flex gap-5">
//             <div className="flex flex-col gap-4">
//               {product.images.map((img, i) => (
//                 <img
//                   key={i}
//                   src={img.src}
//                   alt={img.alt}
//                   className="w-12 h-16 object-cover ring-1 ring-gray-200 rounded-sm cursor-pointer"
//                   onClick={() => setSelectedImage(img.src)}
//                 />
//               ))}
//             </div>
//             <div className="relative w-96 h-[480px] bg-white rounded flex-shrink-0 shadow">
//               <img src={selectedImage} alt={product.name} className="w-full h-full object-cover rounded" />
//             </div>
//           </div>

//           {/* Product Details */}
//           <div className="flex-1 flex flex-col">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="font-bold uppercase text-xs tracking-widest text-[#222]">{product.brand}</span>
//               <span className="text-yellow-500 text-xs flex items-center">
//                 {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
//               </span>
//               <span className="text-xs text-gray-400">({product.reviews})</span>
//             </div>
//             <h1 className="font-serif text-2xl font-bold text-[#222] leading-tight mb-5">{product.name}</h1>

//             {/* Color Picker */}
//             <div className="mb-4">
//               <label className="block text-xs font-semibold mb-2 text-gray-700">SELECT COLOR</label>
//               <div className="flex gap-3">
//                 {colorOptions.map((opt) => (
//                   <button
//                     key={opt.value}
//                     className={`w-6 h-6 rounded-full border-2 ${
//                       selectedColor === opt.value ? "border-[#222]" : "border-gray-300"
//                     }`}
//                     style={{ backgroundColor: opt.color }}
//                     onClick={() => setSelectedColor(opt.value)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Quantity & Price */}
//             <div className="flex items-center gap-8 mb-4">
//               <div className="flex items-center border rounded overflow-hidden bg-white">
//                 <button
//                   className="px-3 py-1 text-lg text-[#222]"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 >
//                   -
//                 </button>
//                 <input
//                   type="number"
//                   value={quantity}
//                   min={1}
//                   className="w-10 text-center bg-transparent focus:outline-none"
//                   onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
//                 />
//                 <button className="px-3 py-1 text-lg text-[#222]" onClick={() => setQuantity(quantity + 1)}>
//                   +
//                 </button>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-700">PRICE TOTAL</span>
//                 <div className="text-lg font-bold text-[#222]">₹ {product.price * quantity}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Description & Advantages */}
//         <div className="mt-12 w-full">
//           <h3 className="uppercase font-bold text-xs mb-2 text-[#222]">ABOUT PRODUCT</h3>
//           <p className="text-sm text-[#333] mb-2">{product.description}</p>
//           <h4 className="uppercase font-semibold text-xs mb-2 text-[#222]">ADVANTAGES</h4>
//           <ul className="list-disc ml-5 text-sm text-[#333] mb-2">
//             {product.advantages.map((adv, idx) => (
//               <li key={idx}>{adv}</li>
//             ))}
//           </ul>
//           <h3 className="uppercase font-bold text-xs mb-2 text-[#222]">SHIPPING</h3>
//           <p className="text-sm text-[#333] mb-2">{product.shipping}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Productdetails;


import Input from "../Input/Input"; 
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Stellar Dainty Diamond Hoop",
    brand: "STYLIUM",
    rating: 4.5,
    reviews: 22,
    price: 900,
    size: ["5 Ratti","5.25 Ratti","6 Ratti","6.5 Ratti","7 Ratti","7.5 Ratti","8 Ratti","8.5 Ratti"],
    material: ["Pandent","Necklace","Gemstone"],
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
  },
  {
    id: 2,
    name: "Another Product Name",
    brand: "PEARLIX",
    rating: 3.8,
    reviews: 12,
    price: 1200,
    size: ["5 Ratti","5.25 Ratti","6 Ratti","6.5 Ratti","7 Ratti","7.5 Ratti","8 Ratti","8.5 Ratti"],
    material: ["Silver","Gold","Copper"],
    images: [
      { src: "/s2.jpeg", alt: "Product Image 1" },
      { src: "/s3.jpeg", alt: "Product Image 2" },
    ],
    description: "This is another product description.",
    advantages: ["Feature 1", "Feature 2", "Feature 3"],
    shipping: "Shipping info for product 2",
  },
];

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

  // NEW STATES for size and material
  const [selectedSize, setSelectedSize] = useState(product?.size[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState(product?.material[0] || "");

  if (!product) return <div className="text-center mt-20">Product not found!</div>;

  return (
    <div className="bg-[#f6f1eb] min-h-screen font-serif">
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 py-8">
        <nav className="text-xs text-[#404040] mb-4 opacity-80">Home / {product.name}</nav>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Section */}
          <div className="flex gap-5">
            <div className="flex flex-col gap-4">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  className="w-12 h-16 object-cover ring-1 ring-gray-200 rounded-sm cursor-pointer"
                  onClick={() => setMainImage(img.src)}
                />
              ))}
            </div>
            <div className="relative w-96 h-[480px] bg-white rounded mt-0 flex-shrink-0 shadow">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover rounded" />
              <button
                className="absolute bottom-3 right-3 bg-[#f6f1eb] border border-gray-400 rounded-full p-1 w-8 h-8 flex items-center justify-center"
                aria-label="Zoom"
              >
                <span className="text-xl">⛶</span>
              </button>
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
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                      selectedSize === item
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
              <label className="block text-xs font-semibold mb-2 text-gray-700">SELECT JWELLERY
              </label>
              <div className="flex flex-wrap gap-3">
                {product.material.map((mat) => (
                  <button
                    key={mat}
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                      selectedMaterial === mat
                        ? "bg-[#222] text-white border-[#222]"
                        : "border-gray-400 text-gray-700"
                    }`}
                    onClick={() => setSelectedMaterial(mat)}
                  >
                    {mat}
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
                <div className="text-lg font-bold text-[#222]">₹ {product.price * quantity}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-5">
              <button className="bg-[#222] text-white px-8 py-2 rounded font-semibold text-sm">ADD TO BAG</button>
              <button className="border border-[#222] px-8 py-2 rounded font-semibold text-sm text-[#222]">SAVE</button>
            </div>

            {/* Info Cards */}
            <div className="bg-[#fcf8f4] border border-gray-200 rounded p-4 flex flex-col gap-3 text-[15px]">
              <div className="flex gap-2 items-center">
                <span className="inline-block w-6 text-center text-lg">🚚</span>
                <div>
                  <div className="font-semibold text-gray-700">Free Shipping</div>
                  <div className="text-xs text-gray-500">Enter your Postal code for Delivery Availability</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="inline-block w-6 text-center text-lg">↩️</span>
                <div>
                  <div className="font-semibold text-gray-700">Return Delivery</div>
                  <div className="text-xs text-gray-500">Free 30 days Delivery Return. Details</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Description */}
        <div className="mt-12 w-full">
          <div className="flex gap-7 border-b border-gray-300 text-lg font-medium mb-6">
            <button className="border-b-2 border-[#222] pb-2 text-[#222]">DESCRIPTION</button>
            <button className="text-gray-400 pb-2">REVIEWS</button>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default Productdetails;
