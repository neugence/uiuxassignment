import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import useTaskStore from '../store/taskStore';

function TaskModal({ task, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    status: 'General Information',
    startDate: '',
    endDate: '',
    assignees: [],
  });

  const { addTask, updateTask } = useTaskStore();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate,
        assignees: task.assignees,
      });
    }
  }, [task]);

  const handleSubmit = useCallback(
    e => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={e =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="General Information">General Information</option>
              <option value="Backlog">Backlog</option>
              <option value="In progress">In Progress</option>
              <option value="Paused">Paused</option>
              <option value="Ready for launch">Ready for Launch</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
