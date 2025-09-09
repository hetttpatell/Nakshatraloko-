// components/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaArrowUp, FaArrowDown, FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const ProductModal = ({
  title,
  initialProduct = {},
  onClose,
  onSave,
  categoryOptions = [],
  sizeOptions = [],
  isEditing = false,
  isLoading = false,
}) => {
  // Individual states for all fields
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [howToWear, setHowToWear] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sizes, setSizes] = useState([
    { size: "", price: "", dummyPrice: "", stock: "" }
  ]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Populate state when editing
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || "");
      setCategoryName(initialProduct.categoryName || "");
      setDescription(initialProduct.description || "");
      setAdvantages(
        typeof initialProduct.advantages === "string"
          ? initialProduct.advantages
          : (initialProduct.advantages || []).join(", ")
      );
      setHowToWear(initialProduct.howToWear || "");
      setIsActive(initialProduct.isActive !== undefined ? initialProduct.isActive : true);
      
      // Set sizes if editing with existing sizes
      if (initialProduct.sizes && initialProduct.sizes.length > 0) {
        setSizes(initialProduct.sizes);
      } else {
        setSizes([{ size: "", price: "", dummyPrice: "", stock: "" }]);
      }
      
      // Set images if editing with existing images
      if (initialProduct.images && initialProduct.images.length > 0) {
        setImages(initialProduct.images);
      }
    }
  }, [initialProduct]);

  const validateFile = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const errors = {};
    
    if (file.size > MAX_FILE_SIZE) {
      errors.fileSize = "File size must be less than 5MB";
    }
    
    if (!file.type.startsWith("image/")) {
      errors.fileType = "File must be an image";
    }
    
    return errors;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const newErrors = {};
    const validFiles = [];
    
    files.forEach((file, index) => {
      const fileErrors = validateFile(file);
      
      if (Object.keys(fileErrors).length > 0) {
        newErrors[`file-${index}`] = fileErrors;
      } else {
        validFiles.push(file);
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }
    
    // Process valid files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        const newImage = {
          imageData: base64,
          altText: `${name || "Product"} image`,
          isPrimary: images.length === 0, // Set as primary if it's the first image
          isActive: true,
          file: file // Keep reference to original file for potential re-upload
        };
        
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear file input
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      
      // If we removed the primary image and there are other images, set the first one as primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      
      return newImages;
    });
  };

  const setPrimaryImage = (index) => {
    setImages(prev => {
      return prev.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
    });
  };

  const moveImage = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }
    
    setImages(prev => {
      const newImages = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      
      // Swap positions
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      
      return newImages;
    });
  };

  // Handle size input changes
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    
    // Auto-calculate dummyPrice if price changes and dummyPrice is empty
    if (field === "price" && !newSizes[index].dummyPrice) {
      newSizes[index].dummyPrice = Math.round(parseFloat(value || 0) * 1.2).toString();
    }
    
    setSizes(newSizes);
  };

  // Add a new size row
  const addSize = () => {
    setSizes([...sizes, { size: "", price: "", dummyPrice: "", stock: "" }]);
  };

  // Remove a size row
  const removeSize = (index) => {
    if (sizes.length > 1) {
      const newSizes = [...sizes];
      newSizes.splice(index, 1);
      setSizes(newSizes);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate at least one image is uploaded
    if (images.length === 0) {
      setErrors({ ...errors, images: "At least one image is required" });
      return;
    }
    
    // Validate all sizes are filled
    const sizeErrors = {};
    sizes.forEach((size, index) => {
      if (!size.size) sizeErrors[`size-${index}`] = "Size is required";
      if (!size.price) sizeErrors[`price-${index}`] = "Price is required";
      if (!size.dummyPrice) sizeErrors[`dummyPrice-${index}`] = "Dummy price is required";
      if (!size.stock) sizeErrors[`stock-${index}`] = "Stock is required";
    });
    
    if (Object.keys(sizeErrors).length > 0) {
      setErrors({ ...errors, ...sizeErrors });
      return;
    }

    // Prepare product object in the required API format
    const productData = {
      id: isEditing ? initialProduct.id : 0, // API will assign ID for new products
      categoryName,
      name,
      description,
      advantages: advantages.split(",").map((adv) => adv.trim()),
      howToWear,
      isActive,
      sizes: sizes.map(size => ({
        size: parseInt(size.size),
        price: parseFloat(size.price),
        dummyPrice: parseFloat(size.dummyPrice),
        stock: parseInt(size.stock)
      })),
      images: images.map((img, index) => ({
        imageData: img.imageData,
        altText: img.altText,
        isPrimary: index === 0, // First image is always primary
        isActive: img.isActive
      }))
    };

    onSave(productData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
              {/* Category Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Category Name *
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm appearance-none bg-chevron-down bg-no-repeat bg-right-4 bg-center pr-10"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")" }}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category} className="py-2">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Product Images *
                </label>
                
                {errors.images && (
                  <p className="text-red-500 text-sm">{errors.images}</p>
                )}

                <div className="flex flex-col items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
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
                      multiple
                    />
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className={`relative border rounded-lg p-2 ${image.isPrimary ? 'border-2 border-blue-500' : 'border-gray-200'}`}>
                          <img
                            src={image.imageData}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-contain rounded"
                          />
                          
                          {/* Primary badge */}
                          {image.isPrimary && (
                            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </span>
                          )}
                          
                          {/* Image controls */}
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                              className="bg-white rounded p-1 shadow-sm disabled:opacity-50"
                              title="Move up"
                            >
                              <FaArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === images.length - 1}
                              className="bg-white rounded p-1 shadow-sm disabled:opacity-50"
                              title="Move down"
                            >
                              <FaArrowDown size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              disabled={image.isPrimary}
                              className="bg-white rounded p-1 shadow-sm disabled:opacity-50"
                              title="Set as primary"
                            >
                              <span className="text-xs font-bold">P</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-white rounded p-1 shadow-sm"
                              title="Remove image"
                            >
                              <FaTrash size={12} className="text-red-500" />
                            </button>
                          </div>
                          
                          {/* Alt text input */}
                          <div className="mt-2">
                            <input
                              type="text"
                              value={image.altText}
                              onChange={(e) => {
                                const newImages = [...images];
                                newImages[index].altText = e.target.value;
                                setImages(newImages);
                              }}
                              placeholder="Image description"
                              className="w-full text-xs p-1 border border-gray-200 rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

              {/* How to Wear */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  How to Wear *
                </label>
                <textarea
                  value={howToWear}
                  onChange={(e) => setHowToWear(e.target.value)}
                  placeholder="Instructions on how to wear or use the product..."
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-vertical"
                />
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

              {/* Sizes */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Sizes *
                </label>
                
                {sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Size</label>
                      <select
                        value={size.size}
                        onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      >
                        <option value="">Select Size</option>
                        {sizeOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors[`size-${index}`] && (
                        <p className="text-red-500 text-xs">{errors[`size-${index}`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`price-${index}`] && (
                        <p className="text-red-500 text-xs">{errors[`price-${index}`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Dummy Price (₹)</label>
                      <input
                        type="number"
                        value={size.dummyPrice}
                        onChange={(e) => handleSizeChange(index, "dummyPrice", e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`dummyPrice-${index}`] && (
                        <p className="text-red-500 text-xs">{errors[`dummyPrice-${index}`]}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`stock-${index}`] && (
                        <p className="text-red-500 text-xs">{errors[`stock-${index}`]}</p>
                      )}
                    </div>
                    
                    <div className="flex items-end justify-center">
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        disabled={sizes.length === 1}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove size"
                      >
                        <FaMinus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSize}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <FaPlus size={14} className="mr-2" /> Add Another Size
                </button>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-900">
                    Active Product
                  </label>
                  <p className="text-xs text-gray-500">
                    Toggle to make product visible to customers
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
                disabled={isLoading}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Update Product" : "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;