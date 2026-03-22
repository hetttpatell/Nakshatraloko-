import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import Toast from "../Components/Product/Toast";
const IMG_URL = import.meta.env.VITE_IMG_URL;

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
  const _featuredProducts = useState([])[0];
  const [isSaving, setIsSaving] = useState(false);
  const [toastData, setToastData] = useState(null);

  const showToast = (type, message) => {
    setToastData({ type, message });
  };

  const closeToast = () => {
    setToastData(null);
  };

  const normalizeImage = (url) => {
    if (!url) return "/s1.jpeg";

    url = url.trim().replace(/^\/+/, ""); // remove leading slash

    if (!url.startsWith("uploads/")) {
      url = "uploads/" + url;
    }

    const base = IMG_URL.endsWith("/") ? IMG_URL : IMG_URL + "/";
    return base + url;
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken")
      const allResponse = await axios.post(`${BACKEND_URL}getAllProducts`, {}, {
        headers: {
          Authorization: `${token}`
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
            primaryImage: normalizeImage(item.PrimaryImage),
            IsSlidShow: item.IsSlidShow || false,
          }));

        setProducts(normalized);
        // setFeaturedProducts(featuredIds); // unused
      } else {
        throw new Error("Failed to fetch products or featured products");
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Add this function to handle product save
  const handleSaveProduct = async (productData) => {
    setIsSaving(true);
    try {
      // Refresh products after save
      await loadProducts();
      showToast("success", `Product ${editingProduct ? "updated" : "added"} successfully!`);
      return { success: true };
    } catch (error) {
      console.error("Error refreshing products after save:", error);
      showToast("error", "Product saved but failed to refresh list");
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  };

  // Add this function to handle adding new product
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

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
      console.error("Error deleting product:", error);
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
        const product = response.data.data.product;
        // Robust image normalization - handle various backend field names
        const normalizeProductImage = (img) => {
          if (!img) return null;
          const imagePath = img.image || img.imageData || img.imageUrl || img.PrimaryImage || img.originalUrl || img.imagePath || '';
          if (!imagePath) return null;
          return {
            ...img,
            imageData: normalizeImage(imagePath),
            originalUrl: imagePath,  // preserve backend path for formData
            type: img.type || (imagePath.endsWith('.mp4') || imagePath.endsWith('.mov') || imagePath.endsWith('.webm') ? "video/mp4" : "image/jpeg"),
            isExisting: true
          };
        };

        const normalizedProduct = {
          id: product.id || product.ID,
          categoryId: product.categoryId || product.CatogaryID,
          Name: product.name || product.Name,
          Description: product.description || product.Description,
          Advantages: product.advantages || product.Advantages,
          HowToWear: product.howToWear || product.HowToWear,
          IsActive: product.isActive || product.IsActive,
          Rating: product.productRatings || product.rating || product.Rating || 0,
          sizes: product.sizes || product.Sizes || [],
          images: (product.images || product.Images || []).map(normalizeProductImage).filter(Boolean),
          price: product.sizes?.[0]?.price || product.Price || 0,
          dummyPrice: product.sizes?.[0]?.dummyPrice || product.DummyPrice || 0,
          discountPercentage: product.sizes?.[0]
            ? Math.round(((product.sizes[0].dummyPrice - product.sizes[0].price) / product.sizes[0].dummyPrice) * 100)
            : (product.DummyPrice && product.Price ? Math.round(((product.DummyPrice - product.Price) / product.DummyPrice) * 100) : 0),
          stock: product.sizes?.[0]?.stock || product.Stock || 0,
          primaryImage: normalizeImage(
            (product.images || product.Images || []).find(img => img.isPrimary)?.imageData ||
            product.PrimaryImage ||
            product.primaryImage
          ) || null,
        };

        setEditingProduct(normalizedProduct);
        setIsEditModalOpen(true);
      } else {
        showToast("error", response.data.message || "Failed to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      showToast("error", "Failed to fetch product details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add view product function
  const viewProductDetails = (product) => {
    setSelectedProduct(product);
  };

  // Add delete confirmation function
  const openDeleteConfirm = (productId, productName) => {
    setDeleteConfirmModal({
      isOpen: true,
      productId: productId,
      productName: productName
    });
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
    handleSaveProduct, // Add this
    handleAddProduct, // Add this
    handleEditProduct,
    viewProductDetails, // Add this
    openDeleteConfirm, // Add this
    toastData,
    closeToast,
  };
};