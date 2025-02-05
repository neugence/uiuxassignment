import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddCard: () => void;
}

const getColumnTitle = (status: TaskStatus) => {
  switch (status) {
    case 'backlog':
      return 'Backlog';
    case 'in-progress':
      return 'In Progress';
    case 'paused':
      return 'Paused';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

export default function TaskColumn({ status, tasks, onAddCard }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `${status}-column`,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-700 rounded-lg p-3 min-h-[calc(100vh-12rem)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-100">
          {getColumnTitle(status)}
        </h2>
        <button
          onClick={onAddCard}
          className="p-1 hover:bg-gray-600 rounded-md transition-colors text-gray-300"
        >
          <Plus size={16} />
        </button>
      </div>
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 flex-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}




// <div
    //   ref={setNodeRef}
    //   className="bg-[#F1F2F4] rounded-lg p-3 min-h-[calc(100vh-12rem)] flex flex-col"
    // >
    //   <div className="flex items-center justify-between mb-3">
    //     <h2 className="text-sm font-semibold text-gray-700">
    //       {getColumnTitle(status)}
    //     </h2>
    //     <button
    //       onClick={onAddCard}
    //       className="p-1 hover:bg-gray-200 rounded-md transition-colors"
    //     >
    //       <Plus size={16} />
    //     </button>
    //   </div>