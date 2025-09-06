// components/CategoriesAdmin.jsx
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTimes, FaCheck } from "react-icons/fa";

const CategoriesAdmin = ({ products = [], onCategoryChange }) => {
  // State for categories
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Kavach",
      description: "Protective spiritual items and amulets",
      productCount: 12,
      isShown: true,
      isActive: true
    },
    {
      id: 2,
      name: "Rudraksh",
      description: "Sacred beads used for meditation and prayer",
      productCount: 8,
      isShown: true,
      isActive: true
    },
    {
      id: 3,
      name: "Gemstone",
      description: "Precious and semi-precious stones with spiritual properties",
      productCount: 15,
      isShown: true,
      isActive: true
    }
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isShown: true,
    isActive: true
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Calculate product counts for each category
  useEffect(() => {
    // In a real app, this would come from an API
    // For now, we'll simulate it with the products prop
    if (products && products.length > 0) {
      const updatedCategories = categories.map(category => {
        // Simulate product count based on category name
        const count = products.filter(product => 
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
  }, [products]);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const categoryToAdd = {
      ...newCategory,
      id: Date.now(), // Temporary ID until saved to backend
      productCount: 0
    };
    
    setCategories([...categories, categoryToAdd]);
    setNewCategory({ name: "", description: "", isShown: true, isActive: true });
    setIsAdding(false);
  };

  const handleEditCategory = () => {
    if (!editingCategory.name.trim()) return;
    
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setDeleteConfirm(null);
    
    // If the deleted category was selected, reset to "all"
    if (selectedCategory === id) {
      setSelectedCategory("all");
      if (onCategoryChange) onCategoryChange("all");
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) onCategoryChange(categoryId);
  };

  const toggleCategoryVisibility = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, isShown: !cat.isShown } : cat
    ));
  };

  const toggleCategoryStatus = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategorySelect("all")}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedCategory === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                selectedCategory === category.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.name}
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {category.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category description"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Category
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <button
                onClick={() => setEditingCategory({ ...editingCategory, isShown: !editingCategory.isShown })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${
                  editingCategory.isShown ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    editingCategory.isShown ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm select-none">Show on Website</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setEditingCategory({ ...editingCategory, isActive: !editingCategory.isActive })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mr-2 ${
                  editingCategory.isActive ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    editingCategory.isActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm select-none">Active</span>
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
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-50 p-4">
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
              <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
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
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleCategoryVisibility(category.id)}
                      className={`p-2 rounded transition-colors ${
                        category.isShown 
                          ? 'text-green-500 hover:bg-green-50' 
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title={category.isShown ? 'Hide category' : 'Show category'}
                    >
                      {category.isShown ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => toggleCategoryStatus(category.id)}
                      className={`p-2 rounded transition-colors ${
                        category.isActive 
                          ? 'text-green-500 hover:bg-green-50' 
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      title={category.isActive ? 'Deactivate category' : 'Activate category'}
                    >
                      {category.isActive ? <FaCheck /> : <FaTimes />}
                    </button>
                    <button
                      onClick={() => setEditingCategory({...category})}
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

export default CategoriesAdmin;