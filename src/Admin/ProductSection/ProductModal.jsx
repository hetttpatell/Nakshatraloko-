// components/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const ProductModal = ({
  title,
  initialProduct = {},
  onClose,
  onSave,
  brandOptions = [],
  sizeOptions = [],
  materialOptions = [],
  isEditing = false,
}) => {
  // Individual states for all fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [advantages, setAdvantages] = useState("");
  const [shipping, setShipping] = useState("");
  const [inStock, setInStock] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Populate state when editing
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || "");
      setBrand(initialProduct.brand || "");
      setPrice(initialProduct.price || "");
      setMainImage(initialProduct.mainImage || "");
      setDescription(initialProduct.description || "");
      setSizes(initialProduct.size || []);
      setMaterials(initialProduct.material || []);
      setAdvantages(
        typeof initialProduct.advantages === "string"
          ? initialProduct.advantages
          : (initialProduct.advantages || []).join(", ")
      );
      setShipping(initialProduct.shipping || "");
      setInStock(initialProduct.inStock || false);
      
      // Set image preview if editing with existing image
      if (initialProduct.mainImage) {
        setImagePreview(initialProduct.mainImage);
      }
    }
    // Run only once on mount
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Convert to base64
    const base64Reader = new FileReader();
    base64Reader.onload = (e) => {
      const base64 = e.target.result;
      setMainImage(base64);
      console.log(base64);
    };
    base64Reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare product object to pass to onSave
    const productData = {
      name,
      brand,
      price,
      mainImage,
      description,
      size: sizes,
      material: materials,
      advantages: advantages.split(",").map((adv) => adv.trim()),
      shipping,
      inStock,
    };

    onSave(productData);
  };

  const handleMultiSelectChange = (e, setter) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setter(selectedOptions);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Brand *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm appearance-none bg-chevron-down bg-no-repeat bg-right-4 bg-center pr-10"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")" }}
                >
                  <option value="">Select Brand</option>
                  {brandOptions.map((b) => (
                    <option key={b} value={b} className="py-2">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Main Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Product Image *
                </label>
                
                <div className="flex flex-col items-center justify-center w-full">
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-contain rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setMainImage("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        required={!mainImage}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product features, benefits, and details..."
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-vertical"
                />
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Sizes *
                </label>
                <select
                  multiple
                  value={sizes}
                  onChange={(e) => handleMultiSelectChange(e, setSizes)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm min-h-32"
                  required
                >
                  {sizeOptions.map((s) => (
                    <option key={s} value={s} className="py-2 px-3 hover:bg-blue-50">
                      {s}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 font-medium">
                  ⌘ + Click to select multiple sizes
                </p>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Materials *
                </label>
                <select
                  multiple
                  value={materials}
                  onChange={(e) => handleMultiSelectChange(e, setMaterials)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm min-h-32"
                  required
                >
                  {materialOptions.map((m) => (
                    <option key={m} value={m} className="py-2 px-3 hover:bg-blue-50">
                      {m}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 font-medium">
                  ⌘ + Click to select multiple materials
                </p>
              </div>

              {/* Advantages */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Key Advantages
                </label>
                <textarea
                  value={advantages}
                  onChange={(e) => setAdvantages(e.target.value)}
                  placeholder="Enter key features separated by commas (e.g., Waterproof, Durable, Lightweight...)"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-vertical"
                />
              </div>

              {/* Shipping */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Shipping Information *
                </label>
                <textarea
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  placeholder="Free shipping, Delivery time, Return policy..."
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-vertical"
                />
              </div>

              {/* In Stock */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="inStock" className="text-sm font-semibold text-gray-900">
                    In Stock
                  </label>
                  <p className="text-xs text-gray-500">
                    Toggle to mark product as available for purchase
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;