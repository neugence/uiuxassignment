import React, { useCallback, useEffect, useState } from 'react';
import { X, Plus, Search, Check } from 'lucide-react';
import { Task, TaskStatus } from '../types/task';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const STATUSES: TaskStatus[] = ['backlog', 'in-progress', 'paused', 'completed'];

// Mock team members - in a real app, this would come from your backend
const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=faces' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces' },
];

export default function TaskModal({ task, isOpen, onClose, onSave }: TaskModalProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    status: 'backlog' as TaskStatus,
    assignees: [] as string[],
    startDate: '',
    endDate: '',
  });

  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        assignees: task.assignees,
        startDate: task.startDate || '',
        endDate: task.endDate || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'backlog',
        assignees: [],
        startDate: '',
        endDate: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  }, [formData, onClose, onSave]);

  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const filteredTeamMembers = TEAM_MEMBERS.filter(member => 
    member.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(assigneeSearch.toLowerCase())
  );

  const toggleAssignee = (email: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(email)
        ? prev.assignees.filter(a => a !== email)
        : [...prev.assignees, email]
    }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={handleOutsideClick}
    >
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">
          {task ? 'Edit Task' : 'Create New Task'}
    {/* <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Create New Task'} */}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assignees
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.assignees.map(email => {
                const member = TEAM_MEMBERS.find(m => m.email === email);
                return member ? (
                  <div
                    key={email}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{member.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleAssignee(email)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
            <div className="relative">
              <input
                type="text"
                value={assigneeSearch}
                onChange={(e) => {
                  setAssigneeSearch(e.target.value);
                  setShowAssigneeDropdown(true);
                }}
                onFocus={() => setShowAssigneeDropdown(true)}
                placeholder="Search team members..."
                className="w-full px-3 py-2 border rounded-md"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {showAssigneeDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                {filteredTeamMembers.map(member => (
                  <div
                    key={member.id}
                    onClick={() => {
                      toggleAssignee(member.email);
                      setAssigneeSearch('');
                      setShowAssigneeDropdown(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email}</div>
                    </div>
                    {formData.assignees.includes(member.email) && (
                      <div className="ml-auto text-blue-600">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}