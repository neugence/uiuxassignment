import { useMemo } from 'react';
import { Task } from '../types/task';
import { format, addDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import useTaskStore from '../store/taskStore';
import { cn } from '../utils/cn';

interface TimelineProps {
  onTaskClick: (task: Task) => void;
}

const statusColors = {
  backlog: 'bg-purple-200',
  'in-progress': 'bg-blue-200',
  paused: 'bg-orange-200',
  ready: 'bg-green-200',
};

const Timeline = ({ onTaskClick }: TimelineProps) => {
  const { tasks, users } = useTaskStore();

  const today = new Date();
  const startDate = startOfWeek(today);
  const endDate = endOfWeek(addDays(today, 14));

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [startDate, endDate]);

  const tasksByUser = useMemo(() => {
    const taskList = Array.from(tasks.values());
    const userMap = new Map<string, Task[]>();

    taskList.forEach(task => {
      task.assignees.forEach(userId => {
        if (!userMap.has(userId)) {
          userMap.set(userId, []);
        }
        userMap.get(userId)?.push(task);
      });
    });

    return userMap;
  }, [tasks]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="grid grid-cols-[200px_1fr] mb-4">
          <div className="font-semibold text-gray-700">Team Member</div>
          <div className="grid grid-cols-14 gap-1">
            {days.map((day, i) => (
              <div
                key={i}
                className={cn(
                  'text-center text-sm font-medium',
                  format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                    ? 'text-blue-600'
                    : 'text-gray-500'
                )}
              >
                {format(day, 'MMM d')}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        {Array.from(users.values()).map(user => (
          <div key={user.id} className="grid grid-cols-[200px_1fr] mb-4">
            <div className="flex items-center gap-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>
            <div className="grid grid-cols-14 gap-1 relative">
              {tasksByUser.get(user.id)?.map(task => {
                if (!task.startDate || !task.endDate) return null;

                const start = new Date(task.startDate);
                const end = new Date(task.endDate);
                const startDay = Math.floor(
                  (start.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                const duration = Math.floor(
                  (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                ) + 1;

                if (startDay < 0 || startDay > 13) return null;

                return (
                  <div
                    key={task.id}
                    className={cn(
                      'absolute top-0 rounded px-2 py-1 text-xs cursor-pointer',
                      statusColors[task.status]
                    )}
                    style={{
                      left: `${(startDay / 14) * 100}%`,
                      width: `${(duration / 14) * 100}%`,
                    }}
                    onClick={() => onTaskClick(task)}
                  >
                    {task.title}
                  </div>
                );
              })}
              {days.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-8 border-r border-gray-100',
                    i === days.length - 1 && 'border-r-0'
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;