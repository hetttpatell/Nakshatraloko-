// components/Header.jsx
import React, { useState } from "react";
import { FaBell, FaUserCircle, FaChevronDown, FaBars, FaSearch, FaCog ,FaSignOutAlt } from "react-icons/fa";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received", time: "5 mins ago" },
    { id: 2, message: "Server load is high", time: "30 mins ago" },
    { id: 3, message: "New user registered", time: "2 hours ago" },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            className="p-2 mr-4 text-gray-600 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="p-2 text-gray-600 rounded-full hover:bg-gray-100 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="p-3 border-b font-semibold">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center text-blue-600 hover:bg-gray-50 cursor-pointer">
                  View all notifications
                </div>
              </div>
            )}
          </div>
          
          {/* User profile */}
          <div className="relative">
  <button 
    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
    onClick={() => setUserMenuOpen(!userMenuOpen)}
    aria-expanded={userMenuOpen}
    aria-haspopup="true"
  >
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
      <FaUserCircle className="text-lg" />
    </div>
    <div className="hidden md:flex md:flex-col md:items-start">
      <span className="text-sm font-medium text-gray-800">Admin User</span>
      <span className="text-xs text-gray-500">Administrator</span>
    </div>
    <FaChevronDown className={`text-xs transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
  </button>
  
  {userMenuOpen && (
    <div 
      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-30 border border-gray-200 overflow-hidden animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* User info section */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <p className="font-semibold text-gray-800">Admin User</p>
        <p className="text-sm text-gray-600 truncate">admin@example.com</p>
      </div>
      
      {/* Menu options */}
      <div className="py-2">
        <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150">
          <FaUserCircle className="mr-3 text-gray-400 text-base" />
          <span>Profile</span>
        </button>
        
        <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150">
          <FaCog className="mr-3 text-gray-400 text-base" />
          <span>Settings</span>
        </button>
        
        <div className="border-t border-gray-100 my-1"></div>
        
        <button 
          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
          onClick={() => {
            console.log('Logout clicked');
            setUserMenuOpen(false);
          }}
        >
          <FaSignOutAlt className="mr-3 text-base" />
          <span>Logout</span>
        </button>
      </div>
      
      {/* Version info */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500">v2.4.1</p>
      </div>
    </div>
  )}
</div>
        </div>
      </div>
    </header>
  );
};

export default Header;