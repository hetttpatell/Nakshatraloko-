import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { addToCart } = useCart(); // ✅ get addToCart from context

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Sync with localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ✅ Add to wishlist (merge duplicates by quantity)
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ✅ Remove one quantity or full item
  const handleRemove = (id) => {
    setWishlist((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ✅ Clear all wishlist
  const handleClearAll = () => {
    setWishlist([]);
  };

  // ✅ Move to cart (all quantity)
  const handleMoveToCart = (id) => {
    const item = wishlist.find((p) => p.id === id);
    if (item) {
      if (!item.inStock) return; // don’t move out-of-stock
      // send with quantity to cart
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item);
      }
      setWishlist((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="bg-[var(--color-productbg)] min-h-screen py-14 px-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Title + Clear All */}
        <div className="flex justify-center items-center mb-12">
          <h2 className="text-3xl font-bold tracking-widest text-gray-900 uppercase underline underline-offset-20">
            My Wishlist
          </h2>
          {wishlist.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm underline text-gray-600 hover:text-black transition"
            >
              Clear All
            </button>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="divide-y divide-gray-200 border-y border-gray-300">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-6 py-8"
              >
                {/* Product Image */}
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="w-32 h-32 object-cover"
                />

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 tracking-wide uppercase">
                    {item.brand} · {item.material}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    ⭐ {item.rating} ({item.reviews} reviews)
                  </p>

                  {/* Price Section */}
                  <div className="mt-3">
                    {item.oldPrice && (
                      <span className="text-sm text-gray-400 line-through mr-2">
                        ₹{item.oldPrice}
                      </span>
                    )}
                    <span className="text-lg font-semibold text-gray-800">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Quantity */}
                  <p className="text-sm text-gray-700 mt-2">
                    Quantity: <b>{item.quantity}</b>
                  </p>


                  {/* Stock Status */}
                  <p
                    className={`text-xs mt-1 ${item.inStock ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center sm:items-end gap-4">
                  <button
                    onClick={() => handleMoveToCart(item.id)}
                    disabled={!item.inStock}
                    className={`px-4 py-2 text-xs uppercase tracking-wide transition ${item.inStock
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-xs underline tracking-wide text-gray-600 hover:text-black transition"
                  >
                    Remove One
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-56">
            <h2 className="text-2xl font-semibold text-gray-700">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mt-2 text-base text-center max-w-sm">
              Browse our collection and add your favorite products to your wishlist.
            </p>
            <Link
              to="/gemstones"
              className="mt-6 px-6 py-3 bg-[var(--color-navy)] 
              text-white font-medium rounded-lg shadow-md hover:bg-[var(--color-text)] transition"
            >
              Browse Products
            </Link>
          </div>

        )}
      </div>
    </div>
  );
}
