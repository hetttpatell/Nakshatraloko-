// components/ProductsAdmin.jsx
import React, { useMemo, useState, useEffect } from "react";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import SearchAndFilterBar from "./SearchAndFilterBar";
import { useProductManagement } from "../../CustomHooks/useProductManagement";
import { filterProducts } from "../ProductSection/productFilters";
import api from '../../Utils/api'; // Import the api utility
import axios from "axios";
import { toast } from "react-toastify";
import Toast from "../../Components/Product/Toast";
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

  // ✅ FIX: hooks must be inside component
  const [featuredProducts, setFeaturedProducts] = useState([]);

  
// 🔹 Fetch featured products from backend
useEffect(() => {
  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.post("http://localhost:8001/api/getFeaturedProducts");
 
      if (response.data.success) {
        // Extract just the IDs from API response
        const featuredIds = response.data.data.map((p) => p.ID);
        setFeaturedProducts(featuredIds);
      }
    } catch (err) {
      console.error("Error fetching featured products:", err);
    }
  };

  fetchFeaturedProducts();
}, []);

useEffect(()=>{

})


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
      // ✅ Refresh the list from backend
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
      const response = await api.put(`/admin/products/${editingProduct.id}`, productData);

      if (response.data.success) {
        handleSaveProduct(response.data.data); // update state
        // alert("Product updated successfully!");
      } else {
        // alert(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      // alert("Failed to update product. Please try again.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle deleting product via API





  // Memoize filtered products to improve performance
  const filteredProducts = useMemo(
    () => filterProducts(products, searchTerm, brandFilter, statusFilter),
    [products, searchTerm, brandFilter, statusFilter]
  );

  // Then, somewhere in your JSX, conditionally render the error
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
        featuredProducts={featuredProducts} // ✅ pass featured product IDs
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
      {isEditModalOpen && (
        <ProductModal
          title="Edit Product"
          initialProduct={editingProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditProductWithAPI}
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
    handleDeleteProductWithAPI(deleteConfirmModal.productId); // Pass ID
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