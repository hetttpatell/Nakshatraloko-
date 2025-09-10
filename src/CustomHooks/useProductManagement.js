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

  // Simulate loading products from an API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state on new attempt
        
        // REPLACE THIS WITH YOUR ACTUAL API CALL
        const response = await axios.post('http://localhost:8001/api/getAllProducts'); 
        
        // Check the structure of your API's response and adjust these lines accordingly
        if (response.data.success) {
  const normalized = response.data.data.map(item => ({
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
  }));
  setProducts(normalized);
}
 else {
          // Handle API response indicating failure
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        setError(error.message); // Store the error to display it later
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
    handleDeleteProduct,
    handleSaveProduct,
    handleAddProduct,
    openDeleteConfirm,
    handleEditProduct,
    viewProductDetails
  };
};