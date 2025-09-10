// Admin.jsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from "recharts";
import {
  FaBell,
  FaUserCircle,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaCog,
  FaBars,
  FaSignOutAlt,
  FaSearch,
  FaChevronDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Components
import Sidebar from "./Sidebar";
import StatsOverview from "./StatsOverview";
import ChartsSection from "./ChartsSection";
import RecentOrders from "./RecentOrders";
import OrdersManagement from "./OrdersManagement";
import ProductAdmin from "./ProductSection/ProductsAdmin";
import CategoriesAdmin from "./CatagoryAdmin/CategoriesAdmin";
import Coupons from "./Coupons/Coupons";
import Consultancy from "./Consultancy/Consultancy";

// API utility
import api from "../Utils/api";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
  const token = localStorage.getItem("authToken");
  const userData = localStorage.getItem("user");
  
  console.log('Token exists:', !!token);
  console.log('User data in localStorage:', userData);
  
  if (!token) {
    navigate("/");
    return;
  }
  
  try {
    let parsedUser = userData ? JSON.parse(userData) : {};
    console.log('Parsed user from localStorage:', parsedUser);
    
    // Fallback: extract user info from token if user data is missing
    if (Object.keys(parsedUser).length === 0) {
      console.log('No user data in localStorage, extracting from token...');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        parsedUser = {
          id: payload.id,
          email: payload.email,
          role: payload.role,
          fullname: payload.fullname || payload.email
        };
        localStorage.setItem('user', JSON.stringify(parsedUser));
        console.log('User data saved to localStorage:', parsedUser);
      } catch (tokenError) {
        console.error('Error parsing token:', tokenError);
      }
    }
    
    setUser(parsedUser);
    
    // Check if user is admin (case-insensitive)
    const userRole = parsedUser.role?.toLowerCase();
    console.log('User role:', userRole);
    
    if (userRole !== 'admin') {
      console.log('User is not admin, redirecting...');
      navigate("/");
      return;
    }
    
    console.log('Admin access granted!');
  } catch (error) {
    console.error("Error in authentication check:", error);
    navigate("/");
  }
};
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile when switching to a smaller screen
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }

      // Auto-open sidebar on larger screens
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Close sidebar when a menu item is clicked on mobile
  const handlePageChange = (page) => {
    setActivePage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile overlay for sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'fixed inset-y-0 left-0 z-30 w-64 transform transition duration-300 ease-in-out' : 'relative'} 
        flex-shrink-0 z-40
      `}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
          setActivePage={handlePageChange}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with hamburger menu */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4 md:px-6">
            <div className="flex items-center">
              {/* Hamburger menu button */}
              <button
                onClick={toggleSidebar}
                className="p-2 mr-4 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Toggle sidebar"
              >
                <FaBars className="h-5 w-5" />
              </button>

              {/* Page title */}
              <h1 className="text-xl font-semibold text-gray-800">{activePage}</h1>
            </div>

            {/* Right side header content (notifications, user profile, etc.) */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-800">
                <FaBell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <FaUserCircle className="h-5 w-5 text-gray-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user ? user.fullname || user.email : 'Admin User'}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600"
                title="Logout"
              >
                <FaSignOutAlt className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activePage === "Dashboard" && (
            <>
              {/* Overview Widgets */}
              <StatsOverview isMobile={isMobile} />

              {/* Charts */}
              <ChartsSection isMobile={isMobile} />

              {/* Recent Orders Table */}
              <RecentOrders isMobile={isMobile} />
            </>
          )}

          {activePage === "Orders" && (
            <OrdersManagement isMobile={isMobile} />
          )}

          {activePage === "Products" && (
            <ProductAdmin isMobile={isMobile} />
          )}

          {activePage === "Catagories" && (
            <CategoriesAdmin isMobile={isMobile} />
          )}

          {activePage === "Coupons" && (
            <Coupons isMobile={isMobile} />
          )}

          {activePage === "Consultancy" && (
            <Consultancy isMobile={isMobile} />
          )}

          {activePage === "Settings" && (
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <p>Settings content goes here...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;