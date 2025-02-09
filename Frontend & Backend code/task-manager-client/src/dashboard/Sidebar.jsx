import { NavLink, useNavigate } from "react-router-dom";
import {
  ListChecks,
  ClipboardList,
  LucideHome,
  LucideLogOut,
  Users2Icon,
  SquareChartGantt,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      toast("Log out Successfully", {
        theme: "dark",
      });
    } catch (error) {
      toast("Log out Failed");
    }
  };

  return (
    <div className="h-screen w-56 bg-white shadow-xl p-5 flex flex-col">
      <div className="text-lg font-bold text-purple-600 mb-6 text-center flex items-center gap-2">
        <img
          className="w-12 h-12"
          src="https://i.ibb.co.com/LhcHbQ8c/images-removebg-preview.png"
          alt=""
        />
        Task Manager
      </div>

      <nav className="flex flex-col justify-between h-screen">
        <div className="flex flex-col gap-4">
          <NavLink
            to="/dashboard/overview"
            className={({ isActive }) =>
              `flex items-center gap-3 border-2 border-purple-600 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-base cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-500 hover:text-white"
              }`
            }
          >
            <SquareChartGantt className="text-lg" />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/dashboard/todo-list"
            className={({ isActive }) =>
              `flex items-center gap-3 border-2 border-purple-600 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-base cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-500 hover:text-white"
              }`
            }
          >
            <ListChecks className="text-lg" />
            <span>To-Do</span>
          </NavLink>

          <NavLink
            to="/dashboard/manage-tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 border-2 border-purple-600 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-base cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-500 hover:text-white"
              }`
            }
          >
            <ClipboardList className="text-lg" />
            <span>Manage Tasks</span>
          </NavLink>
          <NavLink
            to="/dashboard/members"
            className={({ isActive }) =>
              `flex items-center gap-3 border-2 border-purple-600 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-base cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-500 hover:text-white"
              }`
            }
          >
            <Users2Icon className="text-lg" />
            <span>Members</span>
          </NavLink>
          <hr className="text-purple-600" />
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 border-2 border-purple-600 text-black font-semibold px-2 py-2 rounded-md hover:bg-purple-600 hover:text-white ease-in-out transition-all duration-300 text-base cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-500 hover:text-white"
              }`
            }
          >
            <LucideHome className="text-lg" />
            <span>Home</span>
          </NavLink>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 border-2 border-rose-500 text-black font-semibold px-2 py-2 rounded-md hover:bg-rose-500 hover:text-white ease-in-out transition-all duration-300 text-base cursor-pointer"
        >
          <LucideLogOut />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
