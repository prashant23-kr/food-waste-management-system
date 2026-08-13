import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const titles = {
      "/": "Overview",
      "/dashboard": "Dashboard",
      "/donations": "Donations",
      "/donors": "Donor Analytics",
      "/ngos": "NGO Analytics",
      "/food-waste": "Food Waste Analytics",
      "/impact": "Social & Environmental Impact",
      "/about": "About Project",
    };
    return titles[location.pathname] || "FoodLoop";
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <Navbar
          title={getPageTitle()}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
