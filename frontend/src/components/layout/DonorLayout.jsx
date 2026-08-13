import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DonorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/donor/login");
  };

  const navItems = [
    { path: "/donor/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/donor/donations", label: "My Donations", icon: Package },
    { path: "/donor/donations/new", label: "Donate Food", icon: PlusCircle },
    { path: "/donor/impact", label: "Impact", icon: BarChart3 },
    { path: "/donor/profile", label: "Profile", icon: User },
  ];

  const bottomItems = [
    { path: "/donor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 h-screen bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200 dark:border-secondary-700">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                    FoodLoop
                  </h1>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Donor Portal
                  </p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
                <Leaf className="w-5 h-5 text-white" />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors hidden lg:flex"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-secondary-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-secondary-500" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-secondary-500" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium"
                      : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-secondary-200 dark:border-secondary-700 space-y-1">
            {bottomItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}
      >
        <header className="sticky top-0 z-10 h-16 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-secondary-600" />
            </button>
            <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
              <Bell className="w-5 h-5 text-secondary-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DonorLayout;
