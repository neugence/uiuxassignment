import React, { useContext } from 'react';
import { MessageSquare, Eye } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';

function TaskCard({ task }) {
  const { openModal } = useContext(GlobalContext);

  return (
    <div
      className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => {
        openModal(task);
      }}
    >
      <h3 className="font-medium text-gray-800 mb-2">{task.title}</h3>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{task.views}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare size={16} className="mr-1" />
            <span>{task.comments}</span>
          </div>
        </div>

        <div className="flex -space-x-2">
          {task.assignees.map(assignee => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full border-2 border-white"
              title={assignee.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
