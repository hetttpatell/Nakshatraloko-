// components/ProductsAdmin.jsx
import React, { useMemo, useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchAndFilterBar from "./SearchAndFilterBar";
import { useProductManagement } from "../../CustomHooks/useProductManagement";
import { filterProducts } from "../ProductSection/productFilters";
import { toast } from "react-toastify";
import Toast from "../../Components/Product/Toast";
import { FaSync, FaPlus } from "react-icons/fa";

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

const ProductAdmin = ({ isMobile }) => {
  const {
    products,
    loading,
    error,
    searchTerm,
    brandFilter,
    statusFilter,
    isEditModalOpen,
    isAddModalOpen,
    editingProduct,
    deleteConfirmModal,
    setSearchTerm,
    refreshProducts,
    setBrandFilter,
    setStatusFilter,
    setIsEditModalOpen,
    setIsAddModalOpen,
    setEditingProduct,
    setDeleteConfirmModal,
    handleDeleteProductWithAPI,
    handleSaveProduct,
    handleAddProduct,
    handleEditProduct,
    viewProductDetails,
    openDeleteConfirm,
    toastData,
    closeToast,
  } = useProductManagement();

  const [isSaving, setIsSaving] = useState(false);

  // Memoize filtered products to improve performance
  const filteredProducts = useMemo(
    () => filterProducts(products, searchTerm, brandFilter, statusFilter),
    [products, searchTerm, brandFilter, statusFilter]
  );

  // Enhanced save handler
  const handleSaveProductEnhanced = async (productData) => {
    setIsSaving(true);
    try {
      // The actual save happens in ProductModal component
      // After successful save, refresh the products list
      const result = await handleSaveProduct(productData);
      
      if (result.success) {
        // Close the modal
        if (isEditModalOpen) {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        } else if (isAddModalOpen) {
          setIsAddModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Error in save handler:", error);
      toast.error("Failed to process product save");
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading products: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="product-admin p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <p className="text-gray-600">Manage your product inventory and listings</p>
      </div>

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

      {/* Actions Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
          onClick={handleAddProduct}
        >
          <FaPlus size={14} />
          Add New Product
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-md font-medium"
          onClick={refreshProducts}
        >
          <FaSync className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Products Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <ProductTable
          products={filteredProducts}
          featuredProducts={[]} // You can remove this if not used
          onView={viewProductDetails}
          onEdit={handleEditProduct}
          onDelete={openDeleteConfirm}
        />
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <ProductModal
          title="Add New Product"
          initialProduct={{}}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveProductEnhanced}
          sizeOptions={SIZE_OPTIONS}
          isEditing={false}
          isLoading={isSaving}
        />
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <ProductModal
          title="Edit Product"
          initialProduct={editingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProductEnhanced}
          sizeOptions={SIZE_OPTIONS}
          isEditing={true}
          isLoading={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <DeleteConfirmationModal
          productName={deleteConfirmModal.productName}
          onClose={() => setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" })}
          onConfirm={() => {
            handleDeleteProductWithAPI(deleteConfirmModal.productId);
            setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" });
          }}
          isLoading={isSaving}
        />
      )}

      {/* Toast Notifications */}
      {toastData && (
        <Toast
          type={toastData.type}
          message={toastData.message}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default ProductAdmin;