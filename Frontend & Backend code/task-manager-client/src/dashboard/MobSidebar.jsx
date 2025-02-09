import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ListChecks,
  ClipboardList,
  LucideHome,
  LucideLogOut,
  Users2Icon,
  SquareChartGantt,
  Menu,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const MobSidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast("Log out Successfully", { theme: "dark" });
    } catch (error) {
      toast("Log out Failed");
    }
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-purple-600 focus:outline-none cursor-pointer"
      >
        <Menu size={28} />
      </button>

      {/* Overlay (for better UX) */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-5 text-lg font-bold text-purple-600 flex items-center justify-between">
          <span>Task Manager</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-purple-600 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 p-5">
          <NavLink
            to="/dashboard/overview"
            className="flex items-center gap-3 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            <SquareChartGantt /> Overview
          </NavLink>
          <NavLink
            to="/dashboard/todo-list"
            className="flex items-center gap-3 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            <ListChecks /> To-Do
          </NavLink>
          <NavLink
            to="/dashboard/manage-tasks"
            className="flex items-center gap-3 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            <ClipboardList /> Manage Tasks
          </NavLink>
          <NavLink
            to="/dashboard/members"
            className="flex items-center gap-3 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            <Users2Icon /> Members
          </NavLink>
          <hr />
          <NavLink
            to="/"
            className="flex items-center gap-3 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            <LucideHome /> Home
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 bg-rose-500 text-white font-semibold px-2 py-2 rounded-md hover:bg-rose-400 transition duration-300"
          >
            <LucideLogOut /> Log Out
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobSidebar;
