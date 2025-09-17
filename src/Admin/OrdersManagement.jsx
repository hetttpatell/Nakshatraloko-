// components/OrdersManagement.jsx
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaChevronDown, FaTimes, FaExclamationTriangle, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const OrdersManagement = ({ isMobile }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, orderId: null, orderCode: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ordersPerPage = isMobile ? 5 : 10;
  const [saveOrder, setsaveOrder] = useState([]);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Processing: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  // Filter dropdown ref for closing when clicking outside
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //List all oders 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        const res = await axios.post(
          "http://localhost:8001/api/listAllOrders",
          {},
          {
            headers: { Authorization: token || "" },
          }
        );

        const ordersArray = Array.isArray(res.data.data) ? res.data.data.map(order => ({
          ...order,
          items: order.ProductID ? [{
            ProductID: order.ProductID,
            ProductName: order.ProductName,
            Quantity: order.Quantity || 1,
          }] : [] // empty array if no product
        })) : [];

        setOrders(ordersArray);
        setFilteredOrders(ordersArray);

      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        (order.OrderID?.toString().toLowerCase().includes(term)) ||
        (order.UserFullName?.toLowerCase().includes(term)) ||
        (order.UserEmail?.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(order => order.OrderStatus === statusFilter);
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, orders]);

  //debounce for mobile 
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update local state immediately
      setOrders(prev =>
        prev.map(order =>
          order.OrderID === orderId ? { ...order, OrderStatus: newStatus } : order
        )
      );
      const token = localStorage.getItem('authToken');
      // Call backend API
      const response = await axios.post(
        `http://localhost:8001/api/updateOrderStatus/${orderId}/status`,
        { orderStatus: newStatus }, {
        headers: {
          Authorization: `${token}`
        }
      }
      );

      console.log("Order status updated successfully:", response.data);

    } catch (err) {
      console.error("Failed to update order status:", err);
      // alert("Failed to update order status. Please try again.");
    }
  };

  const handleDeleteOrder = () => {
    if (deleteConfirmModal.orderId) {
      setOrders(prev => prev.filter(order => order.id !== deleteConfirmModal.orderId));
      setDeleteConfirmModal({ isOpen: false, orderId: null, orderCode: "" });
    }
  };

  // const openDeleteConfirm = (orderId, orderCode) => {
  //   setDeleteConfirmModal({ isOpen: true, orderId, orderCode });
  // };

  // const handleEditOrder = (order) => {
  //   setEditingOrder({ ...order });
  //   setIsEditModalOpen(true);
  // };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center py-8 text-gray-600">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders Management</h2>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID, customer, or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="text-gray-500" />
            <span>Filter</span>
            <FaChevronDown className={`text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Order Status</p>
                {['all', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => (
                  <label key={status} className="flex items-center px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                    <input
                      type="radio"
                      name="statusFilter"
                      value={status}
                      checked={statusFilter === status}
                      onChange={() => setStatusFilter(status)}
                      className="mr-2"
                    />
                    <span className="text-sm">{status === 'all' ? 'All Statuses' : status}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 font-semibold text-gray-600 text-sm">Customer</th>
              {!isMobile && <th className="p-3 font-semibold text-gray-600 text-sm">Date</th>}
              <th className="p-3 font-semibold text-gray-600 text-sm">Items</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Amount</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {/* Customer */}
                <td className="p-3">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{order.UserFullName}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{order.UserEmail}</p>
                  </div>
                </td>

                {/* Date */}
                {!isMobile && (
                  <td className="p-3 text-sm text-gray-700">
                    {new Date(order.OrderDate).toLocaleDateString()}
                  </td>
                )}

                {/* Items */}
                <td className="p-3">
                  <div className="text-xs text-gray-700">
                    {order.items.slice(0, isMobile ? 1 : 3).map((item, i) => (
                      <div key={i} className="mb-1">
                        {item.Quantity} × {item.ProductName}
                      </div>
                    ))}

                    {order.items.length > (isMobile ? 1 : 3) && (
                      <div className="text-blue-500 text-xs">
                        +{order.items.length - (isMobile ? 1 : 3)} more
                      </div>
                    )}
                  </div>
                </td>

                {/* Amount */}
                <td className="p-3 font-medium text-sm text-gray-900">₹{order.NetAmount}</td>

                {/* Status */}
                <td className="p-3">
                  <div className="relative w-25">
                    <select
                      className={`
                            w-full 
                            px-3 py-2 
                            rounded-full 
                            text-sm md:text-xs 
                            font-medium 
                            ${statusStyles[order.OrderStatus]} 
                            border-none 
                            focus:outline-none 
                            focus:ring-2 focus:ring-blue-500 
                            appearance-none 
                            cursor-pointer 
                            transition-all duration-200
                            md:px-2 md:py-1
                            hover:opacity-90
                          `}
                      value={order.OrderStatus}
                      onChange={(e) => handleStatusChange(order.OrderID, e.target.value)}
                      style={{
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        minHeight: "36px",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Chevron icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <FaChevronDown className="text-gray-500 text-sm md:text-xs" />
                    </div>
                  </div>
                </td>


                {/* Actions */}
                <td className="p-3">
                  <div className="flex gap-1">
                    <button
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      onClick={() => viewOrderDetails(order)}
                      title="View details"
                    >
                      <FaEye className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
              aria-label="Previous page"
            >
              <FaAngleLeft />
            </button>

            {/* Mobile pagination - simplified */}
            {isMobile ? (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                Page {currentPage} of {totalPages}
              </span>
            ) : (
              [...Array(totalPages)].map((_, i) => {
                // Show limited page numbers
                if (i + 1 < currentPage - 1 || i + 1 > currentPage + 1) {
                  if (i === 0 || i === totalPages - 1) {
                    return (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
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
                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
                  >
                    {i + 1}
                  </button>
                );
              })
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 transition-colors'}`}
              aria-label="Next page"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Confirm Deletion
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete order <span className="font-medium">{deleteConfirmModal.orderCode}</span>?
                This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors order-2 sm:order-1"
                  onClick={() => setDeleteConfirmModal({ isOpen: false, orderId: null, orderCode: "" })}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors order-1 sm:order-2 mb-3 sm:mb-0"
                  onClick={handleDeleteOrder}
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Order Details</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${statusStyles[selectedOrder.status]}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.ProductName}</p>
                        <p className="text-sm text-gray-600">Qty: {item.Quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.Price * item.Quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-full md:w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{selectedOrder.amount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{selectedOrder.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;