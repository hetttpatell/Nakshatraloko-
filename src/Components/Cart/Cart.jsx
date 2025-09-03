import React from "react";
import { useCart } from "../../Context/CartContext";
import Recommendations from "../Product/Recommendation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Dummy recommendations
  const recommendationProducts = [
    {
      id: 1,
      name: "Stellar Dainty Diamond Hoop",
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
      name: "Elegant Pearl Necklace",
      brand: "PEARLIX",
      rating: 3.8,
      reviews: 12,
      price: 1200,
      inStock: false,
      images: [{ src: "/s2.jpeg", alt: "Product Image 1" }],
    },
    {
      id: 3,
      name: "Classic Gold Pendant",
      brand: "PEARLIX",
      rating: 4.2,
      reviews: 18,
      price: 2500,
      inStock: true,
      images: [{ src: "/s3.jpeg", alt: "Product Image 1" }],
    },
  ];

  // Handlers
  const handleRemove = (id, size, material) =>
    removeFromCart(id, size, material);

  const handleQuantityChange = (id, size, material, value) =>
    updateQuantity(id, size, material, Math.max(1, Number(value)));

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => (item.inStock ? sum + item.price * item.quantity : sum),
    0
  );
  const shipping = subtotal > 5000 ? 0 : 199;
  const total = subtotal + (subtotal > 0 ? shipping : 0);

  return (
    <div className="bg-[var(--color-productbg)] min-h-screen py-14 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-bold tracking-widest text-center text-gray-900 mb-14 uppercase">
          My Bag
        </h2>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((product) => (
                <div
                  key={`${product.id}-${product.size}-${product.material}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 border rounded-2xl bg-white shadow-md hover:shadow-lg transition"
                >
                  {/* Product Image */}
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  {/* Product Info */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.material} • {product.size}
                    </p>
                    <p className="text-sm text-gray-500">
                      ⭐ {product.rating} ({product.reviews} reviews)
                    </p>

                    {product.inStock ? (
                      <p className="text-green-600 text-sm font-medium">
                        In Stock
                      </p>
                    ) : (
                      <p className="text-red-600 text-sm font-medium">
                        Out of Stock
                      </p>
                    )}

                    <div className="text-gray-800 font-bold text-lg">
                      ₹{product.price * product.quantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      (₹{product.price} × {product.quantity})
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            product.size,
                            product.material,
                            product.quantity - 1
                          )
                        }
                        disabled={product.quantity <= 1 || !product.inStock}
                        className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 text-gray-900 font-semibold">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            product.size,
                            product.material,
                            product.quantity + 1
                          )
                        }
                        disabled={!product.inStock}
                        className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        handleRemove(product.id, product.size, product.material)
                      }
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 transition"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="flex justify-between text-gray-800 mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Shipping</span>
                <span
                  className={`${
                    shipping === 0 ? "text-green-600 font-medium" : "text-gray-600"
                  }`}
                >
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <Link
                  to="/gemstones"
                  className="w-full py-3 border border-gray-900 text-gray-900 tracking-wide font-medium uppercase rounded-lg hover:bg-gray-100 transition text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/payment"
                  className={`w-full py-3 rounded-lg tracking-wide font-medium uppercase transition text-center ${
                    subtotal === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-2xl font-semibold text-gray-800">
              Your bag is empty 🛒
            </p>
            <p className="text-gray-500 mt-2">
              Looks like you haven’t added anything yet
            </p>
            <Link
              to="/gemstones"
              className="mt-6 inline-block px-6 py-3 bg-black text-white uppercase rounded-lg hover:bg-gray-900 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-20">
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
      </div>
    </div>
  );
}
