import React from "react";
import { useParams } from "react-router-dom";

export default function Product() {
    const { id } = useParams();


    const products = [
        { id: "1", name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Women | Earrings", price: "₹ 4,554.00", feature: "Healing Stone", img: "/s3.jpeg", rating: 4.5 },
        { id: "2", name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Women | Earrings", price: "₹ 4,554.00", feature: "Faster Growth", img: "/s2.jpeg", rating: 3.8 },
        { id: "3", name: "14KT Yellow Gold Diamond Hoop Earrings", category: "Women | Earrings", price: "₹ 4,554.00", feature: "Faster Growth", img: "/s4.jpeg", rating: 3.8 },
    ];

    const product = products.find((p) => p.id === id);

    if (!product) return <p>Product not found!</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] p-6">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <img src={product.img} alt={product.name} className="w-64 h-64 object-cover mb-4" />
            <p className="text-lg font-semibold">{product.price}</p>
            <p className="text-gray-500">{product.category}</p>
            <p className="mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white inline-block px-3 py-1 rounded">{product.feature}</p>
            <p className="mt-2">Rating: {product.rating}</p>
        </div>
        
    );

}
