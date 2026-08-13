import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Users,
  Heart,
  Trash2,
  BarChart3,
  Info,
  Settings,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Overview", icon: LayoutDashboard },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/donations", label: "Donations", icon: Package },
    { path: "/donors", label: "Donors", icon: Users },
    { path: "/ngos", label: "NGOs", icon: Heart },
    { path: "/food-waste", label: "Food Waste", icon: Trash2 },
    { path: "/impact", label: "Impact", icon: BarChart3 },
    { path: "/about", label: "About", icon: Info },
  ];

  const bottomItems = [
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/help", label: "Help", icon: HelpCircle },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-screen bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"}
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
                    Turning Waste Into Impact
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
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors lg:flex hidden"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-secondary-500" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-secondary-500" />
              )}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-secondary-500" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${
                      active
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium"
                        : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-secondary-200 dark:border-secondary-700 space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-600 dark:text-secondary-400">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    Admin User
                  </p>
                  <p className="text-xs text-secondary-500">admin@foodloop.org</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
