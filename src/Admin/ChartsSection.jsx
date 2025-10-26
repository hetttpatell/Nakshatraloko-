// components/ChartsSection.jsx
import React from "react";
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
  CartesianGrid,
  Legend
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 5000, revenue: 3800 },
  { name: "Apr", sales: 4000, revenue: 2900 },
  { name: "May", sales: 6000, revenue: 4300 },
  { name: "Jun", sales: 7000, revenue: 5200 },
  { name: "Jul", sales: 5000, revenue: 3800 },
  { name: "Aug", sales: 6500, revenue: 4800 },
  { name: "Sep", sales: 7500, revenue: 5500 },
  { name: "Oct", sales: 8000, revenue: 6000 },
  { name: "Nov", sales: 7500, revenue: 5800 },
  { name: "Dec", sales: 8500, revenue: 6500 },
];

const pieData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 300 },
  { name: "Product D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartsSection = ({ isMobile }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
      {/* Sales Chart */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#0088FE" 
                strokeWidth={2} 
                activeDot={{ r: 6 }} 
                dot={{ r: isMobile ? 2 : 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#00C49F" 
                strokeWidth={2} 
                activeDot={{ r: 6 }}
                dot={{ r: isMobile ? 2 : 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Products Chart */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Top Products</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 70 : 80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
              <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;