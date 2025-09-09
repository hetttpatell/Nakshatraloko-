// components/RecentOrders.jsx
import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaChevronDown, FaFilter, FaSearch, FaTimes, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const RecentOrders = ({ isMobile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: ""
  });
  
  const ordersData = [
    { id: "#1234", customer: "John Doe", status: "Pending", amount: 120, date: "2023-04-15" },
    { id: "#1235", customer: "Jane Smith", status: "Completed", amount: 250, date: "2023-04-14" },
    { id: "#1236", customer: "Robert Johnson", status: "Processing", amount: 340, date: "2023-04-14" },
    { id: "#1237", customer: "Sarah Williams", status: "Pending", amount: 85, date: "2023-04-13" },
    { id: "#1238", customer: "Michael Brown", status: "Completed", amount: 420, date: "2023-04-12" },
    { id: "#1239", customer: "Emily Davis", status: "Cancelled", amount: 210, date: "2023-04-11" },
    { id: "#1240", customer: "David Wilson", status: "Completed", amount: 150, date: "2023-04-10" },
    { id: "#1241", customer: "Jennifer Lopez", status: "Processing", amount: 320, date: "2023-04-09" },
    { id: "#1242", customer: "Chris Evans", status: "Pending", amount: 180, date: "2023-04-08" },
    { id: "#1243", customer: "Emma Watson", status: "Completed", amount: 275, date: "2023-04-07" },
  ];
  
  const statusOptions = ["all", "Pending", "Completed", "Processing", "Cancelled"];
  const ordersPerPage = isMobile ? 3 : 5;
  
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Processing: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  
  // Apply filters whenever filters state changes
  useEffect(() => {
    let result = [...ordersData];
    
    // Filter by status
    if (filters.status !== "all") {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(order => 
        order.customer.toLowerCase().includes(searchTerm) || 
        order.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by amount range
    if (filters.minAmount) {
      result = result.filter(order => order.amount >= Number(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      result = result.filter(order => order.amount <= Number(filters.maxAmount));
    }
    
    // Filter by date range
    if (filters.startDate) {
      result = result.filter(order => new Date(order.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      // Set end date to end of day for inclusive filtering
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.date) <= endOfDay);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      status: "all",
      search: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: ""
    });
  };
  
  const formatCurrency = (amount) => {
    return `$${amount}`;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-48">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          
          {/* Filter toggle button */}
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full sm:w-auto"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="text-sm" />
            <span>Filter</span>
            <FaChevronDown className={`text-xs transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {isFilterOpen && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Amount range filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                placeholder="Min $"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                placeholder="Max $"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
              />
            </div>
            
            {/* Date range filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
                <span className="self-center hidden sm:inline">to</span>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
          
          {/* Clear filters button */}
          <div className="mt-3 flex justify-end">
            <button
              className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              onClick={clearFilters}
            >
              <FaTimes />
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-3 font-semibold text-gray-600 text-sm">Order ID</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Customer</th>
              {!isMobile && <th className="p-3 font-semibold text-gray-600 text-sm">Date</th>}
              <th className="p-3 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Amount</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-sm">{order.id}</td>
                  <td className="p-3 text-sm">{order.customer}</td>
                  {!isMobile && <td className="p-3 text-sm">{formatDate(order.date)}</td>}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-sm">{formatCurrency(order.amount)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        className="p-1 md:p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="View order"
                      >
                        <FaEye className="text-sm md:text-base" />
                      </button>
                      <button 
                        className="p-1 md:p-2 text-green-500 hover:bg-green-50 rounded transition-colors"
                        title="Edit order"
                      >
                        <FaEdit className="text-sm md:text-base" />
                      </button>
                      <button 
                        className="p-1 md:p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete order"
                      >
                        <FaTrash className="text-sm md:text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isMobile ? 5 : 6} className="p-4 text-center text-gray-500">
                  No orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
              aria-label="Previous page"
            >
              <FaAngleLeft />
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              // Show limited page numbers on mobile
              if (isMobile && (i + 1 < currentPage - 1 || i + 1 > currentPage + 1)) {
                if (i === 0 || i === totalPages - 1) {
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
                    >
                      {i + 1}
                    </button>
                  );
                }
                if (i === currentPage - 2 || i === currentPage + 2) {
                  return <span key={i} className="px-1 self-center">...</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
                >
                  {i + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
              aria-label="Next page"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;