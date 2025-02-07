import React from "react";
import { List } from "lucide-react";
import { Badge, Dropdown } from "flowbite-react";

const tasks = [
  {
    id: 1,
    title: "Implement Login API",
    status: "In Progress",
    priority: "High",
    assignee: "John Doe",
    dueDate: "12-04-25",
  },
  {
    id: 2,
    title: "Fix Navbar Bug",
    status: "Backlog",
    priority: "Medium",
    assignee: "Jane Smith",
    dueDate: "15-04-25",
  },
  {
    id: 3,
    title: "Design Landing Page",
    status: "Paused",
    priority: "Low",
    assignee: "Emily Brown",
    dueDate: "18-04-25",
  },
];

const TaskLists = () => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto my-3 p-4">
        {/* Header starts */}
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
          <input
            type="text"
            className="border p-2 w-80 rounded-lg"
            placeholder="Search for tasks..."
          />
          <Dropdown label="Status">
            <Dropdown.Item>All</Dropdown.Item>
            <Dropdown.Item>Backlog</Dropdown.Item>
            <Dropdown.Item>In Progress</Dropdown.Item>
            <Dropdown.Item>Paused</Dropdown.Item>
            <Dropdown.Item>Completed</Dropdown.Item>
          </Dropdown>
          <Dropdown label="Priority">
            <Dropdown.Item>High</Dropdown.Item>
            <Dropdown.Item>Medium</Dropdown.Item>
            <Dropdown.Item>Low</Dropdown.Item>
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
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4">{task.status}</td>
                  <td className="px-6 py-4 ">
                    <Badge
                      className="inline "
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
                  <td className="px-6 py-4">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default TaskLists;
