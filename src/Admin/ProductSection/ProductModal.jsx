// components/ProductModal.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaPlus,
  FaMinus,
  FaSync,
  FaStar,
} from "react-icons/fa";
import jwtDecode from "../../CustomHooks/jwtUtils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

const ProductModal = ({
  title,
  initialProduct = {},
  onClose,
  onSave,
  sizeOptions = [],
  isEditing = false,
  isLoading = false,
}) => {
  // Individual states for all fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [advantages, setAdvantages] = useState("");
  const [howToWear, setHowToWear] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sizes, setSizes] = useState([
    { size: "", price: "", dummyPrice: "", stock: "" },
  ]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [apiStatus, setApiStatus] = useState({ loading: false, message: "" });

  const getCleanImagePath = (url) => {
    if (!url) return "";
    // Find "/api/uploads/" in the string
    const idx = url.indexOf("/api/uploads/");
    if (idx !== -1) {
      // Keep only the part after "/api/uploads/"
      return url.substring(idx + "/api/uploads".length);
    }
    const idx2 = url.indexOf("/uploads/");
    if (idx2 !== -1) {
      return url.substring(idx2 + "/uploads".length);
    }
    // If already relative like "/product-xxx.png", return as-is
    return url.startsWith("/") ? url : `/${url}`;
  };

  const sanitizedImages = images.map((img) => ({
    ...img,
    imageData: getCleanImagePath(img.imageData),
  }));

  useEffect(() => {
    axios
      .post(`${BACKEND_URL}getAllCatogary`)
      .then((res) => {
        if (res.data.success) {
          setCategoryData(res.data.data);
        }
      })
      // .catch((err) => console.error("Category fetch error:", err));
      .catch((err) => console.log(err));
  }, []);

  // Populate state when editing
  useEffect(() => {
    if (initialProduct && Object.keys(initialProduct).length > 0) {
      // console.log("Initial product data:", initialProduct);

      // ---------------- Basic fields ----------------
      setName(initialProduct.Name || initialProduct.name || "");
      setCategoryId(
        initialProduct.CategoryID !== undefined
          ? parseInt(initialProduct.CategoryID)
          : initialProduct.categoryId !== undefined
          ? parseInt(initialProduct.categoryId)
          : ""
      );
      setDescription(
        initialProduct.Description || initialProduct.description || ""
      );
      setAdvantages(
        initialProduct.Advantages || initialProduct.advantages || ""
      );
      setHowToWear(initialProduct.HowToWear || initialProduct.howToWear || "");
      setIsActive(
        initialProduct.IsActive !== undefined
          ? initialProduct.IsActive
          : initialProduct.isActive !== undefined
          ? initialProduct.isActive
          : true
      );

      // ---------------- Rating field ----------------
      const initialRating =
        initialProduct.Rating !== undefined
          ? parseFloat(initialProduct.Rating)
          : initialProduct.rating !== undefined
          ? parseFloat(initialProduct.rating)
          : initialProduct.productRatings !== undefined
          ? parseFloat(initialProduct.productRatings)
          : 0;

      // Ensure rating is between 0 and 5
      setRating(Math.min(Math.max(initialRating, 0), 5));

      // ---------------- Sizes ----------------
      const productSizes = initialProduct.Sizes || initialProduct.sizes || [];
      if (Array.isArray(productSizes) && productSizes.length > 0) {
        setSizes(
          productSizes.map((size) => ({
            size: size.size ? `${size.size}` : "",
            price:
              size.price !== undefined && size.price !== null
                ? String(size.price)
                : "",
            dummyPrice:
              size.dummyPrice !== undefined && size.dummyPrice !== null
                ? String(size.dummyPrice)
                : "",
            stock:
              size.stock !== undefined && size.stock !== null
                ? String(size.stock)
                : "",
          }))
        );
      } else {
        setSizes([{ size: "", price: "", dummyPrice: "", stock: "" }]);
      }

      // ---------------- Images ----------------
      const productImages =
        initialProduct.Images || initialProduct.images || [];
      if (Array.isArray(productImages) && productImages.length > 0) {
        const formattedImages = productImages.map((img) => {
          let imageUrl = img.imageData || img.imageUrl || "";

          if (imageUrl) {
            const uploadsIndex = imageUrl.indexOf("/api/uploads");
            const uploadsFallback = imageUrl.indexOf("/uploads");
            const startIndex =
              uploadsIndex !== -1 ? uploadsIndex : uploadsFallback;

            if (startIndex !== -1) {
              const cleanPath = imageUrl.substring(startIndex);
              imageUrl = `${IMG_URL}${cleanPath.replace(/([^:]\/)\/+/g, "$1")}`;
            }
          }

          return {
            ...img,
            imageData: imageUrl,
            isExisting: true,
            originalUrl: imageUrl,
            id: img.id || img.ID || null,
            altText: img.altText || "",
          };
        });

        setImages(formattedImages);
      } else {
        setImages([]);
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
      // console.log("Validation errors:", newErrors);
      setErrors(newErrors);
      setApiStatus({ loading: false, message: "" });
      submittingRef.current = false;
      return;
    }

    // Process valid files
    const newImageFiles = [...imageFiles];
    const newImages = [...images];

    validFiles.forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      const newImage = {
        imageData: objectUrl,
        altText: `${name || "Product"} image`,
        isPrimary: images.length === 0,
        isActive: true,
        file: file,
        isExisting: false,
      };

      newImageFiles.push(file);
      newImages.push(newImage);
    });

    setImageFiles(newImageFiles);
    setImages(newImages);

    // Clear file input
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);

      // If we removed the primary image and there are other images, set the first one as primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }

      return newImages;
    });

    // Only remove from imageFiles if it's a new file (not an existing image)
    if (!images[index].isExisting) {
      setImageFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });
    }
  };

  const setPrimaryImage = (index) => {
    setImages((prev) => {
      return prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
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

    setImages((prev) => {
      const newImages = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      // Swap positions
      [newImages[index], newImages[targetIndex]] = [
        newImages[targetIndex],
        newImages[index],
      ];

      return newImages;
    });

    // Only rearrange imageFiles for new images
    setImageFiles((prev) => {
      const newFiles = [...prev];
      // Find the indices of new files in the images array
      const newFileIndices = images
        .map((img, idx) => (!img.isExisting ? idx : -1))
        .filter((idx) => idx !== -1);

      // If both images at these indices are new files, swap them
      if (
        newFileIndices.includes(index) &&
        newFileIndices.includes(targetIndex)
      ) {
        const fileIndex1 = newFileIndices.indexOf(index);
        const fileIndex2 = newFileIndices.indexOf(targetIndex);
        [newFiles[fileIndex1], newFiles[fileIndex2]] = [
          newFiles[fileIndex2],
          newFiles[fileIndex1],
        ];
      }

      return newFiles;
    });
  };

  // Handle size input changes
  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;

    // Auto-calculate dummyPrice if price changes and dummyPrice is empty
    if (field === "price" && !newSizes[index].dummyPrice) {
      newSizes[index].dummyPrice = Math.round(
        parseFloat(value || 0) * 1.2
      ).toString();
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

  // Handle star click for rating
  const handleStarClick = (value) => {
    setRating(value);
  };

  // Handle star hover for visual feedback
  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  // Handle star leave for visual feedback
  const handleStarLeave = () => {
    setHoverRating(0);
  };

  // Handle numeric input change for rating
  const handleRatingInputChange = (e) => {
    let value = parseFloat(e.target.value);

    // Ensure value is between 0 and 5
    if (isNaN(value)) value = 0;
    value = Math.min(Math.max(value, 0), 5);

    setRating(value);
  };

  const submittingRef = React.useRef(false);

  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();

      // Prevent multiple submissions
      if (submittingRef.current) return;
      submittingRef.current = true;

      setErrors({});
      setApiStatus({ loading: true, message: "" });

      // Get user ID from token
      const token = localStorage.getItem("authToken");
      let userId = 1; // default fallback

      if (token) {
        const decoded = jwtDecode(token);
        // Try different possible field names for user ID
        userId = decoded?.id || decoded?.userId || 1;
      }

      try {
        // --- Validations ---
        const newErrors = {};

        if (!categoryId) {
          newErrors.categoryId = "Please select a category";
        }
        if (!name.trim()) {
          newErrors.name = "Please enter a product name";
        }
        if (images.filter((img) => img.isExisting || img.file).length === 0) {
          newErrors.images = "Please upload at least one image";
        }

        // Validate each size
        sizes.forEach((size, index) => {
          if (!size.size) newErrors[`size-${index}`] = "Size is required";
          if (!size.price || parseFloat(size.price) <= 0)
            newErrors[`price-${index}`] = "Valid price is required";
          if (!size.dummyPrice || parseFloat(size.dummyPrice) <= 0)
            newErrors[`dummyPrice-${index}`] = "Valid dummy price is required";
          if (!size.stock || parseInt(size.stock) < 0)
            newErrors[`stock-${index}`] = "Valid stock quantity is required";
        });

        // Category validation
        const numericCategoryId = parseInt(categoryId, 10);
        const selectedCategory = categoryData.find(
          (cat) => cat.ID === numericCategoryId
        );

        if (!selectedCategory && categoryId) {
          newErrors.categoryId = "Invalid category selected";
        }

        // If validation errors, stop here
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setApiStatus({ loading: false, message: "" });
          return;
        }

        // --- Build FormData payload ---
        const formData = new FormData();

        // Add basic fields
        formData.append("id", isEditing ? initialProduct?.id || 0 : 0);
        formData.append("categoryId", numericCategoryId);
        formData.append("name", name.trim());
        formData.append("description", description?.trim() || "");
        formData.append("advantages", advantages?.trim() || "");
        formData.append("howToWear", howToWear?.trim() || "");
        formData.append("isActive", Boolean(isActive));
        formData.append("rating", parseFloat(rating) || 0);
        formData.append("productRatings", parseFloat(rating) || 0);
        formData.append("createdBy", userId); // Use actual user ID from token

        // Add updatedBy for editing
        if (isEditing) {
          formData.append("updatedBy", userId); // Use actual user ID from token
        }

        // Add sizes as JSON string
        const sizesData = sizes.map((size) => {
          const parsedSize = parseFloat(size.size);
          return {
            size: !isNaN(parsedSize) ? parsedSize : size.size,
            price: parseFloat(size.price) || 0,
            dummyPrice: parseFloat(size.dummyPrice) || 0,
            stock: parseInt(size.stock, 10) || 0,
          };
        });
        formData.append("sizes", JSON.stringify(sizesData));

        // Add images metadata
        const imagesMeta = images.map((img, index) => ({
          id: img.id || null,
          altText: img.altText?.trim() || "",
          isPrimary: Boolean(img.isPrimary),
          isActive: Boolean(img.isActive),
          order: index,
          isExisting: Boolean(img.isExisting),
          originalUrl: img.originalUrl || img.imageData,
        }));
        formData.append("imageFiles", JSON.stringify(imagesMeta));

        // Handle existing images
        const existingImages = images
          .filter((img) => img.isExisting)
          .map((img) => ({
            id: img.id,
            image: img.originalUrl,
            altText: img.altText || "",
            isPrimary: img.isPrimary,
            isActive: true,
          }));
        formData.append("existingImageUrls", JSON.stringify(existingImages));

        // Append new image files
        images.forEach((img) => {
          if (img.file && !img.isExisting) {
            formData.append("images", img.file);
          }
        });

        // --- API Call ---
        
        const response = await axios.post(
          `${BACKEND_URL}saveProduct`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${
                localStorage.getItem("authToken")
              }`,
            },
            timeout: 30000, // 30 second timeout
          }
        );

        // --- Handle Response ---
        if (response.data.success) {
          setApiStatus({ loading: false, message: "success" });

          // Show success message briefly before closing
          setTimeout(() => {
            // Pass the response data to parent component
            onSave({
              success: true,
              data: response.data,
              message: `Product ${
                isEditing ? "updated" : "created"
              } successfully!`,
            });
          }, 1000);
        } else {
          throw new Error(response.data.message || "Failed to save product");
        }
      } catch (error) {
        console.error("Save product failed:", error);

        let errorMessage = "Failed to save product. Please try again.";

        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.message || errorMessage;
        } else if (error.request) {
          // Request made but no response received
          errorMessage =
            "No response from server. Please check your connection.";
        } else if (error.code === "ECONNABORTED") {
          // Request timeout
          errorMessage = "Request timeout. Please try again.";
        } else {
          // Other errors
          errorMessage = error.message || errorMessage;
        }

        setErrors({
          submit: errorMessage,
        });
        setApiStatus({ loading: false, message: "error" });
      } finally {
        submittingRef.current = false;
      }
    },
    [
      name,
      categoryId,
      sizes,
      images,
      isActive,
      description,
      advantages,
      howToWear,
      rating,
      isEditing,
      initialProduct,
      categoryData,
      onSave,
    ]
  );

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.imageData && img.imageData.startsWith("blob:")) {
          URL.revokeObjectURL(img.imageData);
        }
      });
    };
  }, [images]);

  // Function to render stars for rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFullStar = starValue <= Math.floor(rating);
      const isHalfStar = rating % 1 >= 0.5 && starValue === Math.ceil(rating);
      const isHovered = starValue <= hoverRating;

      return (
        <button
          key={index}
          type="button"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          onMouseLeave={handleStarLeave}
          className="text-2xl focus:outline-none relative"
        >
          {/* Empty star */}
          <FaStar className="text-gray-300 absolute inset-0" />

          {/* Half star (when applicable) */}
          {isHalfStar && (
            <div className="overflow-hidden w-1/2 absolute inset-0">
              <FaStar className="text-yellow-400" />
            </div>
          )}

          {/* Full star (when applicable) */}
          {(isFullStar || isHovered) && (
            <FaStar
              className={isHovered ? "text-yellow-300" : "text-yellow-400"}
            />
          )}
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-gray-200">
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

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}
          {apiStatus.message === "success" && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Product {isEditing ? "updated" : "added"} successfully!
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 border-2 border-gray-200 p-6 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Category Name *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="">Select Category</option>
                  {categoryData.map((cat) => (
                    <option key={cat.ID} value={cat.ID}>
                      {cat.Name}
                    </option>
                  ))}
                </select>

                {errors.categoryId && (
                  <p className="text-red-500 text-sm">{errors.categoryId}</p>
                )}
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
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Product Rating */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Product Rating *
                </label>
                <div className="flex items-center mb-2">
                  {/* {renderStars()} */}
                  {/* <span className="ml-2 text-sm text-gray-600">
                    ({rating.toFixed(1)}/5)
                  </span> */}
                </div>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={handleRatingInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter rating (0-5)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Click stars or enter a value between 0 and 5 (decimals
                  allowed)
                </p>
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
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 5MB)
                      </p>
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
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Images:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative border rounded-lg p-2 ${
                            image.isPrimary
                              ? "border-2 border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={image.imageData}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-contain rounded"
                          />

                          {/* Existing image badge */}
                          {image.isExisting && (
                            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Existing
                            </span>
                          )}

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
                              onClick={() => moveImage(index, "up")}
                              disabled={index === 0}
                              className="bg-white rounded p-1 shadow-sm disabled:opacity-50"
                              title="Move up"
                            >
                              <FaArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, "down")}
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

                {errors.sizes && (
                  <p className="text-red-500 text-sm mb-2">{errors.sizes}</p>
                )}

                {sizes.map((size, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Size
                      </label>
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) =>
                          handleSizeChange(index, "size", e.target.value)
                        }
                        placeholder="Enter size"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`size-${index}`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`size-${index}`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={size.price}
                        onChange={(e) =>
                          handleSizeChange(index, "price", e.target.value)
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`price-${index}`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`price-${index}`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Dummy Price (₹)
                      </label>
                      <input
                        type="number"
                        value={size.dummyPrice}
                        onChange={(e) =>
                          handleSizeChange(index, "dummyPrice", e.target.value)
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`dummyPrice-${index}`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`dummyPrice-${index}`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) =>
                          handleSizeChange(index, "stock", e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      />
                      {errors[`stock-${index}`] && (
                        <p className="text-red-500 text-xs">
                          {errors[`stock-${index}`]}
                        </p>
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
                  <label
                    htmlFor="isActive"
                    className="text-sm font-semibold text-gray-900"
                  >
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
                disabled={apiStatus.loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {apiStatus.loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Product" : "Create Product"}</>
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
