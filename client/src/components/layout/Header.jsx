import React, { useState, useCallback } from "react";
import { Search, Bell, Settings, HelpCircle, User } from "lucide-react";
import useTaskStore from "../../store/taskStore";

const Header = () => {
  const setFilters = useTaskStore((state) => state.setFilters);
  const filters = useTaskStore((state) => state.filters);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters({ search: value });
    }, 300),
    [setFilters]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo and Title */}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">TM</span>
            <span className="text-xl font-semibold text-gray-700">
              Task Manager
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8"></div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Settings size={20} />
          </button>

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <HelpCircle size={20} />
          </button>

          <div className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-700">
                Anchal Dev
              </div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
