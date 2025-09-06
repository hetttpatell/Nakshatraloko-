// components/Coupons.jsx
import React, { useState } from "react";
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
  FaHashtag
} from "react-icons/fa";

const Coupons = () => {
  // Sample initial coupons data
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "WELCOME20",
      description: "Welcome discount for new customers",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 500,
      maxDiscountAmount: 1000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: 1000,
      usedCount: 245,
      isActive: true,
      isSingleUse: false,
      applicableCategories: ["all"]
    },
    {
      id: 2,
      code: "FREESHIP",
      description: "Free shipping on orders above ₹999",
      discountType: "fixed",
      discountValue: 50,
      minOrderAmount: 999,
      maxDiscountAmount: 50,
      startDate: "2024-02-01",
      endDate: "2024-06-30",
      usageLimit: 500,
      usedCount: 189,
      isActive: true,
      isSingleUse: true,
      applicableCategories: ["all"]
    },
    {
      id: 3,
      code: "SUMMER25",
      description: "Summer special discount",
      discountType: "percentage",
      discountValue: 25,
      minOrderAmount: 1000,
      maxDiscountAmount: 500,
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      usageLimit: 200,
      usedCount: 200,
      isActive: false,
      isSingleUse: false,
      applicableCategories: ["Kavach", "Rudraksh"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    usageLimit: 100,
    isActive: true,
    isSingleUse: false,
    applicableCategories: ["all"]
  });

  // Available categories for coupon applicability
  const categories = ["all", "Kavach", "Rudraksh", "Gemstone", "Pendants", "Bracelets"];

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
    setNewCoupon({...newCoupon, code});
  };

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.description || !newCoupon.discountValue) return;
    
    const couponToAdd = {
      ...newCoupon,
      id: Date.now(),
      usedCount: 0,
      maxDiscountAmount: newCoupon.maxDiscountAmount || null
    };
    
    setCoupons([...coupons, couponToAdd]);
    setNewCoupon({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: null,
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      usageLimit: 100,
      isActive: true,
      isSingleUse: false,
      applicableCategories: ["all"]
    });
    setIsAdding(false);
  };

  const handleEditCoupon = () => {
    if (!editingCoupon.code || !editingCoupon.description || !editingCoupon.discountValue) return;
    
    setCoupons(coupons.map(coupon => 
      coupon.id === editingCoupon.id ? editingCoupon : coupon
    ));
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(coupon => coupon.id !== id));
    setDeleteConfirm(null);
  };

  const toggleCouponStatus = (id) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const duplicateCoupon = (coupon) => {
    const duplicatedCoupon = {
      ...coupon,
      id: Date.now(),
      code: coupon.code + "_COPY",
      usedCount: 0
    };
    setCoupons([...coupons, duplicatedCoupon]);
  };

  const calculateUsagePercentage = (coupon) => {
    return (coupon.usedCount / coupon.usageLimit) * 100;
  };

  const isCouponExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Create Coupon
        </button>
      </div>

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
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
      </div>

      {/* Add Coupon Form */}
      {isAdding && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Coupon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
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
                onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter coupon description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
              <select
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value * 
                {newCoupon.discountType === "percentage" ? " (%)" : " (₹)"}
              </label>
              <div className="relative">
                {newCoupon.discountType === "percentage" ? (
                  <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                ) : (
                  <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                )}
                <input
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({...newCoupon, discountValue: parseFloat(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step={newCoupon.discountType === "percentage" ? "1" : "10"}
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
                  onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: parseFloat(e.target.value)})}
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
                  onChange={(e) => setNewCoupon({...newCoupon, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="50"
                  placeholder="No limit"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={newCoupon.startDate}
                  onChange={(e) => setNewCoupon({...newCoupon, startDate: e.target.value})}
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
                  onChange={(e) => setNewCoupon({...newCoupon, endDate: e.target.value})}
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
                onChange={(e) => setNewCoupon({...newCoupon, usageLimit: parseInt(e.target.value)})}
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
                  setNewCoupon({...newCoupon, applicableCategories: selectedOptions});
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
                onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newCoupon.isSingleUse}
                onChange={(e) => setNewCoupon({...newCoupon, isSingleUse: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Single Use Per Customer</span>
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
                  </td>
                  <td className="p-3">
                    <p className="text-gray-800">{coupon.description}</p>
                    <p className="text-xs text-gray-500">
                      Min order: ₹{coupon.minOrderAmount}
                      {coupon.applicableCategories[0] === "all" 
                        ? " • All categories" 
                        : ` • ${coupon.applicableCategories.length} categories`
                      }
                    </p>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-green-600">
                      {coupon.discountType === "percentage" 
                        ? `${coupon.discountValue}%` 
                        : `₹${coupon.discountValue}`
                      }
                    </span>
                    {coupon.maxDiscountAmount && coupon.discountType === "percentage" && (
                      <p className="text-xs text-gray-500">Max ₹{coupon.maxDiscountAmount}</p>
                    )}
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
                        className={`h-2 rounded-full ${
                          usagePercentage >= 90 ? "bg-red-500" : 
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      !coupon.isActive ? "bg-gray-100 text-gray-800" :
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
                        className={`p-2 rounded transition-colors ${
                          coupon.isActive 
                            ? 'text-green-500 hover:bg-green-50' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        title={coupon.isActive ? 'Deactivate coupon' : 'Activate coupon'}
                      >
                        {coupon.isActive ? 'On' : 'Off'}
                      </button>
                      <button
                        onClick={() => setEditingCoupon({...coupon})}
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

      {filteredCoupons.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
            ? "No coupons match your search criteria." 
            : "No coupons found. Create your first coupon to get started."}
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
<div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 border border-gray-300 rounded-lg">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Edit Coupon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={editingCoupon.code}
                    onChange={(e) => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={editingCoupon.description}
                    onChange={(e) => setEditingCoupon({...editingCoupon, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <select
                    value={editingCoupon.discountType}
                    onChange={(e) => setEditingCoupon({...editingCoupon, discountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value * 
                    {editingCoupon.discountType === "percentage" ? " (%)" : " (₹)"}
                  </label>
                  <div className="relative">
                    {editingCoupon.discountType === "percentage" ? (
                      <FaPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    ) : (
                      <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )}
                    <input
                      type="number"
                      value={editingCoupon.discountValue}
                      onChange={(e) => setEditingCoupon({...editingCoupon, discountValue: parseFloat(e.target.value)})}
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
                      onChange={(e) => setEditingCoupon({...editingCoupon, minOrderAmount: parseFloat(e.target.value)})}
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
                      onChange={(e) => setEditingCoupon({...editingCoupon, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      placeholder="No limit"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={editingCoupon.startDate}
                      onChange={(e) => setEditingCoupon({...editingCoupon, startDate: e.target.value})}
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
                      value={editingCoupon.endDate}
                      onChange={(e) => setEditingCoupon({...editingCoupon, endDate: e.target.value})}
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
                    onChange={(e) => setEditingCoupon({...editingCoupon, usageLimit: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Categories</label>
                  <select
                    multiple
                    value={editingCoupon.applicableCategories}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setEditingCoupon({...editingCoupon, applicableCategories: selectedOptions});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isActive}
                    onChange={(e) => setEditingCoupon({...editingCoupon, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingCoupon.isSingleUse}
                    onChange={(e) => setEditingCoupon({...editingCoupon, isSingleUse: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Single Use Per Customer</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the coupon "{deleteConfirm.code}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
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
        </div>
      )}
    </div>
  );
};

export default Coupons;