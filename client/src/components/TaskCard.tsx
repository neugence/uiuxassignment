import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User, Paperclip, MessageSquare } from 'lucide-react';
import { Task } from '../types/task';
import { format } from 'date-fns';
import useTaskStore from '../store/useTaskStore';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateProgress } = useTaskStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 rounded-lg shadow-sm p-3 cursor-move hover:shadow-md transition-shadow"
    >
      {task.startDate && (
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <Calendar size={12} />
          <span>{format(new Date(task.startDate), 'MMM d')}</span>
          {task.endDate && (
            <>
              <span>-</span>
              <span>{format(new Date(task.endDate), 'MMM d')}</span>
            </>
          )}
        </div>
      )}

      <h3 className="text-sm font-medium text-gray-100 mb-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-xs text-gray-400 mb-3">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            <span className="text-xs">2</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip size={14} />
            <span className="text-xs">3</span>
          </div>
        </div>
        
        {task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.map((assignee, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
              >
                <span className="text-xs font-medium">
                  {assignee.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {task.progress > 0 && (
        <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(task.progress)} transition-all duration-300`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}