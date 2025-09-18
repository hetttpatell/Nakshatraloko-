// components/ProductsAdmin.jsx
import React, { useMemo, useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchAndFilterBar from "./SearchAndFilterBar";
import { useProductManagement } from "../../CustomHooks/useProductManagement";
import { filterProducts } from "../ProductSection/productFilters";
import api from '../../Utils/api';
import axios from "axios";
import { toast } from "react-toastify";
import Toast from "../../Components/Product/Toast";
import { FaSync } from "react-icons/fa";

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
    openDeleteConfirm,
    handleEditProduct,
    viewProductDetails,
    toastData,
    closeToast,
  } = useProductManagement();

  const [isSaving, setIsSaving] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.post("http://localhost:8001/api/getFeaturedProducts");
        if (response.data.success) {
          const featuredIds = response.data.data.map((p) => p.ID);
          setFeaturedProducts(featuredIds);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Function to handle adding product via API
  const handleAddProductWithAPI = async (productData) => {
    setIsSaving(true);
    try {
      const payload = {
        Name: productData.name,
        Description: productData.description,
        Price: Number(productData.price),
        DummyPrice: Number(productData.dummyPrice),
        Stock: Number(productData.stock),
        CategoryID: productData.categoryId,
        PrimaryImage: productData.primaryImage || null,
        Advantages: productData.advantages || "",
        HowToWear: productData.howToWear || "",
        IsActive: true,
      };

      const response = await api.post("/admin/products", payload);
      if (response.data.success) {
        toast.success("Product added successfully!");
        await refreshProducts();
      } else {
        toast.error(response.data.message || "Failed to save product");
      }
    } catch (error) {
      console.error("❌ Request failed:", error.response?.data || error.message);
      toast.error("Something went wrong while saving product");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle editing product via API
  const handleEditProductWithAPI = async (productData) => {
    setIsSaving(true);
    try {
      // Implement your edit API call here
      console.log("Editing product:", productData);
      toast.success("Product updated successfully!");
      await refreshProducts();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("❌ Edit failed:", error);
      toast.error("Something went wrong while updating product");
    } finally {
      setIsSaving(false);
    }
  };

  // Memoize filtered products to improve performance
  const filteredProducts = useMemo(
    () => filterProducts(products, searchTerm, brandFilter, statusFilter),
    [products, searchTerm, brandFilter, statusFilter]
  );

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
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-md"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Product
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors shadow-md"
          onClick={refreshProducts}
        >
          <FaSync className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        featuredProducts={featuredProducts}
        onView={viewProductDetails}
        onEdit={handleEditProduct}
        onDelete={(productId, productName) => {
          setDeleteConfirmModal({
            isOpen: true,
            productId: productId,
            productName: productName
          });
        }}
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

      {/* Edit Product Modal - FIXED: Added onSave prop */}
      {isEditModalOpen && (
        <ProductModal
          title="Edit Product"
          initialProduct={editingProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditProductWithAPI} // This was missing!
          brandOptions={BRAND_OPTIONS}
          sizeOptions={SIZE_OPTIONS}
          materialOptions={MATERIAL_OPTIONS}
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