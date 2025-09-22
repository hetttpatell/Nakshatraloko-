import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

import { ToastContainer } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50">
            {["Product", "Price", "Stock", "Featured", "Display", "Status", "Actions"].map(
              (header) => (
                <th key={header} className="p-3 font-semibold text-gray-700">
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = React.memo(({ product, onView, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured || false);
  const [isSlidShow, setIsSlidShow] = useState(product.IsSlidShow || false);

  const handleFeaturedToggle = async () => {
    const newValue = !isFeatured;
    setIsFeatured(newValue);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}toggleFeaturedProduct/${product.id}/feature`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      if (!response.data.success) {
        setIsFeatured(!newValue);
      }
    } catch (err) {
      setIsFeatured(!newValue);
    }
  };

  const handleSlidShowToggle = async () => {
    const newValue = !isSlidShow;
    setIsSlidShow(newValue);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}toggleSlideshow`,
        { 
          productId: product.id,
          isSlideshow: newValue 
        },
        { headers: { Authorization: `${token}` } }
      );
      
      if (!response.data.success) {
        setIsSlidShow(!newValue);
      }
    } catch (err) {
      console.error("Failed to toggle slideshow:", err);
      setIsSlidShow(!newValue);
    }
  };

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Product Column */}
        <td className="p-3">
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-500 mt-1 flex items-center hover:text-blue-700 transition-colors"
            >
              {expanded ? (
                <>
                  <FaChevronUp className="mr-1" /> Less details
                </>
              ) : (
                <>
                  <FaChevronDown className="mr-1" /> More details
                </>
              )}
            </button>
          </div>
        </td>

        {/* Price Column */}
        <td className="p-3 font-medium">
          {product.dummyPrice && parseFloat(product.dummyPrice) > parseFloat(product.price) ? (
            <>
              <span className="line-through mr-2 text-gray-500">₹{product.dummyPrice}</span>
              <span className="text-green-600">₹{product.price}</span>
            </> 
          ) : (
            `₹${product.price}`
          )}
        </td>

        {/* Stock Column */}
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.stock > 0 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock} in stock
          </span>
        </td>

        {/* Featured Toggle Column */}
        <td className="p-3">
          <ToggleSwitch
            checked={isFeatured}
            onChange={handleFeaturedToggle}
            label="Featured"
          />
        </td>

        {/* Display (Slideshow) Toggle Column */}
        <td className="p-3">
          <ToggleSwitch
            checked={isSlidShow}
            onChange={handleSlidShowToggle}
            label="Slideshow"
          />
        </td>

        {/* Status Column */}
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.isActive 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Actions Column */}
        <td className="p-3">
          <div className="flex gap-2">
            <ActionButton
              icon={FaEye}
              color="blue"
              onClick={() => onView(product)}
              title="View details"
            />
            <ActionButton
              icon={FaEdit}
              color="green"
              onClick={() => onEdit(product.id)}
              title="Edit product"
            />
            <ActionButton
              icon={FaTrash}
              color="red"
              onClick={() => onDelete(product.id, product.name)}
              title="Delete product"
            />
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan="7" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {product.description || "No description available"}
                </p>

                <h4 className="font-semibold mt-4 mb-2 text-gray-800">Advantages</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {product.advantages || "No advantages listed"}
                </p>

                <h4 className="font-semibold mt-4 mb-2 text-gray-800">How to Wear</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {product.howToWear || "No instructions available"}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">Product Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category ID:</span>
                    <span className="font-medium">{product.categoryId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-orange-600">
                      {product.discountPercentage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span className={`font-medium ${isFeatured ? 'text-green-600' : 'text-gray-600'}`}>
                      {isFeatured ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Slideshow:</span>
                    <span className={`font-medium ${isSlidShow ? 'text-green-600' : 'text-gray-600'}`}>
                      {isSlidShow ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {product.primaryImage && (
                  <>
                    <h4 className="font-semibold mt-4 mb-2 text-gray-800">Primary Image</h4>
                    <img 
                      src={product.primaryImage} 
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
});

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors">
      <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
        checked ? 'transform translate-x-full' : ''
      }`} />
    </div>
    <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">
      {label}
    </span>
  </label>
);

// Action Button Component
const ActionButton = ({ icon: Icon, color, onClick, title }) => (
  <button
    className={`p-2 rounded transition-colors hover:bg-${color}-100 text-${color}-600 hover:text-${color}-700`}
    onClick={onClick}
    title={title}
  >
    <Icon className="text-sm" />
  </button>
);

export default ProductTable;