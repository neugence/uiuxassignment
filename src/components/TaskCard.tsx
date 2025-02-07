import { useMemo } from 'react';
import { Task } from '../types/task';
import { Calendar, Users, Trash2 } from 'lucide-react';
import useTaskStore from '../store/taskStore';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDelete: () => void;
}

const statusColors = {
  backlog: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
  'in-progress': 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  paused: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
  ready: 'bg-green-50 hover:bg-green-100 border-green-200',
};

const TaskCard = ({ task, onClick, onDelete }: TaskCardProps) => {
  const { users } = useTaskStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const assigneeAvatars = useMemo(() => {
    return task.assignees
      .map(id => users.get(id))
      .filter(Boolean)
      .map(user => user!.avatar)
      .slice(0, 3);
  }, [task.assignees, users]);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  e.stopPropagation();
  requestAnimationFrame(() => onDelete());
};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'border rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all',
        statusColors[task.status],
        isDragging && 'opacity-50 shadow-2xl scale-105',
        'group relative'
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 pr-8 break-words">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1.5 rounded-full hover:bg-red-50"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Users size={16} />
          <div className="flex -space-x-2">
            {assigneeAvatars.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt="Assignee"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
        </div>
        
        {task.endDate && (
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{format(new Date(task.endDate), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;