// components/StatsOverview.jsx
import React from "react";
import { FaArrowUp, FaArrowDown, FaShoppingCart, FaUsers, FaClock, FaDollarSign } from "react-icons/fa";

const overviewData = [
  { 
    title: "Total Sales", 
    value: "$12,340", 
    change: "+12%", 
    isPositive: true,
    icon: <FaShoppingCart className="text-blue-500" />
  },
  { 
    title: "Active Users", 
    value: "1,234", 
    change: "+5%", 
    isPositive: true,
    icon: <FaUsers className="text-green-500" />
  },
  { 
    title: "Pending Orders", 
    value: "23", 
    change: "-3%", 
    isPositive: false,
    icon: <FaClock className="text-yellow-500" />
  },
  { 
    title: "Revenue", 
    value: "$45,000", 
    change: "+18%", 
    isPositive: true,
    icon: <FaDollarSign className="text-purple-500" />
  },
];

const StatsOverview = ({ isMobile }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {overviewData.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-500 text-sm font-medium">{item.title}</h2>
              <p className="text-xl md:text-2xl font-bold mt-1">{item.value}</p>
            </div>
            <div className={`p-2 rounded-full ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>
              {item.icon}
            </div>
          </div>
          <div className={`flex items-center mt-3 text-xs ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {item.isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            <span>{item.change} from last week</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;