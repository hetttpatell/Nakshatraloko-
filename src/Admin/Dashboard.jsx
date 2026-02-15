import React, { useState } from "react";
import StatsOverview from "./StatsOverview";
import ChartsSection from "./ChartsSection";

const Dashboard = ({ isMobile, onNavigate  }) => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [pieData, setPieData] = useState([]);

  return (
    <>
      <StatsOverview
        stats={stats}
        setStats={setStats}
        setSalesData={setSalesData}
        setPieData={setPieData}
        onNavigate={onNavigate} 
      />

      <ChartsSection
        isMobile={isMobile}
        salesData={salesData}
        pieData={pieData}
      />
    </>
  );
};

export default Dashboard;
