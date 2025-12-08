// components/CategoriesAdmin.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCheck,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaUpload,
  FaSync,
  FaEllipsisV,
  FaImage,
  FaBox,
  FaStar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Toast from "../../Components/Product/Toast";
import { useProductManagement } from "../../CustomHooks/useProductManagement";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const IMG_URL = import.meta.env.VITE_IMG_URL;

const CategoriesAdmin = ({ products = [], onCategoryChange }) => {
  // State for categories
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isShown: true,
    isActive: true,
    isFeatured: false,
    image: "",
    active_product_count: 0,
  });
  const [toasts, setToasts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { refreshProducts } = useProductManagement();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper functions
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/s1.jpeg";
    return `${IMG_URL.endsWith("/") ? IMG_URL : IMG_URL + "/"}uploads/${imagePath.replace(/^\/+/, "")}`;
  };

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAddForm = () => {
    setNewCategory({
      name: "",
      description: "",
      isShown: true,
      isActive: true,
      isFeatured: false,
      image: "",
      active_product_count: 0,
    });
    setImageFile(null);
    setImagePreview("");
    setIsAdding(false);
    setError(null);
  };

  // Unified API function
  const saveCategoryAPI = async (categoryData, imageFile = null) => {
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      // Append all category data
      Object.keys(categoryData).forEach(key => {
        if (key !== 'image' && key !== 'active_product_count') {
          formData.append(key, categoryData[key]);
        }
      });

      if (imageFile) formData.append("images", imageFile);

      const response = await axios.post(`${BACKEND_URL}saveCatogary`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${BACKEND_URL}getAllCatogary`);

        if (response.data.data) {
          const formattedCategories = response.data.data.map((category) => ({
            id: category._id || category.id || category.ID,
            name: category.name || category.Name || "",
            description: category.description || category.Description || "",
            active_product_count: category.active_product_count ?? 0,
            isShown: category.isShown ?? category.IsShown ?? true,
            isActive: category.isActive ?? category.IsActive ?? true,
            isFeatured: category.isFeatured ?? category.IsFeatured ?? false,
            image: getImageUrl(category.Image),
          }));

          setCategories(formattedCategories);
        }
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update active product counts
  useEffect(() => {
    if (!products || products.length === 0) return;

    setCategories((prev) =>
      prev.map((category) => {
        const activeCount = products.filter((p) => {
          const productCategoryId = p.categoryId?.toString() || p.category?.toString();
          return p.isActive && productCategoryId === category.id?.toString();
        }).length;

        return { ...category, active_product_count: activeCount };
      })
    );
  }, [products]);

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        if (isAdding) setNewCategory({ ...newCategory, image: reader.result });
        else if (editingCategory)
          setEditingCategory({ ...editingCategory, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsAddingCategory(true);
      const result = await saveCategoryAPI(newCategory, imageFile);

      if (result.success) {
        setCategories([
          ...categories,
          {
            ...newCategory,
            id: result.id || result._id,
            active_product_count: 0,
            image: getImageUrl(result.image),
          },
        ]);

        resetAddForm();
        showToast(result.message || "Category added successfully", "success");
      }
    } catch (err) {
      setError("Failed to add category.");
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Toggle featured status
  const handleToggleFeaturedApi = async (category) => {
    try {
      const featuredCount = categories.filter((cat) => cat.isFeatured).length;

      if (!category.isFeatured && featuredCount >= 4) {
        showToast("You can only select up to 4 featured categories", "error");
        return;
      }

      const updatedCategory = {
        ...category,
        isFeatured: !category.isFeatured
      };

      const result = await saveCategoryAPI(updatedCategory);

      if (result.success) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === category.id ? updatedCategory : cat
          )
        );
        showToast(result.message || "Category updated successfully", "success");
      }
    } catch (err) {
      showToast("Failed to update category", "error");
    }
  };

  // Edit category
  const handleEditCategory = async () => {
    if (!editingCategory?.name?.trim()) return;

    try {
      const result = await saveCategoryAPI(editingCategory, imageFile);

      if (result.success) {
        setCategories(categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        ));
        setEditingCategory(null);
        setImageFile(null);
        setImagePreview("");
        showToast(result.message || "Category updated successfully", "success");
      }
    } catch (err) {
      setError("Failed to update category.");
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BACKEND_URL}deleteCatogary/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        setCategories(categories.filter((cat) => cat.id !== id));
        setDeleteConfirm(null);
        showToast(response.data.message || "Category deleted successfully", "success");

        if (selectedCategory && selectedCategory.id === id) {
          setSelectedCategory(null);
        }
      }
    } catch (err) {
      setError("Failed to delete category. Please try again.");
    }
  };

  const toggleCategoryVisibility = async (id) => {
    const category = categories.find((cat) => cat.id === id);
    const newVisibility = !category.isShown;

    try {
      const response = await axios.put(`${BACKEND_URL}updateCategory/${id}`, {
        isShown: newVisibility,
      });

      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === id ? { ...cat, isShown: newVisibility } : cat
          )
        );
      }
    } catch (err) {
      setError("Failed to update category visibility. Please try again.");
    }
  };

  const toggleCategoryStatus = async (id) => {
    const category = categories.find((cat) => cat.id === id);
    const newStatus = !category.isActive;

    try {
      const response = await axios.put(`${BACKEND_URL}updateCategory/${id}`, {
        isActive: newStatus,
      });

      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === id ? { ...cat, isActive: newStatus } : cat
          )
        );
        showToast(
          `Category ${newStatus ? "activated" : "deactivated"} successfully`,
          "success"
        );
      }
    } catch (err) {
      setError("Failed to update category status. Please try again.");
    }
  };

  // Mobile-friendly toggle for row expansion
  const toggleRowExpand = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Mobile Card Component for Categories
  const CategoryCard = ({ category }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <FaImage className="text-gray-400 text-xl" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="flex items-center text-sm text-gray-600">
                <FaBox className="mr-1" />
                {category.active_product_count || 0} Products
              </span>
              {category.isFeatured && (
                <span className="flex items-center text-sm text-yellow-600">
                  <FaStar className="mr-1" />
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${category.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-xs text-gray-600">{category.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleRowExpand(category.id);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          {expandedRow === category.id ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Expanded Content */}
      {expandedRow === category.id && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            {category.description || "No description available"}
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => toggleCategoryStatus(category.id)}
              className={`flex items-center justify-center py-2 rounded-lg transition-colors ${category.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              {category.isActive ? <FaCheck /> : <FaTimes />}
              <span className="ml-2 text-sm">{category.isActive ? "Active" : "Inactive"}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEditingCategory({ ...category })}
              className="flex items-center justify-center py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaEdit />
              <span className="ml-2 text-sm">Edit</span>
            </button>
            <button
              onClick={() => setDeleteConfirm(category)}
              className="flex items-center justify-center py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaTrash />
              <span className="ml-2 text-sm">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render categories list
  const renderCategoriesList = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red四百 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Categories Management
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {categories.length} {categories.length === 1 ? "category" : "categories"} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Mobile Filter Toggle */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors md:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FaFilter />
              Filters
            </button>

            {/* Refresh Button */}
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
              onClick={refreshProducts}
            >
              <FaSync className="text-lg" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Add Category Button */}
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FaPlus />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`mb-6 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Category Form */}
        {isAdding && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Category</h3>
              <button
                onClick={resetAddForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                </label>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                          setNewCategory({ ...newCategory, image: "" });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <FaTimes className="text-xs" />
                      </button>

                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Active Status</span>
                  <button
                    onClick={() =>
                      setNewCategory({
                        ...newCategory,
                        isActive: !newCategory.isActive,
                      })
                    }
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newCategory.isActive ? "bg-green-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCategory.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Featured</span>
                  <button
                    onClick={() =>
                      setNewCategory({
                        ...newCategory,
                        isFeatured: !newCategory.isFeatured,
                      })
                    }
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newCategory.isFeatured ? "bg-blue-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCategory.isFeatured ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={handleAddCategory}
                  disabled={isAddingCategory}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isAddingCategory ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </button>
                <button
                  onClick={resetAddForm}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories List - Desktop Table */}
        {!isMobile ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Image</th>
                  <th className="p-4 font-semibold text-gray-700">Products</th>
                  <th className="p-4 font-semibold text-gray-700">Name</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Featured</th>
                  <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full text-center">
                          {category.active_product_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {category.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-2 ${category.isActive ? "bg-green-500" : "bg-gray-400"
                            }`}
                        />
                        <span className="text-sm">{category.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFeaturedApi(category);
                        }}
                        className={`flex items-center justify-center w-12 h-6 rounded-full transition-colors ${category.isFeatured ? "bg-blue-600" : "bg-gray-300"
                          }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${category.isFeatured ? "translate-x-3" : "-translate-x-3"
                            }`}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`p-2 rounded-lg transition-colors ${category.isActive
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          title={category.isActive ? "Deactivate" : "Activate"}
                        >
                          {category.isActive ? <FaCheck /> : <FaTimes />}
                        </button>
                        <button
                          onClick={() => setEditingCategory({ ...category })}
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category)}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Mobile Cards View
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaBox className="text-6xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Found</h3>
            <p className="text-gray-500 mb-6">Add your first category to get started</p>
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlus />
              Add First Category
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {selectedCategory ? (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaArrowLeft className="hidden sm:inline" />
              <span>Back to Categories</span>
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Products in {selectedCategory.name}
            </h2>
          </div>
          {/* Product list would go here */}
        </div>
      ) : (
        renderCategoriesList()
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category description"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        setEditingCategory({
                          ...editingCategory,
                          isActive: !editingCategory.isActive,
                        })
                      }
                      type="button"
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${editingCategory.isActive
                        ? "bg-green-600"
                        : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${editingCategory.isActive
                          ? "translate-x-6"
                          : "translate-x-0"
                          }`}
                      />
                    </button>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        setEditingCategory({
                          ...editingCategory,
                          isFeatured: !editingCategory.isFeatured,
                        })
                      }
                      type="button"
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${editingCategory.isFeatured
                        ? "bg-yellow-600"
                        : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${editingCategory.isFeatured
                          ? "translate-x-6"
                          : "translate-x-0"
                          }`}
                      />
                    </button>
                    <span className="text-sm">Featured</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setImagePreview("");
                    setImageFile(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the category "
                {deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCategory(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toastItem) => (
          <Toast
            key={toastItem.id}
            message={toastItem.message}
            type={toastItem.type}
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesAdmin;