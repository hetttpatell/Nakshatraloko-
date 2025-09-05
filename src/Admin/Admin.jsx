// Admin.jsx
import React, { useState } from "react";
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
  FaTrash
} from "react-icons/fa";

// Components
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsOverview from "./StatsOverview";
import ChartsSection from "./ChartsSection";
import RecentOrders from "./RecentOrders";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activePage === "Dashboard" && (
            <>
              {/* Overview Widgets */}
              <StatsOverview />
              
              {/* Charts */}
              <ChartsSection />
              
              {/* Recent Orders Table */}
              <RecentOrders />
            </>
          )}
          
          {activePage === "Orders" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Orders Management</h2>
              <p>Orders management content goes here...</p>
            </div>
          )}
          
          {activePage === "Products" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Products Management</h2>
              <p>Products management content goes here...</p>
            </div>
          )}
          
          {activePage === "Users" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Users Management</h2>
              <p>Users management content goes here...</p>
            </div>
          )}
          
          {activePage === "Settings" && (
            <div className="bg-white rounded-lg shadow p-6">
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