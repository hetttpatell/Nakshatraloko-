// components/Coupons.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCopy,
  FaSearch,
  FaFilter,
  FaTimes,
  FaPercent,
  FaRupeeSign,
  FaCalendarAlt,
  FaHashtag,
  FaSync,
  FaChevronDown,
  FaCheck
} from "react-icons/fa";
import Toast from "../../Components/Product/Toast";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    usageLimit: 100,
    isActive: true,
    coupenType: "GENERAL",
    productIds: []
  });
  const [products, setProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [showEditProductDropdown, setShowEditProductDropdown] = useState(false);
  const [editProductSearchTerm, setEditProductSearchTerm] = useState("");

  const couponTypes = ["GENERAL", "NEW_USER", "SPECIAL_OFFER", "SEASONAL"];

  // Fetch coupons from API
  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("authToken")
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8001/api/getAllCoupons",
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error("Invalid response format from server");
      }

      const fetchedCoupons = response.data.data.map(coupon => ({
        id: coupon.ID,
        code: coupon.Code || "",
        description: coupon.Description,
        discountType: coupon.DiscountType,
        discountValue: parseFloat(coupon.DiscountValue),
        minOrderAmount: parseFloat(coupon.Min_Order_Amount),
        maxDiscountAmount: coupon.Max_Discount_Amount ? parseFloat(coupon.Max_Discount_Amount) : null,
        startDate: coupon.StartDate,
        endDate: coupon.EndDate,
        usageLimit: coupon.Usage_Limit,
        usedCount: coupon.totalcount ? parseInt(coupon.totalcount) : 0,
        isActive: coupon.IsActive,
        coupenType: coupon.CoupenType,
        productIds: coupon.productids || []
      }));

      setCoupons(fetchedCoupons);
      setError(null);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons. Please try again later.");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.post("http://localhost:8001/api/GetProductForCoupon", {},
        {
          headers: {
            Authorization: `${token}`
          }
        });
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setToast({ message: "Failed to load products", type: "error", visible: true });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCouponForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Toggle product selection for add form
  const toggleProductSelection = (productId) => {
    setCouponForm(prev => {
      const currentIds = prev.productIds || [];
      const isSelected = currentIds.includes(productId);

      if (isSelected) {
        return {
          ...prev,
          productIds: currentIds.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          productIds: [...currentIds, productId]
        };
      }
    });
  };

  // Toggle product selection for edit form
 // Toggle product selection for edit form
const toggleEditProductSelection = (productId) => {
  setEditingCoupon(prev => {
    const currentIds = prev.productIds || [];
    const isSelected = currentIds.includes(productId);
    
    if (isSelected) {
      return {
        ...prev,
        productIds: currentIds.filter(id => id !== productId)
      };
    } else {
      return {
        ...prev,
        productIds: [...currentIds, productId]
      };
    }
  });
};

  useEffect(() => {
    console.log("Component mounted, fetching coupons and products...");
    fetchCoupons();
    fetchProducts();
  }, []);

