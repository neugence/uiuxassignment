import React, { useState } from "react";
import { List } from "lucide-react";
import { Badge, Dropdown } from "flowbite-react";

const tasks = [
  {
    id: 1,
    title: "Implement Login API",
    status: "In Progress",
    priority: "High",
    assignee: "John Doe",
    startDate: "02-04-25",
    dueDate: "12-04-25",
  },
  {
    id: 2,
    title: "Fix Navbar Bug",
    status: "Backlog",
    priority: "Medium",
    assignee: "Jane Smith",
    startDate: "02-03-25",
    dueDate: "15-03-25",
  },
  {
    id: 3,
    title: "Design Landing Page",
    status: "Paused",
    priority: "Low",
    assignee: "Emily Brown",
    startDate: "22-02-25",
    dueDate: "28-02-25",
  },
  {
    id: 4,
    title: "Optimize Database Queries",
    status: "In Progress",
    priority: "High",
    assignee: "Michael Johnson",
    startDate: "10-04-25",
    dueDate: "20-04-25",
  },
  {
    id: 5,
    title: "Write Unit Tests for Dashboard",
    status: "Completed",
    priority: "Medium",
    assignee: "Sarah Lee",
    startDate: "01-03-25",
    dueDate: "10-03-25",
  },
  {
    id: 6,
    title: "Setup CI/CD Pipeline",
    status: "Backlog",
    priority: "High",
    assignee: "David Miller",
    startDate: "05-04-25",
    dueDate: "25-04-25",
  },
  {
    id: 7,
    title: "Redesign Mobile Navigation",
    status: "Paused",
    priority: "Low",
    assignee: "Olivia Wilson",
    startDate: "18-02-25",
    dueDate: "28-02-25",
  },
  {
    id: 8,
    title: "Resolve Payment Gateway Issue",
    status: "In Progress",
    priority: "High",
    assignee: "Daniel Martinez",
    startDate: "08-04-25",
    dueDate: "18-04-25",
  },
  {
    id: 9,
    title: "Improve Page Load Speed",
    status: "Completed",
    priority: "Medium",
    assignee: "Emma Thompson",
    startDate: "02-03-25",
    dueDate: "12-03-25",
  },
  {
    id: 10,
    title: "Upgrade Node.js Version",
    status: "Backlog",
    priority: "Low",
    assignee: "Liam Anderson",
    startDate: "10-04-25",
    dueDate: "30-04-25",
  },
];

const TaskLists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  // **Filter logic**
  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedStatus === "All" || task.status === selectedStatus) &&
      (selectedPriority === "All" || task.priority === selectedPriority) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto my-3 p-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <List className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-base md:text-lg font-medium">
                Task List
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-5 p-4 bg-gray-100 rounded-md">
        {/* Search Input */}
        <input
          type="text"
          className="border p-2 w-80 rounded-lg"
          placeholder="Search for tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Status Filter */}
        <Dropdown label={selectedStatus} dismissOnClick={true}>
          <Dropdown.Item onClick={() => setSelectedStatus("All")}>
            All
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedStatus("Backlog")}>
            Backlog
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedStatus("In Progress")}>
            In Progress
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedStatus("Paused")}>
            Paused
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedStatus("Completed")}>
            Completed
          </Dropdown.Item>
        </Dropdown>

        {/* Priority Filter */}
        <Dropdown label={selectedPriority} dismissOnClick={true}>
          <Dropdown.Item onClick={() => setSelectedPriority("All")}>
            All
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedPriority("High")}>
            High
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedPriority("Medium")}>
            Medium
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedPriority("Low")}>
            Low
          </Dropdown.Item>
        </Dropdown>
      </div>

      {/* Task Table */}
      <div className="relative overflow-x-auto shadow-md rounded-lg mt-4">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Assignee</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4">{task.status}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className="inline"
                      color={
                        task.priority === "High"
                          ? "failure"
                          : task.priority === "Medium"
                          ? "warning"
                          : "success"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">{task.assignee}</td>
                  <td className="px-6 py-4">{task.startDate}</td>
                  <td className="px-6 py-4">{task.dueDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskLists;
