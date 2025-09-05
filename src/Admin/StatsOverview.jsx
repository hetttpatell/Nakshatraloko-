// components/StatsOverview.jsx
import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const overviewData = [
  { 
    title: "Total Sales", 
    value: "$12,340", 
    change: "+12%", 
    isPositive: true,
    icon: <FaArrowUp className="text-green-500" />
  },
  { 
    title: "Active Users", 
    value: "1,234", 
    change: "+5%", 
    isPositive: true,
    icon: <FaArrowUp className="text-green-500" />
  },
  { 
    title: "Pending Orders", 
    value: "23", 
    change: "-3%", 
    isPositive: false,
    icon: <FaArrowDown className="text-red-500" />
  },
  { 
    title: "Revenue", 
    value: "$45,000", 
    change: "+18%", 
    isPositive: true,
    icon: <FaArrowUp className="text-green-500" />
  },
];

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {overviewData.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{item.title}</h2>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
            <div className={`p-3 rounded-full ${index % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>
              {/* You can add specific icons for each card here */}
            </div>
          </div>
          <div className={`flex items-center mt-4 text-sm ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {item.icon}
            <span className="ml-1">{item.change} from last week</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;