const handleSaveCoupon = async (couponData) => {
  try {
    // Trim and validate coupon code
    const code = couponData.code?.trim();
    if (!code) {
      setToast({ message: "Coupon code is required", type: "error", visible: true });
      return false;
    }

    // Prepare backend payload
    const backendCoupon = {
      id: couponData.id || 0,
      code,
      description: couponData.description?.trim() || "",
      discountType: couponData.discountType,
      discountValue: parseFloat(couponData.discountValue) || 0,
      startDate: couponData.startDate ? new Date(couponData.startDate).toISOString() : null,
      endDate: couponData.endDate ? new Date(couponData.endDate).toISOString() : null,
      coupenType: couponData.coupenType || "GENERAL",
      usageLimit: parseInt(couponData.usageLimit) || 0,
      createdBy: 1,
      updatedBy: 1,
      minOrderAmount: parseFloat(couponData.minOrderAmount) || 0,
      maxDiscountAmount: couponData.maxDiscountAmount ? parseFloat(couponData.maxDiscountAmount) : null,
      isActive: couponData.isActive ?? true,
    };

    // ✅ Fix product IDs: ensure we get only selected product IDs
    // couponData.productIds can be array of objects [{ID: 52, Name: "het"}] or just IDs [52]
    if (Array.isArray(couponData.productIds) && couponData.productIds.length > 0) {
      backendCoupon.productIDs = couponData.productIds.map(product => {
        if (typeof product === "object" && product.ID !== undefined) return product.ID;
        if (typeof product === "number") return product;
        return null;
      }).filter(id => id !== null); // remove any nulls
    } else {
      backendCoupon.productIDs = []; // fallback
    }

    console.log("Sending coupon to backend:", backendCoupon);

    // Call backend API
    const response = await axios.post("http://localhost:8001/api/saveCoupon", backendCoupon);

    if (response.status === 200 && response.data.success) {
      setToast({ message: "Coupon saved successfully!", type: "success", visible: true });
      fetchCoupons();
      return true;
    } else {
      setToast({ message: response.data.message || "Failed to save coupon.", type: "error", visible: true });
      return false;
    }

  } catch (err) {
    console.error("Error saving coupon:", err);
    if (err.response) {
      console.error("Error response data:", err.response.data);
      console.error("Error response status:", err.response.status);
    }
    setToast({
      message: err.response?.data?.message || "Failed to save coupon. Please try again.",
      type: "error",
      visible: true
    });
    return false;
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!couponForm.code || !couponForm.description || !couponForm.discountValue || !couponForm.endDate) {
        setError("Please fill all required fields");
        return;
      }

      // Validate dates
      if (new Date(couponForm.endDate) < new Date(couponForm.startDate)) {
        setError("End date cannot be before start date");
        return;
      }

      // Prepare payload with correct types
      const payload = {
        ...couponForm,
        discountValue: parseFloat(couponForm.discountValue),
        minOrderAmount: parseFloat(couponForm.minOrderAmount),
        maxDiscountAmount: couponForm.maxDiscountAmount ? parseFloat(couponForm.maxDiscountAmount) : null,
        startDate: new Date(couponForm.startDate).toISOString(),
        endDate: new Date(couponForm.endDate).toISOString(),
        usageLimit: parseInt(couponForm.usageLimit),
        productIds: couponForm.productIds || []
      };

      const success = await handleSaveCoupon(payload);
      if (success) {
        setIsAdding(false);
        // Reset form
        setCouponForm({
          code: "",
          description: "",
          discountType: "PERCENTAGE",
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscountAmount: null,
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          usageLimit: 100,
          isActive: true,
          coupenType: "GENERAL",
          productIds: []
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save coupon. Please try again.");
    }
  };

  // Filter coupons based on search and filters
  const filteredCoupons = coupons.filter(coupon => {
    // Search filter
    if (searchTerm &&
      !coupon.code.includes(searchTerm) &&
      !coupon.description.includes(searchTerm)) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active" && !coupon.isActive) return false;
      if (statusFilter === "inactive" && coupon.isActive) return false;
      if (statusFilter === "expired" && new Date(coupon.endDate) > new Date()) return false;
      if (statusFilter === "usedUp" && coupon.usedCount < coupon.usageLimit) return false;
    }

    // Type filter
    if (typeFilter !== "all" && coupon.discountType !== typeFilter) {
      return false;
    }

    return true;
  });

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCouponForm((prev) => ({ ...prev, code }));
  };

  const handleEditCoupon = async () => {
    if (!editingCoupon.code || !editingCoupon.description || !editingCoupon.discountValue || !editingCoupon.endDate) {
      setError("Please fill all required fields");
      return;
    }

    // Validate dates
    if (new Date(editingCoupon.endDate) < new Date(editingCoupon.startDate)) {
      setError("End date cannot be before start date");
      return;
    }

    try {
      // Format dates properly for API
      const couponToUpdate = {
        ...editingCoupon,
        maxDiscountAmount: editingCoupon.maxDiscountAmount || null,
        productIds: editingCoupon.productIds || []
      };

      const success = await handleSaveCoupon(couponToUpdate);

      if (success) {
        setEditingCoupon(null);
      }
    } catch (err) {
      console.error("Error updating coupon:", err);
      setError("Failed to update coupon. Please try again.");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `http://localhost:8001/api/deleteCoupon/${id}`,
        {},
        {
          headers: {
            Authorization: token ? `${token}` : "",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setToast({ message: "Coupon deleted successfully!", type: "error", visible: true });
        fetchCoupons();
        setDeleteConfirm(null);
      } else {
        setToast({ message: response.data.message || "Failed to delete coupon.", type: "error", visible: true });
      }
    } catch (err) {
      console.error("Error deleting coupon:", err.response?.data || err);
      setToast({ message: err.response?.data?.error || "Failed to delete coupon. Please try again.", type: "error", visible: true });
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      const coupon = coupons.find(c => c.id === id);
      const updatedCoupon = { ...coupon, isActive: !coupon.isActive };

      const success = await handleSaveCoupon(updatedCoupon);

      if (success) {
        // Update local state
        setCoupons(coupons.map(c =>
          c.id === id ? { ...c, isActive: !c.isActive } : c
        ));
      }
    } catch (err) {
      console.error("Error toggling coupon status:", err);
    }
  };

  const duplicateCoupon = (coupon) => {
    const duplicatedCoupon = {
      ...coupon,
      id: 0, // Let backend generate new ID
      code: coupon.code + "_COPY",
      usedCount: 0,
      startDate: new Date().toISOString().split('T')[0]
    };

    setCouponForm(duplicatedCoupon);
    setIsAdding(true);
  };

  const calculateUsagePercentage = (coupon) => {
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  const isCouponExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  // Filter products based on search term for add form
  const filteredProducts = products.filter(product =>
    product && (product.name || product.Name || "").toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product && product.id.toString().includes(productSearchTerm)
  );

  // Filter products based on search term for edit form
  const filteredEditProducts = products.filter(product =>
    product && (product.name || product.Name || "").toLowerCase().includes(editProductSearchTerm.toLowerCase()) ||
    product && product.id.toString().includes(editProductSearchTerm)
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons Management</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchCoupons}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            title="Refresh coupons"
          >
            <FaSync /> Refresh
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Create Coupon
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-red-800 font-medium">
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="searchTerm"
            placeholder="Search coupons by code or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="usedUp">Used Up</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>
        </div>
      </div>

      {/* Add Coupon Form */}
      {isAdding && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create New Coupon</h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="code"
                    value={couponForm.code}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter coupon code"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCouponCode}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    title="Generate random code"
                  >
                    <FaHashtag />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  name="description"
                  value={couponForm.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coupon description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                <select
                  name="discountType"
                  value={couponForm.discountType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                  {couponForm.discountType === "PERCENTAGE" ? " (%)" : " (₹)"}
                </label>
                <div className="relative">
                  {couponForm.discountType === "PERCENTAGE" ? (
                    <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  ) : (
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    type="number"
                    name="discountValue"
                    value={couponForm.discountValue}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step={couponForm.discountType === "PERCENTAGE" ? "1" : "0.01"}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={couponForm.minOrderAmount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              {couponForm.discountType === "PERCENTAGE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount (₹)</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={couponForm.maxDiscountAmount || ""}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={couponForm.startDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={couponForm.endDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={couponForm.startDate}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={couponForm.usageLimit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
                <select
                  name="coupenType"
                  value={couponForm.coupenType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {couponTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Products</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                    onClick={() => setShowProductDropdown(!showProductDropdown)}
                  >
                    <span>
                      {couponForm.productIds.length > 0
                        ? `${couponForm.productIds.length} product(s) selected`
                        : "Select products (optional)"}
                    </span>
                    <FaChevronDown className={`transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {showProductDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          placeholder="Search products..."
                          className="w-full px-3 py-1 border border-gray-300 rounded"
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="py-1">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <div
                              key={product.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => toggleProductSelection(product.id)}
                            >
                              <div className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${couponForm.productIds.includes(product.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                {couponForm.productIds.includes(product.id) && <FaCheck className="text-white text-xs" />}
                              </div>
                              <span className="flex-1">{(product.name || product.Name || "Unknown Product")} (ID: {product.id})</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No products found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Display selected product IDs */}
                {couponForm.productIds.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Selected Product IDs:</p>
                    <div className="bg-gray-100 p-2 rounded text-sm">
                      {couponForm.productIds.join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={couponForm.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Coupon Form */}
      {editingCoupon && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Coupon</h3>
            <button
              onClick={() => setEditingCoupon(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleEditCoupon(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  value={editingCoupon.code || ""}
                  onChange={(e) => setEditingCoupon({
                    ...editingCoupon,
                    code: e.target.value.toUpperCase().trim()
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  name="description"
                  value={editingCoupon.description}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                <select
                  name="discountType"
                  value={editingCoupon.discountType}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                  {editingCoupon.discountType === "PERCENTAGE" ? " (%)" : " (₹)"}
                </label>
                <div className="relative">
                  {editingCoupon.discountType === "PERCENTAGE" ? (
                    <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  ) : (
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    type="number"
                    name="discountValue"
                    value={editingCoupon.discountValue}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step={editingCoupon.discountType === "PERCENTAGE" ? "1" : "0.01"}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={editingCoupon.minOrderAmount}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              {editingCoupon.discountType === "PERCENTAGE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount (₹)</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={editingCoupon.maxDiscountAmount || ""}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscountAmount: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={editingCoupon.startDate.split('T')[0]}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={editingCoupon.endDate.split('T')[0]}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, endDate: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={editingCoupon.startDate.split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={editingCoupon.usageLimit}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
                <select
                  name="coupenType"
                  value={editingCoupon.coupenType}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, coupenType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {couponTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Products</label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                    onClick={() => setShowEditProductDropdown(!showEditProductDropdown)}
                  >
                    <span>
                      {editingCoupon.productIds.length > 0
                        ? `${editingCoupon.productIds.length} product(s) selected`
                        : "Select products (optional)"}
                    </span>
                    <FaChevronDown className={`transition-transform ${showEditProductDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {showEditProductDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          placeholder="Search products..."
                          className="w-full px-3 py-1 border border-gray-300 rounded"
                          value={editProductSearchTerm}
                          onChange={(e) => setEditProductSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="py-1">
                        {filteredEditProducts.length > 0 ? (
    filteredEditProducts.map(product => (
      <div
        key={product.id}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        onClick={() => toggleEditProductSelection(product.id)}
      >
        <div className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${editingCoupon.productIds.includes(product.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
          {editingCoupon.productIds.includes(product.id) && <FaCheck className="text-white text-xs" />}
        </div>
        <span className="flex-1">{(product.name || product.Name || "Unknown Product")} (ID: {product.id})</span>
      </div>
    ))
  ) : (
                          <div className="px-4 py-2 text-gray-500">No products found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Display selected product IDs */}
                {editingCoupon.productIds.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Selected Product IDs:</p>
                    <div className="bg-gray-100 p-2 rounded text-sm">
                      {editingCoupon.productIds.join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="editIsActive"
                  checked={editingCoupon.isActive}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No coupons found</p>
          <p className="text-gray-400 mt-2">
            {coupons.length === 0
              ? "You haven't created any coupons yet."
              : "Try adjusting your search or filters."}
          </p>
          {coupons.length === 0 && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Coupon
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className={isCouponExpired(coupon.endDate) ? "bg-red-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{coupon.code}</div>
                    <div className="text-sm text-gray-500">{coupon.coupenType.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{coupon.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </div>
                    {coupon.minOrderAmount > 0 && (
                      <div className="text-xs text-gray-500">
                        Min order: ₹{coupon.minOrderAmount}
                      </div>
                    )}
                    {coupon.maxDiscountAmount && (
                      <div className="text-xs text-gray-500">
                        Max discount: ₹{coupon.maxDiscountAmount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(calculateUsagePercentage(coupon), 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(coupon.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {new Date(coupon.endDate).toLocaleDateString()}
                    </div>
                    {isCouponExpired(coupon.endDate) && (
                      <div className="text-xs text-red-600 font-medium mt-1">Expired</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={`p-1 rounded ${coupon.isActive
                          ? "text-yellow-600 hover:bg-yellow-100"
                          : "text-green-600 hover:bg-green-100"
                          }`}
                        title={coupon.isActive ? "Deactivate" : "Activate"}
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => setEditingCoupon(coupon)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(coupon.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full pointer-events-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this coupon? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCoupon(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}

    </div>
  );
};

export default Coupons;