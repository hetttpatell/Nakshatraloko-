import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Star, Shield, Bell, Moon, Sun, Zap, CreditCard, MapPin, Heart, Smartphone, UserCog, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import axios from "axios";
import { FaMobile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserAccount() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    birthDate: "1990-05-15",
    birthTime: "14:30",
    birthPlace: "New York, USA",
    gender: "male",
    address: "123 Main Street, New York, NY 10001",
    fullNameAtBirth: "John Michael Doe",
    membership: "premium"
  });

  const [activeTab, setActiveTab] = useState("orders"); // Default to orders tab for demo
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();

  // Dummy orders data as a refrece 
  const dummyOrders = [
    {
      _id: "order_001",
      orderId: "ORD-2023-001",
      createdAt: "2023-10-15T10:30:00Z",
      updatedAt: "2023-10-20T14:00:00Z",
      deliveredAt: "2023-10-20T14:00:00Z",
      status: "delivered",
      totalAmount: 2999.99,
      items: [
        {
          productId: "prod_001",
          productName: "Premium Birth Chart Reading",
          quantity: 1,
          price: 1999.99,
          image: "/api/placeholder/48/48"
        },
        {
          productId: "prod_002",
          productName: "Monthly Horoscope Subscription",
          quantity: 3,
          price: 333.33,
          image: "/api/placeholder/48/48"
        }
      ],
      shippingAddress: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      }
    },
    {
      _id: "order_002",
      orderId: "ORD-2024-015",
      createdAt: "2024-01-20T14:45:00Z",
      updatedAt: "2024-01-21T09:15:00Z",
      status: "processing",
      totalAmount: 1599.50,
      items: [
        {
          productId: "prod_003",
          productName: "Relationship Compatibility Report",
          quantity: 1,
          price: 899.50,
          image: "/api/placeholder/48/48"
        },
        {
          productId: "prod_004",
          productName: "Personalized Crystal Set",
          quantity: 2,
          price: 350.00,
          image: "/api/placeholder/48/48"
        }
      ],
      shippingAddress: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      }
    },
    {
      _id: "order_003", // This order can be cancelled
      orderId: "ORD-2024-027",
      createdAt: new Date().toISOString(), // Recent order
      updatedAt: new Date().toISOString(),
      status: "pending",
      totalAmount: 2499.00,
      items: [
        {
          productId: "prod_005",
          productName: "Complete Astrological Profile Package",
          quantity: 1,
          price: 1999.00,
          image: "/api/placeholder/48/48"
        },
        {
          productId: "prod_006",
          productName: "Tarot Reading Session",
          quantity: 1,
          price: 500.00,
          image: "/api/placeholder/48/48"
        }
      ],
      shippingAddress: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      }
    }
  ];

  // ✅ Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.post(
          `${BACKEND_URL}user/profile`,
          {},
          { headers: { Authorization: `${token}` } }
        );

        if (res.data.success && res.data.user) {
          const userData = res.data.user;
          setUser((prev) => ({
            ...prev,
            name: userData.fullname || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            birthDate: userData.BirthDate || prev.birthDate,
            birthTime: userData.BirthTime || prev.birthTime,
            birthPlace: userData.BirthPlace || prev.birthPlace,
            gender: userData.Gender || prev.gender,
            address: userData.Address || prev.address,
            fullNameAtBirth: userData.FullNameAtBirth || prev.fullNameAtBirth,
            membership: userData.role || prev.membership
          }));
        }
      } catch (err) {
        // console.error("Failed to fetch user:", err);
        // Use dummy data if API fails
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch orders when order history tab is active
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${BACKEND_URL}user/orders`,
        {},
        { headers: { Authorization: `${token}` } }
      );

      if (res.data.success && res.data.orders) {
        setOrders(res.data.orders);
      } else {
        // Use dummy data if API fails or returns empty
        setOrders(dummyOrders);
      }
    } catch (err) {
      // console.error("Failed to fetch orders:", err);
      // Use dummy data for demo
      setTimeout(() => {
        setOrders(dummyOrders);
        setLoadingOrders(false);
      }, 1000);
      return;
    }
    setLoadingOrders(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditMode(false);

    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        fullname: user.name,
        email: user.email,
        phone: user.phone,
        BirthDate: user.birthDate,
        BirthPlace: user.birthPlace,
        BirthTime: user.birthTime,
        Gender: user.gender,
        Address: user.address,
        FullNameAtBirth: user.fullNameAtBirth || "",
      };

      const res = await axios.post(
        `${BACKEND_URL}updateUser`,
        payload,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.data.success) {
        // alert("Profile updated successfully!");
      } else {
        // alert(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      // console.error("Failed to update user:", err);
      // alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${BACKEND_URL}user/cancel-order`,
        { orderId },
        { headers: { Authorization: `${token}` } }
      );

      if (res.data.success) {
        // Update local orders state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { 
                ...order, 
                status: 'cancelled',
                updatedAt: new Date().toISOString()
              }
            : order
        ));
        // alert("Order cancelled successfully!");
      } else {
        // alert(res.data.message || "Failed to cancel order");
      }
    } catch (err) {
      // console.error("Failed to cancel order:", err);
      // Simulate cancellation for demo
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { 
              ...order, 
              status: 'cancelled',
              updatedAt: new Date().toISOString()
            }
          : order
      ));
      // alert("Order cancelled successfully! (Demo mode)");
    }
  };

  const handleAdminPanelClick = () => {
    navigate("/admin");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'processing': return <Truck size={16} className="text-blue-500" />;
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[var(--color-text)] mb-2">
            Your Cosmic Profile
          </h1>
          <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
            Manage your account and astrological preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:w-1/4 bg-white rounded-xl shadow-[var(--shadow-sm)] p-6 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
                <User size={40} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="font-bold text-lg text-[var(--color-text)]">{user.name}</h2>
              <div className="inline-flex items-center gap-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full mt-2">
                <Shield size={12} />
                <span className="text-xs font-medium">{user.membership} Member</span>
              </div>
              <div className="mt-4 text-sm text-[var(--color-text-light)]">
                <p>Member since Oct 2022</p>
                <p className="mt-1">{orders.length} orders placed</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "orders", label: "Order History", icon: Package, badge: orders.length },
                // { id: "astrology", label: "Astrological Profile", icon: Star },
                // { id: "notifications", label: "Notifications", icon: Bell },
                // { id: "billing", label: "Billing", icon: CreditCard },
                // { id: "address", label: "Shipping Address", icon: MapPin },
                // { id: "wishlist", label: "Wishlist", icon: Heart },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-text-light)] hover:bg-[var(--color-primary-light)]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[var(--color-primary)] text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Admin Panel Button - Conditionally Rendered */}
              {user.membership === "admin" && (
                <button
                  onClick={handleAdminPanelClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-[var(--color-text-light)] hover:bg-[var(--color-primary-light)]"
                >
                  <UserCog size={18} />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:w-3/4 bg-white rounded-xl shadow-[var(--shadow-sm)] p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-[var(--color-text)]">
                {activeTab === "profile" && "Personal Information"}
                {activeTab === "orders" && `Order History (${orders.length})`}
              </h2>
              {activeTab === "profile" && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              )}
              {activeTab === "orders" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrders([...dummyOrders])}
                    className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm font-medium hover:bg-[var(--color-background)] transition-colors"
                  >
                    Reset Demo
                  </button>
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {activeTab === "profile" && (
              <form onSubmit={handleSubmit}>
                {/* ... (profile form remains exactly the same) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Phone Number</label>
                    <div className="relative">
                      <Smartphone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birth Date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="date"
                        name="birthDate"
                        value={user.birthDate}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Birth Time */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birth Time</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="time"
                        name="birthTime"
                        value={user.birthTime}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Birth Place */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birth Place</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="birthPlace"
                        value={user.birthPlace}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Gender</label>
                    <select
                      name="gender"
                      value={user.gender}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Full Name (Real Name)</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="fullNameAtBirth"
                        value={user.fullNameAtBirth}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter Your Address"
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                {editMode && (
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                {loadingOrders ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                    <p className="mt-4 text-[var(--color-text-light)]">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-[var(--color-text-light)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No orders yet</h3>
                    <p className="text-[var(--color-text-light)]">Your order history will appear here</p>
                    <button
                      onClick={() => setOrders(dummyOrders)}
                      className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Load Demo Orders
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Status Legend */}
                    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-[var(--color-background)] rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-[var(--color-text-light)]">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-[var(--color-text-light)]">Processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-[var(--color-text-light)]">Delivered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-[var(--color-text-light)]">Cancelled</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border border-[var(--color-border)] rounded-lg p-4 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-[var(--color-text)]">
                                  Order #{order.orderId}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                {order.status === 'pending' && (
                                  <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                    Can be cancelled
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[var(--color-text-light)]">
                                Placed on {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-[var(--color-text)]">
                                {formatPrice(order.totalAmount)}
                              </p>
                              <p className="text-xs text-[var(--color-text-light)] mt-1">
                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-[var(--color-background)] rounded">
                                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded flex items-center justify-center">
                                  <Package size={20} className="text-[var(--color-primary)]" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-[var(--color-text)]">{item.productName}</h4>
                                  <p className="text-sm text-[var(--color-text-light)]">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-[var(--color-text)]">
                                    {formatPrice(item.quantity * item.price)}
                                  </p>
                                  <p className="text-xs text-[var(--color-text-light)] mt-1">
                                    Item total
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className="text-sm text-[var(--color-text-light)]">
                                {order.status === 'pending' && 'Order is pending confirmation'}
                                {order.status === 'processing' && 'Order is being processed'}
                                {order.status === 'delivered' && `Delivered on ${formatDate(order.deliveredAt || order.updatedAt)}`}
                                {order.status === 'cancelled' && `Cancelled on ${formatDate(order.updatedAt)}`}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              {order.status === 'delivered' && (
                                <button
                                  onClick={() => alert('Reorder functionality coming soon!')}
                                  className="px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
                                >
                                  Reorder
                                </button>
                              )}
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}