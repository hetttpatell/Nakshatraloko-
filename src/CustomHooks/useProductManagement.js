import React, { useMemo } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa";

import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchAndFilterBar from "./SearchAndFilterBar";

import { useProductManagement } from "../../CustomHooks/useProductManagement";
import { filterProducts } from "../Admin/ProductSection/productFilters";

// Constants for dropdown options
const BRAND_OPTIONS = ["STYLIUM", "PEARLIX", "DIAMONDX", "GOLDEN"];
const SIZE_OPTIONS = [
  "5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti",
  "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"
];
const MATERIAL_OPTIONS = [
  "Gemstone", "Pendant", "Necklace", "Silver",
  "Gold", "Copper", "Diamond", "Platinum"
];

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
    setSearchTerm,
    setBrandFilter,
    setStatusFilter,
    setSelectedProduct,
    setIsEditModalOpen,
    setIsAddModalOpen,
    setEditingProduct,
    setDeleteConfirmModal,
    handleSaveProduct,
    handleDeleteProduct,
  } = useProductManagement();

  // Memoized filtered products (can also use filteredProducts from hook)
  const displayedProducts = useMemo(() => {
    return filterProducts(products, searchTerm, brandFilter, statusFilter);
  }, [products, searchTerm, brandFilter, statusFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (product) => {
    setDeleteConfirmModal({ isOpen: true, productId: product.id, productName: product.name });
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" });
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Loading products...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        brandOptions={BRAND_OPTIONS}
      />

      <ProductTable
        products={displayedProducts}
        onEdit={openEditModal}
        onDelete={openDeleteConfirm}
        onView={setSelectedProduct}
      />

      {(isAddModalOpen || isEditModalOpen) && (
        <ProductModal
          title={isAddModalOpen ? "Add New Product" : "Edit Product"}
          initialProduct={editingProduct || {}}
          onClose={closeModals}
          onSave={(product) => {
            handleSaveProduct(product);
            closeModals();
          }}
          brandOptions={BRAND_OPTIONS}
          sizeOptions={SIZE_OPTIONS}
          materialOptions={MATERIAL_OPTIONS}
          isEditing={isEditModalOpen}
        />
      )}

      {deleteConfirmModal.isOpen && (
        <DeleteConfirmationModal
          productName={deleteConfirmModal.productName}
          onClose={() => setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" })}
          onConfirm={() => {
            handleDeleteProduct();
            setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" });
          }}
        />
      )}
    </div>
  );
};

export default ProductAdmin;
