// components/StatsOverview.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart,
  FaUsers,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";

const StatsOverview = ({ isMobile }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch dashboard stats
  useEffect(() => {
    let token = localStorage.getItem("authToken");

    axios
      .post(
        `${BACKEND_URL}admin/dashboardStats`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  const overviewData = [
    {
      title: "Total Sales",
      value: stats.total_sales,
      icon: <FaShoppingCart className="text-blue-500" />,
      isPositive: true,
      change: "+12%",
    },
    {
      title: "Active Users",
      value: stats.active_users,
      icon: <FaUsers className="text-green-500" />,
      isPositive: true,
      change: "+8%",
    },
    {
      title: "Pending Orders",
      value: stats.pending_orders,
      icon: <FaClock className="text-yellow-500" />,
      isPositive: false,
      change: "-3%",
    },
    {
      title: "Revenue",
      value: stats.total_revenue,
      icon: <FaDollarSign className="text-purple-500" />,
      isPositive: true,
      change: "+15%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {overviewData.map((item, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-gray-500 text-sm font-medium">
                {item.title}
              </h2>
              <p className="text-xl md:text-2xl font-bold mt-1">{item.value}</p>
            </div>

            <div
              className={`p-2 rounded-full ${
                index % 2 === 0 ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              {item.icon}
            </div>
          </div>

          <div
            className={`flex items-center mt-3 text-xs ${
              item.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.isPositive ? (
              <FaArrowUp className="mr-1" />
            ) : (
              <FaArrowDown className="mr-1" />
            )}
            <span>{item.change} from last week</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
