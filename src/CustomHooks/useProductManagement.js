import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import Toast from "../Components/Product/Toast";
export const useProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false, productId: null, productName: ""
  });

  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastData, setToastData] = useState(null);

  const showToast = (type, message) => {
    setToastData({ type, message });
  };

  const closeToast = () => {
    setToastData(null);
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token =localStorage.getItem("authToken")
      const allResponse = await axios.post(`${BACKEND_URL}getAllProducts`,{},{
        headers:{
          Authorization:`${token}`
        }
      });
      const featuredResponse = await axios.post(`${BACKEND_URL}getFeaturedProducts`);

      if (allResponse.data.success && featuredResponse.data.success) {
        const featuredIds = featuredResponse.data.data.map((p) => p.ID);

        const allProducts = Array.isArray(allResponse.data.data) ? allResponse.data.data : [];

        const normalized = allProducts
          .sort((a, b) => b.ID - a.ID)
          .map((item) => ({
            id: item.ID,
            categoryId: item.CatogaryID,
            name: item.Name,
            description: item.Description,
            price: item.Price,
            dummyPrice: item.DummyPrice,
            discountPercentage: item.DiscountPercentage,
            stock: item.Stock,
            advantages: item.Advantages,
            howToWear: item.HowToWear,
            isActive: item.IsActive,
            isFeatured: featuredIds.includes(item.ID),
            primaryImage: item.PrimaryImage,
          }));

        setProducts(normalized);
        setFeaturedProducts(featuredIds);
      } else {
        throw new Error("Failed to fetch products or featured products");
      }
    } catch (error) {
      // console.error("Failed to load products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDeleteProductWithAPI = async (productId) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${BACKEND_URL}deleteProduct/${productId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast("success", "Product deleted successfully!");
      } else {
        showToast("error", response.data.message || "Failed to delete product");
      }
    } catch (error) {
      // console.error("Error deleting product:", error);
      showToast("error", "Failed to delete product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProduct = async (productId) => {
    try {
      setIsSaving(true);
      const response = await axios.post(`${BACKEND_URL}getProductById/${productId}`);
      if (response.data.success) {
        const product = response.data.data.product; // Access product correctly
        const normalizedProduct = {
          id: product.id,
          categoryId: product.categoryId,
          Name: product.name,
          Description: product.description,
          Advantages: product.advantages,
          HowToWear: product.howToWear,
          IsActive: product.isActive,
          sizes: product.sizes || [],
          images: product.images || [],
          price: product.price || 0,
          dummyPrice: product.dummyPrice || 0,
          discountPercentage: product.discountPercentage || 0,
          stock: product.stock || 0,
          primaryImage: product.primaryImage || null,
        };
        setEditingProduct(normalizedProduct);
        setIsEditModalOpen(true);
      } else {
        showToast("error", response.data.message || "Failed to fetch product details");
      }
    } catch (error) {
      // console.error("Error fetching product details:", error);
      showToast("error", "Failed to fetch product details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };





  return {
    products,
    loading,
    error, 
    searchTerm,
    brandFilter,
    statusFilter,
    selectedProduct,
    isEditModalOpen,
    isAddModalOpen,
    editingProduct,
    deleteConfirmModal,
    refreshProducts: loadProducts,
    setSearchTerm,
    setBrandFilter,
    setStatusFilter,
    setSelectedProduct,
    setIsEditModalOpen,
    setIsAddModalOpen,
    setEditingProduct,
    setDeleteConfirmModal,
    handleDeleteProductWithAPI,
    handleEditProduct,
    toastData,
    closeToast,
  };
}; 