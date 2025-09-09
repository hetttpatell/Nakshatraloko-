// components/OrdersManagement.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaChevronDown, FaTimes, FaExclamationTriangle, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const OrdersManagement = ({ isMobile }) => {
  const [orders, setOrders] = useState([
    {
      id: "#ORD-1001",
      customer: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8901",
      date: "2023-04-15",
      status: "Pending",
      amount: 900,
      items: [
        { productId: 1, name: "Stellar Dainty Diamond Hoop", quantity: 1, price: 900 }
      ],
      shippingAddress: "123 Main St, New York, NY 10001"
    },
    {
      id: "#ORD-1002",
      customer: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 345-678-9012",
      date: "2023-04-14",
      status: "Completed",
      amount: 2400,
      items: [
        { productId: 2, name: "Another Product Name", quantity: 2, price: 1200 }
      ],
      shippingAddress: "456 Oak Ave, Los Angeles, CA 90001"
    },
    {
      id: "#ORD-1003",
      customer: "Robert Johnson",
      email: "robert@example.com",
      phone: "+1 456-789-0123",
      date: "2023-04-14",
      status: "Processing",
      amount: 1200,
      items: [
        { productId: 3, name: "Another Product Name id-3", quantity: 1, price: 1200 }
      ],
      shippingAddress: "789 Pine Rd, Chicago, IL 60007"
    },
    {
      id: "#ORD-1004",
      customer: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1 567-890-1234",
      date: "2023-04-13",
      status: "Pending",
      amount: 1200,
      items: [
        { productId: 4, name: "Another Product Name id-4", quantity: 2, price: 1200 },
        { productId: 2, name: "Another Product Name id-4", quantity: 1, price: 1200 },
        { productId: 1, name: "Another Product Name id-4", quantity: 1, price: 1200 }
      ],
      shippingAddress: "321 Elm St, Houston, TX 77001"
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, orderId: null, orderCode: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = isMobile ? 3 : 5;

  // Filter orders based on search term and status
  useEffect(() => {
    let result = orders;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, orders]);

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Processing: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const statusOptions = ["all", "Pending", "Completed", "Processing", "Cancelled"];

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleDeleteOrder = () => {
    if (deleteConfirmModal.orderId) {
      setOrders(prev => prev.filter(order => order.id !== deleteConfirmModal.orderId));
      setDeleteConfirmModal({ isOpen: false, orderId: null, orderCode: "" });
    }
  };

  const openDeleteConfirm = (orderId, orderCode) => {
    setDeleteConfirmModal({ isOpen: true, orderId, orderCode });
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
    setIsEditModalOpen(true);
  };

  const handleSaveOrder = () => {
    if (editingOrder) {
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id ? editingOrder : order
      ));
      setIsEditModalOpen(false);
      setEditingOrder(null);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <FaPlus />
          <span>Add New Order</span>
        </button>
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
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
          </div>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="text-sm" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-3 font-semibold text-gray-600 text-sm">Order ID</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Customer</th>
              {!isMobile && <th className="p-3 font-semibold text-gray-600 text-sm">Date</th>}
              <th className="p-3 font-semibold text-gray-600 text-sm">Items</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Amount</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Status</th>
              <th className="p-3 font-semibold text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium text-sm">{order.id}</td>
                <td className="p-3">
                  <div>
                    <p className="font-medium text-sm">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </td>
                {!isMobile && <td className="p-3 text-sm">{new Date(order.date).toLocaleDateString()}</td>}
                <td className="p-3">
                  <div className="text-xs">
                    {order.items.slice(0, isMobile ? 1 : 3).map((item, i) => (
                      <div key={i} className="mb-1">
                        {item.quantity} × {item.name}
                      </div>
                    ))}
                    {order.items.length > (isMobile ? 1 : 3) && (
                      <div className="text-blue-500">+{order.items.length - (isMobile ? 1 : 3)} more</div>
                    )}
                  </div>
                </td>
                <td className="p-3 font-medium text-sm">${order.amount}</td>
                <td className="p-3">
                  <select
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]} border-none focus:ring-2 focus:ring-blue-500`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button 
                      className="p-1 md:p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      onClick={() => viewOrderDetails(order)}
                      title="View details"
                    >
                      <FaEye className="text-sm md:text-base" />
                    </button>
                    <button 
                      className="p-1 md:p-2 text-green-500 hover:bg-green-50 rounded transition-colors"
                      onClick={() => handleEditOrder(order)}
                      title="Edit order"
                    >
                      <FaEdit className="text-sm md:text-base" />
                    </button>
                    <button 
                      className="p-1 md:p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      onClick={() => openDeleteConfirm(order.id, order.id)}
                      title="Delete order"
                    >
                      <FaTrash className="text-sm md:text-base" />
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
              
              <div className="flex justify-center gap-3">
                <button
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setDeleteConfirmModal({ isOpen: false, orderId: null, orderCode: "" })}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setSelectedOrder(null)}
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Order ID:</span> {selectedOrder.id}</p>
                    <p><span className="text-gray-600">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                    <p className="flex items-center">
                      <span className="text-gray-600 mr-2">Status:</span> 
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selectedOrder.status]}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p><span className="text-gray-600">Total Amount:</span> ${selectedOrder.amount}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.customer}</p>
                    <p>{selectedOrder.email}</p>
                    <p>{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                <p className="text-sm">{selectedOrder.shippingAddress}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  {selectedOrder.items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={index} className="p-4 border-b last:border-b-0 flex items-center">
                        {product && (
                          <img 
                            src={product.mainImage} 
                            alt={product.name} 
                            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded mr-3 md:mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-xs text-gray-600">Price: ${item.price}</p>
                        </div>
                        <div className="font-medium text-sm">${item.quantity * item.price}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Order</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.customer}
                    onChange={(e) => setEditingOrder({...editingOrder, customer: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.email}
                    onChange={(e) => setEditingOrder({...editingOrder, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.shippingAddress}
                    onChange={(e) => setEditingOrder({...editingOrder, shippingAddress: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={handleSaveOrder}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Products data (should be imported from a separate file in a real application)
const products = [
  {
    id: 1,
    name: "Stellar Dainty Diamond Hoop id-1",
    brand: "STYLIUM",
    rating: 4.5,
    reviews: 22,
    price: 900,
    inStock: true,
    mainImage: "/s3.jpeg",
    size: ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"],
    material: ["Gemstone", "Pendant", "Necklace"],
    images: [
      { src: "/s1.jpeg", alt: "Product Image 1" },
      { src: "/s2.jpeg", alt: "Product Image 2" },
      { src: "/s3.jpeg", alt: "Product Image 3" },
    ],
    description: "Cool off this summer in the Mini Ruffle Smocked Tank Top from our very own LA Hearts. This tank features a smocked body, adjustable straps, scoop neckline, ruffled hems, and a cropped fit.",
    advantages: ["Smocked body", "Adjustable straps", "Scoop neckline", "Ruffled hems", "Cropped length", "Model is wearing a small", "100% rayon", "Machine washable"],
    shipping: "We offer Free Standard Shipping for all orders over $75 to the 50 states and the District of Columbia...",
    reviewList: [
      { user: "Het Patel", comment: "Amazing quality! Worth the price.", rating: 5 },
      { user: "Priya Shah", comment: "Looks good but delivery was late.", rating: 4 },
    ],
  },
  {
    id: 2,
    name: "Another Product Name id-2",
    brand: "PEARLIX",
    rating: 3.8,
    reviews: 12,
    price: 1200,
    inStock: true,
    mainImage: "/s2.jpeg",
    size: ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"],
    material: ["Silver", "Gold", "Copper"],
    images: [
      { src: "/s3.jpeg", alt: "Product Image 1" },
      { src: "/s2.jpeg", alt: "Product Image 2" },
    ],
    description: "This is another product description.",
    advantages: ["Feature 1", "Feature 2", "Feature 3"],
    shipping: "Shipping info for product 2",
    reviewList: [
      { user: "Rahul Kumar", comment: "Good product overall.", rating: 4 },
    ],
  },
  {
    id: 3,
    name: "Another Product Name id-3",
    brand: "PEARLIX",
    rating: 3.8,
    reviews: 12,
    price: 1200,
    inStock: true,
    mainImage: "/s4.jpeg",
    size: ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"],
    material: ["Silver", "Gold", "Copper"],
    images: [
      { src: "/s3.jpeg", alt: "Product Image 1" },
      { src: "/s2.jpeg", alt: "Product Image 2" },
    ],
    description: "This is another product description.",
    advantages: ["Feature 1", "Feature 2", "Feature 3"],
    shipping: "Shipping info for product 2",
    reviewList: [
      { user: "Rahul Kumar", comment: "Good product overall.", rating: 4 },
    ],
  },
  {
    id: 4,
    name: "Another Product Name id-4",
    brand: "PEARLIX",
    rating: 3.8,
    reviews: 12,
    price: 1200,
    inStock: true,
    mainImage: "/s1.jpeg",
    size: ["5 Ratti", "5.25 Ratti", "6 Ratti", "6.5 Ratti", "7 Ratti", "7.5 Ratti", "8 Ratti", "8.5 Ratti"],
    material: ["Silver", "Gold", "Copper"],
    images: [
      { src: "/s3.jpeg", alt: "Product Image 1" },
      { src: "/s2.jpeg", alt: "Product Image 2" },
    ],
    description: "This is another product description.",
    advantages: ["Feature 1", "Feature 2", "Feature 3"],
    shipping: "Shipping info for product 2",
    reviewList: [
      { user: "Rahul Kumar", comment: "Good product overall.", rating: 4 },
    ],
  },
];

export default OrdersManagement;