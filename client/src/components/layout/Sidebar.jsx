import React, { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  Archive,
  Settings,
  HelpCircle,
  ChevronLeft,
  Plus,
  MessageSquare,
} from "lucide-react";
import useTaskStore from "../../store/taskStore";

const Sidebar = ({ onCreateTask }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);

  // Calculate task statistics
  const taskStats = {
    total: tasks.size,
    completed: Array.from(tasks).filter(
      (task) => task.status === "Ready for Launch"
    ).length,
    inProgress: Array.from(tasks).filter(
      (task) => task.status === "In Progress"
    ).length,
  };

  const mainMenuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      link: "/dashboard",
      count: null,
    },
    {
      icon: CheckSquare,
      label: "Tasks",
      link: "/tasks",
      count: taskStats.total,
    },
    { icon: Calendar, label: "Calendar", link: "/calendar", count: null },
    { icon: Users, label: "Team", link: "/team", count: null },
    { icon: MessageSquare, label: "Messages", link: "/messages", count: 3 },
    { icon: Archive, label: "Archive", link: "/archive", count: null },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: "Settings", link: "/settings" },
    { icon: HelpCircle, label: "Help & Support", link: "/help" },
  ];

  const renderMenuItem = (item, index) => (
    <a
      key={index}
      href="/"
      className="flex items-center gap-3  px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <item.icon size={20} />
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.count !== null && (
            <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
              {item.count}
            </span>
          )}
        </>
      )}
    </a>
  );

  return (
    <aside
      className={`
        bg-white border-r border-gray-200 transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft
              size={20}
              className={`transform transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Create Task Button */}
        <div className="px-4 mb-6">
          <button
            onClick={onCreateTask}
            className={`
              bg-blue-600 text-white w-full rounded-lg hover:bg-blue-700 transition-colors
              ${isCollapsed ? "p-2" : "py-2 px-4"}
              flex items-center justify-center gap-2
            `}
          >
            <Plus size={20} />
            {!isCollapsed && <span>Create Task</span>}
          </button>
        </div>

        {/* Task Statistics */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Task Overview
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-medium">{taskStats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {taskStats.completed}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-medium text-blue-600">
                    {taskStats.inProgress}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">{mainMenuItems.map(renderMenuItem)}</div>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">{bottomMenuItems.map(renderMenuItem)}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
