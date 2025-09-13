// components/CategoriesAdmin.jsx
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTimes, FaCheck, FaArrowLeft, FaSearch, FaFilter, FaUpload } from "react-icons/fa";
import axios from "axios";

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
    isFeatured: false,   // ✅ new field
    image: ""            // ✅ new field
  });

  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imagePreview, setImagePreview] = useState(""); // For image preview
  const [imageFile, setImageFile] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:8001/api/getAllCatogary");

        if (response.data.data) {
          // Transform API data to match our component structure
          const formattedCategories = response.data.data.map(category => ({
            id: category._id || category.id || category.ID,
            name: category.name || category.Name || "",
            description: category.description || category.Description || "",
            productCount: 0,
            isShown:
              category.isShown !== undefined
                ? category.isShown
                : category.IsShown !== undefined
                  ? category.IsShown
                  : true,
            isActive:
              category.isActive !== undefined
                ? category.isActive
                : category.IsActive !== undefined
                  ? category.IsActive
                  : true,
            isFeatured: category.isFeatured || false,
            image: category.image || ""
          }));

          setCategories(formattedCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);


  // Calculate product counts for each category
  useEffect(() => {
    if (products && products.length > 0 && categories.length > 0) {
      const updatedCategories = categories.map(category => {
        const count = products.filter(product =>
          product.categoryId === category.id ||
          (product.category && product.category.toString() === category.id.toString()) ||
          product.name.toLowerCase().includes(category.name.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(category.name.toLowerCase()))
        ).length;

        return {
          ...category,
          productCount: count
        };
      });

      setCategories(updatedCategories);
    }
  }, [products, categories]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setNewCategory({ ...newCategory, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAddCategory = async () => {
  if (!newCategory.name.trim()) {
    setError("Category name is required");
    return;
  }

  try {
    setIsAddingCategory(true);
    const token = localStorage.getItem("authToken");
    
    // Call API to save category
    const response = await axios.post(
      "http://localhost:8001/api/saveCatogary",
      {
        name: newCategory.name,
        description: newCategory.description,
        isShown: newCategory.isShown,
        isActive: newCategory.isActive,
        isFeatured: newCategory.isFeatured,
        image: newCategory.image, // base64 string
        Created_By: 1 // Add the Created_By field with default value of 1
      },
      {
        headers: {
          Authorization: `${token}`
        }
      }
    );

    if (response.data.success) {
      // Add the new category to the state
      const newCat = {
        id: response.data.id || response.data._id,
        name: newCategory.name,
        description: newCategory.description,
        isShown: newCategory.isShown,
        isActive: newCategory.isActive,
        isFeatured: newCategory.isFeatured,
        image: newCategory.image,
        productCount: 0,
        Created_By: 1 // Also add to local state if needed
      };

      setCategories([...categories, newCat]);

      // Reset form
      setIsAdding(false);
      setNewCategory({
        name: "",
        description: "",
        isShown: true,
        isActive: true,
        isFeatured: false,
        image: ""
      });
      setImagePreview("");
      setImageFile(null);
      setError(null);
    }
  } catch (err) {
    console.error("Error adding category:", err);
    setError("Failed to add category. Please try again.");
  } finally {
    setIsAddingCategory(false);
  }
};
  // Filter products for the selected category
  const filteredProducts = selectedCategory

    ? products.filter(product => {
      // First check if product has the categoryId matching selected category
      if (product.categoryId === selectedCategory.id ||
        (product.category && product.category.toString() === selectedCategory.id.toString())) {
        return true;
      }


      // Fallback: check if product name or description contains category name
      return (
        product.name.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(selectedCategory.name.toLowerCase()))
      );
    }).filter(product => {
      // Apply search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== "all") {
        const inStockFilter = statusFilter === "inStock";
        if (product.inStock !== inStockFilter) return false;
      }

      return true;
    })
    : [];


  const handleEditCategory = async () => {
    if (!editingCategory.name.trim()) return;

    try {
      // Call API to update category
      const response = await axios.put(
        `http://localhost:8001/api/updateCategory/${editingCategory.id}`,
        {
          name: editingCategory.name,
          description: editingCategory.description,
          isShown: editingCategory.isShown,
          isActive: editingCategory.isActive,
          isFeatured: editingCategory.isFeatured,  // ✅ new
          image: editingCategory.image             // ✅ new
        }
      );

      if (response.data.success) {
        setCategories(categories.map(cat =>
          cat.id === editingCategory.id ? editingCategory : cat
        ));
        setEditingCategory(null);
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      // Call API to delete category
      const response = await axios.delete(`http://localhost:8001/api/deleteCategory/${id}`);

      if (response.data.success) {
        setCategories(categories.filter(cat => cat.id !== id));
        setDeleteConfirm(null);

        // If the deleted category was selected, go back to categories list
        if (selectedCategory && selectedCategory.id === id) {
          setSelectedCategory(null);
        }
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category. Please try again.");
    }
  };

  const toggleCategoryVisibility = async (id) => {
    const category = categories.find(cat => cat.id === id);
    const newVisibility = !category.isShown;

    try {
      // Call API to update visibility
      const response = await axios.put(`http://localhost:8001/api/updateCategory/${id}`, {
        isShown: newVisibility
      });

      if (response.data.success) {
        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, isShown: newVisibility } : cat
        ));
      }
    } catch (err) {
      console.error("Error updating category visibility:", err);
      setError("Failed to update category visibility. Please try again.");
    }
  };

  const toggleCategoryStatus = async (id) => {
    const category = categories.find(cat => cat.id === id);
    const newStatus = !category.isActive;

    try {
      // Call API to update status
      const response = await axios.put(`http://localhost:8001/api/updateCategory/${id}`, {
        isActive: newStatus
      });

      if (response.data.success) {
        setCategories(categories.map(cat =>
          cat.id === id ? { ...cat, isActive: newStatus } : cat
        ));
      }
    } catch (err) {
      console.error("Error updating category status:", err);
      setError("Failed to update category status. Please try again.");
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

  // Render product list for selected category
  const renderProductList = () => {
    if (!selectedCategory) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mr-4"
            >
              <FaArrowLeft /> Back to Categories
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Products in {selectedCategory.name}
            </h2>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-semibold text-gray-700">Product</th>
                  <th className="p-3 font-semibold text-gray-700">Brand</th>
                  <th className="p-3 font-semibold text-gray-700">Price</th>
                  <th className="p-3 font-semibold text-gray-700">Stock</th>
                  <th className="p-3 font-semibold text-gray-700">Rating</th>
                  <th className="p-3 font-semibold text-gray-700">Category</th> {/* Display-only */}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-200"> {/* Removed hover */}
                    <td className="p-3">
                      <div className="flex items-center">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{product.brand}</td>
                    <td className="p-3 font-medium">${product.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{product.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700">{product.category}</td> {/* Display-only */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No products found.</div>
        )}

      </div>
    );
  };

  // Render categories list
  const renderCategoriesList = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Header and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Categories Management</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Add Category
          </button>
        </div>


        {/* Add Category Form */}
        {isAdding && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Add New Category</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
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
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category description"
                  rows="4"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center">
                <button
                  onClick={() => setNewCategory({ ...newCategory, isShown: !newCategory.isShown })}
                  type="button"
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${newCategory.isShown ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${newCategory.isShown ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm">Show on Website</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setNewCategory({ ...newCategory, isActive: !newCategory.isActive })}
                  type="button"
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${newCategory.isActive ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${newCategory.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setNewCategory({ ...newCategory, isFeatured: !newCategory.isFeatured })}
                  type="button"
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${newCategory.isFeatured ? 'bg-yellow-600' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${newCategory.isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm">Featured</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                disabled={isAddingCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAddingCategory ? "Adding..." : "Add Category"}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setImagePreview("");
                  setImageFile(null);
                  setNewCategory({
                    name: "",
                    description: "",
                    isShown: true,
                    isActive: true,
                    isFeatured: false,
                    image: ""
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Categories Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold text-gray-700">Category</th>
                <th className="p-3 font-semibold text-gray-700">Products</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
                <th className="p-3 font-semibold text-gray-700">Visibility</th>
                <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr
                  key={category.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  <td className="p-3">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>
                  <td className="p-3">
                    {category.isFeatured ? (
                      <span className="text-yellow-600 font-medium">★ Featured</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="p-3">
                    <div>
                      <p className="font-medium text-gray-800">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {category.productCount} products
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${category.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {category.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center">
                      {category.isShown ? (
                        <FaEye className="text-green-500 mr-1" />
                      ) : (
                        <FaEyeSlash className="text-gray-500 mr-1" />
                      )}
                      {category.isShown ? 'Visible' : 'Hidden'}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleCategoryVisibility(category.id)}
                        className={`p-2 rounded transition-colors ${category.isShown
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        title={category.isShown ? 'Hide category' : 'Show category'}
                      >
                        {category.isShown ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button
                        onClick={() => toggleCategoryStatus(category.id)}
                        className={`p-2 rounded transition-colors ${category.isActive
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        title={category.isActive ? 'Deactivate category' : 'Activate category'}
                      >
                        {category.isActive ? <FaCheck /> : <FaTimes />}
                      </button>
                      <button
                        onClick={() => setEditingCategory({ ...category })}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Edit category"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete category"
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

        {categories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found. Add your first category to get started.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {selectedCategory ? renderProductList() : renderCategoriesList()}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => setEditingCategory({ ...editingCategory, isShown: !editingCategory.isShown })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${editingCategory.isShown ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${editingCategory.isShown ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </button>
                    <span className="text-sm">Show on Website</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => setEditingCategory({ ...editingCategory, isActive: !editingCategory.isActive })}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${editingCategory.isActive ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${editingCategory.isActive ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                    </button>
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingCategory(null)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the category "{deleteConfirm.name}"? This action cannot be undone.
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
    </div>
  );
};

export default CategoriesAdmin;