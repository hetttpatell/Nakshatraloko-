// components/Sidebar.jsx
import React from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaBox,
  FaList ,
  FaCog,
   FaPercent,
   FaHandshake,
  FaSignOutAlt
} from "react-icons/fa";

const sidebarItems = [
  { name: "Dashboard", icon: <FaChartBar /> },
  { name: "Orders", icon: <FaShoppingCart /> },
  { name: "Products", icon: <FaBox /> },
  { name: "Catagories", icon: <FaList /> },
  { name: "Coupons", icon: < FaPercent  /> },
  { name: "Consultancy", icon: <FaHandshake /> },
  { name: "Settings", icon: <FaCog /> },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, activePage, setActivePage }) => {
  return (
    <div className={`bg-gray-800 text-white ${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 relative`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          className="p-1 rounded-md hover:bg-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>
      </div>
      
      <nav className="mt-6">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setActivePage(item.name)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-gray-700 transition-colors ${activePage === item.name ? "bg-gray-700 border-r-4 border-blue-500" : ""}`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout button at bottom */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded">
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 