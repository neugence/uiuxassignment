import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '../types/task';
import useTaskStore from '../store/taskStore';
import { X } from 'lucide-react';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

const TaskModal = ({ task, isOpen, onClose, defaultStatus }: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus ?? 'backlog');
  const [startDate, setStartDate] = useState(task?.startDate ?? '');
  const [endDate, setEndDate] = useState(task?.endDate ?? '');
  
  const { addTask, updateTask } = useTaskStore();

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title ?? '');
      setStatus(task?.status ?? defaultStatus ?? 'backlog');
      setStartDate(task?.startDate ?? '');
      setEndDate(task?.endDate ?? '');
    }
  }, [isOpen, task, defaultStatus]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title,
      status,
      startDate,
      endDate,
      assignees: task?.assignees ?? [],
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  }, [title, status, startDate, endDate, task, addTask, updateTask, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="backlog">Backlog</option>
              <option value="in-progress">In Progress</option>
              <option value="paused">Paused</option>
              <option value="ready">Ready for Launch</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;