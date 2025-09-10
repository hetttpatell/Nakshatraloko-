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
  FaSync
} from "react-icons/fa";

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

  const [newCoupon, setNewCoupon] = useState({
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

  // Available categories for coupon applicability
  const categories = ["all", "Kavach", "Rudraksh", "Gemstone", "Pendants", "Bracelets"];
  const couponTypes = ["GENERAL", "NEW_USER", "SPECIAL_OFFER", "SEASONAL"];

  // Fetch coupons from API


  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8001/api/getAllCoupons");

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has the expected structure
      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error("Invalid response format from server");
      }

      // Map the API response to match your component's expected format
      const fetchedCoupons = response.data.data.map(coupon => ({
        id: coupon.ID,
        code: coupon.Code,
        description: coupon.Description,
        discountType: coupon.DiscountType,
        discountValue: parseFloat(coupon.DiscountValue),
        minOrderAmount: parseFloat(coupon.Min_Order_Amount),
        maxDiscountAmount: coupon.Max_Discount_Amount ? parseFloat(coupon.Max_Discount_Amount) : null,
        startDate: coupon.StartDate,
        endDate: coupon.EndDate,
        usageLimit: coupon.Usage_Limit,
        usedCount: coupon.totalcount ? parseInt(coupon.totalcount) : 0, // Using totalcount as used count
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


  useEffect(() => {
    console.log("Component mounted, fetching coupons...");
    fetchCoupons();
  }, []);

  // And after setting coupons:
  console.log("Coupons set:", coupons.length, "items");

  const handleSaveCoupon = async (couponData) => {
    try {
      // Convert to backend expected format (uppercase field names)
      const backendCoupon = {
        ID: couponData.id || 0, // 0 for new coupons
        Code: couponData.code,
        Description: couponData.description,
        DiscountType: couponData.discountType,
        DiscountValue: couponData.discountValue.toString(),
        StartDate: new Date(couponData.startDate).toISOString(),
        EndDate: new Date(couponData.endDate).toISOString(),
        CoupenType: couponData.coupenType,
        Usage_Limit: couponData.usageLimit,
        Min_Order_Amount: couponData.minOrderAmount.toString(),
        Max_Discount_Amount: couponData.maxDiscountAmount ? couponData.maxDiscountAmount.toString() : null,
        IsActive: couponData.isActive,
        productids: couponData.productIds || []
      };

      console.log("Sending coupon data:", backendCoupon);

      const response = await axios.post("http://localhost:8001/api/saveCoupon", backendCoupon);

      if (response.status === 200) {
        // Refresh the coupons list after saving
        fetchCoupons();
        return true;
      }
    } catch (err) {
      console.error("Error saving coupon:", err);
      setError("Failed to save coupon. Please try again.");
      return false;
    }
  };

  // Filter coupons based on search and filters
  const filteredCoupons = coupons.filter(coupon => {
    // Search filter
    if (searchTerm &&
      !coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !coupon.description.toLowerCase().includes(searchTerm.toLowerCase())) {
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
    setNewCoupon({ ...newCoupon, code });
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.description || !newCoupon.discountValue || !newCoupon.endDate) {
      setError("Please fill all required fields");
      return;
    }

    try {
      // Format dates properly for API
      const couponToAdd = {
        ...newCoupon,
        id: 0, // Let the backend generate the ID
        startDate: new Date(newCoupon.startDate).toISOString(),
        endDate: new Date(newCoupon.endDate).toISOString(),
        maxDiscountAmount: newCoupon.maxDiscountAmount || null,
        // Convert applicableCategories to productIds if needed
        // This mapping depends on your backend implementation
        productIds: newCoupon.applicableCategories.filter(cat => cat !== "all").map(cat => {
          // This is a placeholder - you'll need to map category names to product IDs
          return 1; // Example product ID
        })
      };

      // Remove the applicableCategories field as it's not in the API model
      delete couponToAdd.applicableCategories;

      const success = await handleSaveCoupon(couponToAdd);

      if (success) {
        setNewCoupon({
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
          productIds: [],
          applicableCategories: ["all"]
        });
        setIsAdding(false);
      }
    } catch (err) {
      console.error("Error adding coupon:", err);
      setError("Failed to add coupon. Please try again.");
    }
  };

  const handleEditCoupon = async () => {
    if (!editingCoupon.code || !editingCoupon.description || !editingCoupon.discountValue || !editingCoupon.endDate) {
      setError("Please fill all required fields");
      return;
    }

    try {
      // Format dates properly for API - keep as is for the API call
      const couponToUpdate = {
        ...editingCoupon,
        maxDiscountAmount: editingCoupon.maxDiscountAmount || null,
        productIds: editingCoupon.productIds || [] // Ensure productIds is always an array
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
      const response = await axios.post("http://localhost:8001/api/deleteCoupon", { ID: id });
      if (response.status === 200) {
        // Refresh the coupons list after deletion
        fetchCoupons();
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
      setError("Failed to delete coupon. Please try again.");
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
      usedCount: 0
    };
    setNewCoupon({
      ...duplicatedCoupon,
      startDate: new Date().toISOString().split('T')[0],
      applicableCategories: coupon.productIds && coupon.productIds.length > 0 ?
        ["specific"] : ["all"]
    });
    setIsAdding(true);
  };

  const calculateUsagePercentage = (coupon) => {
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  const isCouponExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coupon code"
                  maxLength="20"
                />
                <button
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
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
              <select
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value *
                {newCoupon.discountType === "PERCENTAGE" ? " (%)" : " (₹)"}
              </label>
              <div className="relative">
                {newCoupon.discountType === "PERCENTAGE" ? (
                  <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                ) : (
                  <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                )}
                <input
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step={newCoupon.discountType === "PERCENTAGE" ? "1" : "10"}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: parseFloat(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount (₹)</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={newCoupon.maxDiscountAmount || ""}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="50"
                  placeholder="No limit"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
              <select
                value={newCoupon.coupenType}
                onChange={(e) => setNewCoupon({ ...newCoupon, coupenType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {couponTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={newCoupon.startDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={newCoupon.endDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
              <input
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Categories</label>
              <select
                multiple
                value={newCoupon.applicableCategories}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setNewCoupon({ ...newCoupon, applicableCategories: selectedOptions });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newCoupon.isActive}
                onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddCoupon}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Create Coupon
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Code</th>
              <th className="p-3 font-semibold text-gray-700">Description</th>
              <th className="p-3 font-semibold text-gray-700">Discount</th>
              <th className="p-3 font-semibold text-gray-700">Validity</th>
              <th className="p-3 font-semibold text-gray-700">Usage</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
              <th className="p-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map(coupon => {
              const isExpired = isCouponExpired(coupon.endDate);
              const usagePercentage = calculateUsagePercentage(coupon);
              const isUsedUp = coupon.usedCount >= coupon.usageLimit;

              return (
                <tr key={coupon.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="font-mono font-bold text-blue-600">{coupon.code}</div>
                    <div className="text-xs text-gray-500">{coupon.coupenType?.replace('_', ' ')}</div>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{coupon.description}</p>
                    <p className="text-xs text-gray-500">
                      Min order: ₹{coupon.minOrderAmount}
                      {coupon.maxDiscountAmount && ` • Max discount: ₹${coupon.maxDiscountAmount}`}
                    </p>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-green-600">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`
                      }
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div>{new Date(coupon.startDate).toLocaleDateString()}</div>
                      <div className={isExpired ? "text-red-500" : "text-gray-500"}>
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full ${usagePercentage >= 90 ? "bg-red-500" :
                          usagePercentage >= 70 ? "bg-yellow-500" : "bg-green-500"
                          }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${!coupon.isActive ? "bg-gray-100 text-gray-800" :
                      isExpired ? "bg-red-100 text-red-800" :
                        isUsedUp ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                      }`}>
                      {!coupon.isActive ? "Inactive" :
                        isExpired ? "Expired" :
                          isUsedUp ? "Used Up" : "Active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => duplicateCoupon(coupon)}
                        className="p-2 text-purple-500 hover:bg-purple-50 rounded transition-colors"
                        title="Duplicate coupon"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={`p-2 rounded transition-colors ${coupon.isActive
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                      >
                        {coupon.isActive ? 'On' : 'Off'}
                      </button>
                      <button
                        onClick={() => setEditingCoupon({ ...coupon })}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Edit coupon"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(coupon)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete coupon"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCoupons.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== "all" || typeFilter !== "all"
            ? "No coupons match your search criteria."
            : coupons.length === 0
              ? "No coupons found in the system. Create your first coupon to get started."
              : "No coupons available after filtering."}
          <div className="mt-2 text-xs">
            Total coupons: {coupons.length} | Filtered: {filteredCoupons.length}
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Coupon</h3>
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={editingCoupon.code}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={editingCoupon.description}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <select
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
                      value={editingCoupon.discountValue}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={editingCoupon.minOrderAmount}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderAmount: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Amount (₹)</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={editingCoupon.maxDiscountAmount || ""}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="No limit"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
                  <select
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={new Date(editingCoupon.startDate).toISOString().split('T')[0]}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={new Date(editingCoupon.endDate).toISOString().split('T')[0]}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, endDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
                  <input
                    type="number"
                    value={editingCoupon.usageLimit}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isActive}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product IDs</label>
                <input
                  type="text"
                  value={editingCoupon.productIds ? editingCoupon.productIds.join(', ') : ''}
                  onChange={(e) => setEditingCoupon({
                    ...editingCoupon,
                    productIds: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product IDs separated by commas (e.g., 1, 2, 3)"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the coupon <strong>{deleteConfirm.code}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCoupon(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;