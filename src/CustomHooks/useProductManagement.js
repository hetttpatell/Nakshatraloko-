import { useState, useEffect } from "react";

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

  // Simulate loading products from an API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // For now, we'll use an empty array
        const sampleProducts = [];
        setProducts(sampleProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDeleteProduct = () => {
    if (deleteConfirmModal.productId) {
      setProducts(prev => prev.filter(product => product.id !== deleteConfirmModal.productId));
      setDeleteConfirmModal({ isOpen: false, productId: null, productName: "" });
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
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
  };

  return {
    products,
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
    handleDeleteProduct,
    handleSaveProduct,
    handleAddProduct,
    openDeleteConfirm,
    handleEditProduct,
    viewProductDetails
  };
};