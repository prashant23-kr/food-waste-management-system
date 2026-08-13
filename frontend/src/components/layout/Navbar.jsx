import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
} from "lucide-react";

const Navbar = ({ title, onMenuClick }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-secondary-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-secondary-100 dark:bg-secondary-700 border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-secondary-800 w-64 transition-all"
            />
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-secondary-600" />
            ) : (
              <Moon className="w-5 h-5 text-secondary-600" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-secondary-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-secondary-200 dark:border-secondary-700">
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                    Notifications
                  </h3>
                </div>
                <div className="px-4 py-3 text-sm text-secondary-500 dark:text-secondary-400">
                  No new notifications
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-500 hidden sm:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-secondary-200 dark:border-secondary-700">
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">
                    Admin User
                  </p>
                  <p className="text-xs text-secondary-500">
                    admin@foodloop.org
                  </p>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                >
                  Settings
                </a>
                <div className="border-t border-secondary-200 dark:border-secondary-700 mt-1 pt-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-danger-600 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
