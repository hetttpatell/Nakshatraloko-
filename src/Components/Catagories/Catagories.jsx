import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams(); // get category from URL

  // Example product data for each category
  const products = {
    pendant: ["Pendant 1", "Pendant 2", "Pendant 3"],
    necklace: ["Necklace 1", "Necklace 2", "Necklace 3"],
    jewellery: ["Ring 1", "Earring 1", "Bracelet 1"],
    rudraksh: ["Rudraksh 1", "Rudraksh 2", "Rudraksh 3"],
  };

  const categoryProducts = products[category] || [];

  // Capitalize the category for display
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      {categoryProducts.length > 0 ? (
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          {displayCategory} Collection will shown same as the Gemstone Page 
        </h1>
      ) : (
        <p className="text-center text-gray-500 text-lg">No products found</p>
      )}
    </div>
  );
};

export default CategoryPage;
// c:\Users\Jitu\Desktop\Nakshatraloko\src\Components\Catagories\Catagories.jsx