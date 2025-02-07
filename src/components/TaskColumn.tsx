import { useMemo } from 'react';
import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '../utils/cn';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  className?: string; 
}

const statusColors = {
  backlog: 'bg-purple-100',
  'in-progress': 'bg-blue-100',
  paused: 'bg-orange-100',
  ready: 'bg-green-100',
};

const TaskColumn = ({ 
  title, 
  status, 
  tasks, 
  onAddTask, 
  onTaskClick,
  onDeleteTask,
  className
}: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [tasks]);

  return (
    <div className="flex flex-col min-w-[280px] sm:min-w-[300px] md:min-w-[320px] max-w-[350px] flex-shrink-0">
      <div className={cn(
        'rounded-t-lg p-3 text-center',
        statusColors[status]
      )}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 truncate whitespace-nowrap overflow-hidden">
            {title}
          </h2>
          <button
            onClick={onAddTask}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 space-y-3 overflow-auto max-h-[calc(100vh-12rem)]',
          'bg-gray-50/80 rounded-b-lg hide-scrollbar',
          isOver && 'bg-gray-100/80'
        )}
      >
        <SortableContext 
          items={sortedTasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default TaskColumn;
