import { useState, useEffect } from "react";
import axios from "axios";
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
  // Simulate loading products from an API
useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all products
      const allResponse = await axios.post('http://localhost:8001/api/getAllProducts');
      // Fetch featured products
      const featuredResponse = await axios.post('http://localhost:8001/api/getFeaturedProducts');

      if (allResponse.data.success && featuredResponse.data.success) {
        const featuredIds = featuredResponse.data.data.map(p => p.ID);

        // Normalize products and mark featured ones
        const normalized = allResponse.data.data
        .sort((a, b) => a.ID - b.ID)
        .map(item => ({
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
          isFeatured: featuredIds.includes(item.ID), // <-- mark featured
          primaryImage: item.PrimaryImage
        }));

        setProducts(normalized);
        setFeaturedProducts(featuredIds); // update featured state too
      } else {
        throw new Error('Failed to fetch products or featured products');
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, []);

const handleDeleteProductWithAPI = async (productId) => {
  setIsSaving(true);
  try {
    const token = localStorage.getItem("authToken")

    const response = await axios.post(`http://localhost:8001/api/deleteProduct/${productId}`,{},{
      headers:{
       Authorization: `${token}`
      }
    });

    if (response.data.success) {
      // Remove deleted product from state
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert("Product deleted successfully!");
    } else {
      alert(response.data.message || "Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product. Please try again.");
  } finally {
    setIsSaving(false);
  }
};


  const handleSaveProduct = (updatedProduct) => {
    if (editingProduct && editingProduct.id) {
      // Update existing product
      setProducts(prev =>
        prev.map(product =>
          product.id === editingProduct.id
            ? { ...updatedProduct, id: editingProduct.id }
            : product
        )
      );
    }
  };

  const handleAddProduct = (productData) => {
    // Generate a unique ID for the new product
    const newId = Date.now().toString();
    const newProduct = {
      ...productData,
      id: newId,
      rating: 0,
      reviews: 0
    };

    setProducts(prev => [...prev, newProduct]);
  };

  const openDeleteConfirm = (productId, productName) => {
    setDeleteConfirmModal({
      isOpen: true,
      productId,
      productName
    });
  };

  const handleEditProduct = (product) => {
    const normalizedProduct = {
      id: product.ID || product.id,
      categoryId: product.CategoryID || product.categoryId || "",
      Name: product.Name || product.name || "",
      Description: product.Description || product.description || "",
      Advantages: product.Advantages || product.advantages || "",
      HowToWear: product.HowToWear || product.howToWear || "",
      IsActive: product.IsActive !== undefined ? product.IsActive : (product.isActive !== undefined ? product.isActive : true),
      sizes: product.Sizes || product.sizes || [],
      images: product.Images || product.images || [],
    };

    setEditingProduct(normalizedProduct);
    setIsEditModalOpen(true);
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
  };

  return {
    products,
    loading,
    error, // Make error available to the component
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
    handleDeleteProductWithAPI,
    handleSaveProduct,
    handleAddProduct,
    openDeleteConfirm,
    handleEditProduct,
    viewProductDetails
  };
};