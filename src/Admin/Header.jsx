// components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle, FaChevronDown, FaBars, FaSearch, FaCog, FaSignOutAlt } from "react-icons/fa";

const Header = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received", time: "5 mins ago" },
    { id: 2, message: "Server load is high", time: "30 mins ago" },
    { id: 3, message: "New user registered", time: "2 hours ago" },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm z-40 sticky top-0">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            className="p-2 mr-2 md:mr-4 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
          {!isMobile && (
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-2 text-gray-600 rounded-full hover:bg-gray-100 relative transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <FaBell />
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                <div className="p-3 border-b font-semibold bg-gray-50">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="font-medium text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
                <div className="p-2 text-center text-blue-600 hover:bg-gray-50 cursor-pointer transition-colors text-sm">
                  View all notifications
                </div>
              </div>
            )}
          </div>
          
          {/* User profile */}
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center gap-2 p-1 md:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
                <FaUserCircle className="text-lg" />
              </div>
              {!isMobile && (
                <>
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium text-gray-800">Admin User</span>
                    <span className="text-xs text-gray-500">Administrator</span>
                  </div>
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
                {/* User info section */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
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
                      // console.log('Logout clicked');
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
      
      {/* Mobile search bar */}
      {isMobile && (
        <div className="px-4 pb-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;