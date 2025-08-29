import React from "react";
import Input from "../Input/Input";
import Recommendations from "../Product/Recommendation";
import { useCart } from "../../Context/CartContext"; 

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart(); 

  const recommendationProducts = [
    {
      id: 1,
      name: "Stellar Dainty Diamond Hoop id-1",
      brand: "STYLIUM",
      rating: 4.5,
      reviews: 22,
      price: 9000,
      inStock: true,
      size: ["5 Ratti", "6 Ratti", "7 Ratti"],
      images: [{ src: "/s1.jpeg", alt: "Product Image 1" }],
    },
    {
      id: 2,
      name: "Another Product id-2",
      brand: "PEARLIX",
      rating: 3.8,
      reviews: 12,
      price: 1200,
      inStock: false,
      images: [{ src: "/s2.jpeg", alt: "Product Image 1" }],
    },
    {
      id: 3,
      name: "Another Product id-3",
      brand: "PEARLIX",
      rating: 4.2,
      reviews: 18,
      price: 2500,
      inStock: true,
      images: [{ src: "/s3.jpeg", alt: "Product Image 1" }],
    },
  ];

  // ✅ Handlers from context
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id, value) => {
    updateQuantity(id, Number(value));
  };

  // ✅ Calculations (based on context cart)
  const subtotal = cart.reduce(
    (sum, item) => (item.inStock ? sum + item.price * item.quantity : sum),
    0
  );
  const shipping = subtotal > 5000 ? 0 : 199;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

  return (
    <div className="bg-[var(--color-productbg)] min-h-screen py-14 px-6">
      <div className="w-full max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-bold tracking-widest text-center text-gray-900 mb-12 uppercase underline underline-offset-20">
          My Bag
        </h2>

        {cart.length > 0 ? (
          <div className="divide-y divide-gray-200 border-y border-gray-300">
            {cart.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-center gap-6 py-8"
              >
                {/* Product Image */}
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg shadow"
                />

                {/* Product Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 tracking-wide uppercase">
                    {product.material}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    ⭐ {product.rating} ({product.reviews} reviews)
                  </p>

                  {product.inStock ? (
                    <p className="text-green-600 text-sm mt-1">In Stock</p>
                  ) : (
                    <p className="text-red-600 text-sm mt-1">Out of Stock</p>
                  )}

                  <p className="text-lg font-semibold text-gray-800 mt-3">
                    ₹{product.price * product.quantity}
                  </p>
                  <p className="text-xs text-gray-500">
                    (₹{product.price} × {product.quantity})
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center sm:items-end gap-4">
                  {/* Quantity Input */}
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    disabled={!product.inStock}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="w-20 border border-gray-400 rounded px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-xs underline tracking-wide text-gray-600 hover:text-black transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10 text-lg">
            Your cart is empty 🛒!
          </p>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-12 max-w-lg mx-auto">
            <div className="flex justify-between text-gray-900 border-t border-gray-300 pt-6">
              <p className="text-lg font-medium">Subtotal</p>
              <p className="text-lg font-semibold">₹{subtotal}</p>
            </div>
            <div className="flex justify-between text-gray-900 mt-2">
              <p className="text-sm">Shipping</p>
              <p className="text-sm">
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </p>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-xl mt-4 border-t border-gray-300 pt-4">
              <p>Total</p>
              <p>₹{total}</p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-1/2 py-3 border border-gray-900 text-gray-900 tracking-wide font-medium uppercase hover:bg-gray-100 transition">
                Continue Shopping
              </button>
              <button
                disabled={subtotal === 0}
                className="w-full sm:w-1/2 py-3 bg-black text-white tracking-wide font-medium uppercase hover:bg-gray-900 transition disabled:opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <Recommendations
        permission={false}
        text="Based On Your Cart"
        Slogan="Here are some picks you should try"
        products={recommendationProducts
          .filter((p) => !cart.find((c) => c.id === p.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)}
      />
    </div>
  );
}
