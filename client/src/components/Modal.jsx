import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import useTaskStore from "../store/taskStore";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { mockUsers } from "../utils/mockData";

function Modal({ task, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "General Information",
    description: "",
    startDate: "",
    endDate: "",
    assignees: [],
    tags: [],
  });

  const { addTask, updateTask } = useTaskStore();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        status: task.status,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        assignees: task.assignees,
        tags: task.tags || [],
      });
    }
  }, [task]);

  const toggleAssignee = (assignee) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(assignee)
        ? prev.assignees.filter((a) => a !== assignee)
        : [...prev.assignees, assignee],
    }));
  };

  const toggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (task) {
        updateTask(task.id, formData);
      } else {
        addTask({
          id: `task-${Date.now()}`,
          ...formData,
          comments: 0,
          views: 0,
        });
      }
      onClose();
    },
    [formData, task, addTask, updateTask, onClose]
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true"></div>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-[#0d1117] shadow-xl transition-all">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <DialogTitle className="text-xl font-semibold text-white">
              {task ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter task title"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
              >
                <option value="General Information">General Information</option>
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Paused">Paused</option>
                <option value="Ready for Launch">Ready for Launch</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter task description"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                required
              />
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
                />
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Assignee
              </label>
              <div className="flex space-x-4">
                {mockUsers.map((assignee) => (
                  <div
                    key={assignee.id}
                    onClick={() => toggleAssignee(assignee)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer 
                      ${
                        formData.assignees.includes(assignee)
                          ? "bg-blue-600 border-2 text-white"
                          : "bg-gray-700 border-gray-500 text-white"
                      }
                    `}
                  >
                    {assignee.name.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex space-x-4">
                {["purple", "blue", "green", "red"].map((tag) => (
                  <div
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`w-8 h-8 rounded-full cursor-pointer 
                      ${formData.tags.includes(tag) ? "ring-2 ring-white" : ""}
                      bg-${tag}-600`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                {task ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default Modal;
