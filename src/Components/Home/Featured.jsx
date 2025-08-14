import React from 'react';

export default function Featured() {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16">
  <div className="max-w-7xl mx-auto px-6 text-center text-white">
    <h2 className="text-4xl md:text-5xl font-serif font-bold relative inline-block">
      Featured <span className="text-yellow-400">Items</span>
      <span className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-24 h-1 bg-yellow-400 rounded-full"></span>
    </h2>
    <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
      Handpicked selections crafted with precision and elegance, curated just for you.
    </p>
  </div>
</div>


  );
}
