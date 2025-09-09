// components/Sidebar.jsx
import React from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaBox,
  FaList,
  FaCog,
  FaPercent,
  FaHandshake,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";

const sidebarItems = [
  { name: "Dashboard", icon: <FaChartBar /> },
  { name: "Orders", icon: <FaShoppingCart /> },
  { name: "Products", icon: <FaBox /> },
  { name: "Catagories", icon: <FaList /> },
  { name: "Coupons", icon: <FaPercent /> },
  { name: "Consultancy", icon: <FaHandshake /> },
  { name: "Settings", icon: <FaCog /> },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage, isMobile }) => {
  return (
    <>
      {/* Backdrop with blur effect for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xs z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`w-64 bg-gray-800 text-white h-full flex flex-col fixed md:relative z-40 transform transition-transform duration-300 ease-in-out ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}`}>
        {/* Sidebar header with close button on mobile */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActivePage(item.name);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-gray-700 transition-colors ${activePage === item.name ? "bg-gray-900 border-r-4 border-blue-500" : ""}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout button at bottom */}
        <div className="w-full p-4 border-t border-gray-700">
          <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded transition-colors">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;