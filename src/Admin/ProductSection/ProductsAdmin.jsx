// components/ProductAdmin.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, 
  FaChevronDown, FaTimes, FaExclamationTriangle, FaSpinner 
} from "react-icons/fa";

import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchAndFilterBar from "./SearchAndFilterBar";
import { useProductManagement } from "../../CustomHooks/useProductManagement";
import { filterProducts } from "../ProductSection/productFilters";

// Constants for options
const BRAND_OPTIONS = ["STYLIUM", "PEARLIX", "DIAMONDX", "GOLDEN"];
const SIZE_OPTIONS = ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"];
const MATERIAL_OPTIONS = ["Gemstone", "Pendant", "Necklace", "Silver", "Gold", "Copper", "Diamond", "Platinum"];

const ProductAdmin = () => {
  const {
    products,
    filteredProducts,
    loading,
    searchTerm,
    brandFilter,
    statusFilter,
    selectedProduct,
    isEditModalOpen,
    isAddModalOpen,
    editingProduct,
    deleteConfirmModal,
    newProduct,
    setSearchTerm,
    setBrandFilter,
    setStatusFilter,
    setSelectedProduct,
    setIsEditModalOpen,
    setIsAddModalOpen,
    setEditingProduct,
    setDeleteConfirmModal,
    setNewProduct,
    handleDeleteProduct,
    handleSaveProduct,
    handleAddProduct,
    handleInputChange,
    handleMultiSelectChange,
    openDeleteConfirm,
    handleEditProduct,
    viewProductDetails
  } = useProductManagement();

  // Memoized filtered products
  const memoizedFilteredProducts = useMemo(() => 
    filterProducts(products, searchTerm, brandFilter, statusFilter),
    [products, searchTerm, brandFilter, statusFilter]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-md"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus className="text-sm" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        brandOptions={BRAND_OPTIONS}
      />

      {/* Products Table */}
      <ProductTable
        products={memoizedFilteredProducts}
        onView={viewProductDetails}
        onEdit={handleEditProduct}
        onDelete={openDeleteConfirm}
      />

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <ProductModal
          title="Add New Product"
          product={newProduct}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
          onChange={handleInputChange}
          onMultiSelectChange={handleMultiSelectChange}
          brandOptions={BRAND_OPTIONS}
          sizeOptions={SIZE_OPTIONS}
          materialOptions={MATERIAL_OPTIONS}
          isEditing={false}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <ProductModal
          title="Edit Product"
          product={editingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          onChange={(e) => {
            const { name, value, type, checked } = e.target;
            setEditingProduct(prev => ({
              ...prev,
              [name]: type === 'checkbox' ? checked : value
            }));
          }}
          onMultiSelectChange={(e, field) => {
            const options = e.target.options;
            const selectedValues = [];
            for (let i = 0; i < options.length; i++) {
              if (options[i].selected) {
                selectedValues.push(options[i].value);
              }
            }
            setEditingProduct(prev => ({
              ...prev,
              [field]: selectedValues
            }));
          }}
          brandOptions={BRAND_OPTIONS}
          sizeOptions={SIZE_OPTIONS}
          materialOptions={MATERIAL_OPTIONS}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <DeleteConfirmationModal
          productName={deleteConfirmModal.productName}
          onClose={() => setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" })}
          onConfirm={handleDeleteProduct}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductAdmin;