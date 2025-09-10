// components/ProductsAdmin.jsx
import React, { useMemo, useState } from "react";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchAndFilterBar from "./SearchAndFilterBar";
import { useProductManagement } from "../../CustomHooks/useProductManagement";
import { filterProducts } from "../ProductSection/productFilters";
import axios from 'axios';

// Constants for options
const BRAND_OPTIONS = ["STYLIUM", "PEARLIX", "DIAMONDX", "GOLDEN"];
const SIZE_OPTIONS = [
  "5 Ratti",
  "5.25 Ratti",
  "6 Ratti",
  "6.5 Ratti",
  "7 Ratti",
  "7.5 Ratti",
  "8 Ratti",
  "8.5 Ratti",
];
const MATERIAL_OPTIONS = [
  "Gemstone",
  "Pendant",
  "Necklace",
  "Silver",
  "Gold",
  "Copper",
  "Diamond",
  "Platinum",
];

const ProductAdmin = () => {
  const {
    products,
    loading,
    searchTerm,
    brandFilter,
    statusFilter,
    isEditModalOpen,
    isAddModalOpen,
    editingProduct,
    deleteConfirmModal,
    setSearchTerm,
    setBrandFilter,
    setStatusFilter,
    setIsEditModalOpen,
    setIsAddModalOpen,
    setEditingProduct,
    setDeleteConfirmModal,
    handleDeleteProduct,
    handleSaveProduct,
    handleAddProduct,
    openDeleteConfirm,
    handleEditProduct,
    viewProductDetails
  } = useProductManagement();

  const [isSaving, setIsSaving] = useState(false);
  
  // Function to handle adding product via API
  const handleAddProductWithAPI = async (productData) => {
    setIsSaving(true);
    try {
      const response = await axios.post('http://localhost:8001/api/getAllProducts', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const savedProduct = response.data;

      // Call the original handleAddProduct to update local state
      handleAddProduct(savedProduct);

      // Show success message
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Memoize filtered products to improve performance
  const filteredProducts = useMemo(
    () => filterProducts(products, searchTerm, brandFilter, statusFilter),
    [products, searchTerm, brandFilter, statusFilter]
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading products...
      </div>
    );
  }

  return (
    <div className="product-admin p-6">
      {/* Search and Filters Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        brandOptions={BRAND_OPTIONS}
      />

      {/* Add Product Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-md mb-6"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add New Product
      </button>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onView={viewProductDetails}
        onEdit={handleEditProduct}
        onDelete={openDeleteConfirm}
      />

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <ProductModal
          title="Add New Product"
          initialProduct={{}}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(productData) => {
            handleAddProductWithAPI(productData);
            setIsAddModalOpen(false);
          }}
          brandOptions={BRAND_OPTIONS}
          sizeOptions={SIZE_OPTIONS}
          materialOptions={MATERIAL_OPTIONS}
          isEditing={false}
          isLoading={isSaving}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <ProductModal
          title="Edit Product"
          initialProduct={editingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={(updatedProduct) => {
            handleSaveProduct(updatedProduct);
            setIsEditModalOpen(false);
            setEditingProduct(null);
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
          onConfirm={() => {
            handleDeleteProduct();
            setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" });
          }}
          isLoading={isSaving}
        />
      )}
    </div>
  );
};

export default ProductAdmin;