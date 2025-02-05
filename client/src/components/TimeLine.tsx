import React, { useMemo, useState } from 'react';
import { format, eachDayOfInterval, startOfWeek, addWeeks, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useTaskStore from '../store/useTaskStore';
import { Task } from '../types/task';

const STATUS_COLORS = {
  backlog: 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  paused: 'bg-red-500',
  completed: 'bg-green-500',
  default: 'bg-gray-500',
};

export default function TimeLine() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks } = useTaskStore();

  const dates = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = addWeeks(start, 2);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const tasksByAssignee = useMemo(() => {
    const grouped = new Map();
    tasks.forEach(task => {
      task.assignees.forEach(assignee => {
        if (!grouped.has(assignee)) grouped.set(assignee, []);
        grouped.get(assignee).push(task);
      });
    });
    return grouped;
  }, [tasks]);

  const navigateWeek = (direction) => {
    setCurrentDate(current => addWeeks(current, direction === 'prev' ? -1 : 1));
  };

  const getTaskPosition = (task) => {
    const taskStart = parseISO(task.startDate);
    const taskEnd = parseISO(task.endDate);
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    if (!isWithinInterval(taskStart, { start: firstDate, end: lastDate }) &&
        !isWithinInterval(taskEnd, { start: firstDate, end: lastDate })) {
      return null;
    }

    const startIndex = dates.findIndex(date => date >= taskStart);
    const endIndex = dates.findIndex(date => date >= taskEnd);
    return {
      left: `${(startIndex / dates.length) * 100}%`,
      width: `${((endIndex - startIndex + 1) / dates.length) * 100}%`,
    };
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigateWeek('prev')} className="p-2 bg-gray-700 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            {format(dates[0], 'MMM d')} - {format(dates[dates.length - 1], 'MMM d, yyyy')}
          </span>
          <button onClick={() => navigateWeek('next')} className="p-2 bg-gray-700 rounded-full">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-14 border-b border-gray-600 mb-4">
          {dates.map(date => (
            <div key={date.toISOString()} className="text-sm text-gray-300 text-center">
              {format(date, 'EEE d')}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {Array.from(tasksByAssignee.entries()).map(([assignee, assigneeTasks]) => (
            <div key={assignee} className="relative">
              <div className="text-sm font-medium text-gray-400 mb-2">
                {assignee}
              </div>
              <div className="h-8 relative">
                {assigneeTasks.map(task => {
                  const position = getTaskPosition(task);
                  if (!position) return null;
                  return (
                    <div
                      key={task.id}
                      className={`absolute h-6 rounded-full px-2 text-sm flex items-center text-white shadow-md ${STATUS_COLORS[task.status] || STATUS_COLORS.default}`}
                      style={position}
                      title={`${task.title} (${format(parseISO(task.startDate), 'MMM d')} - ${format(parseISO(task.endDate), 'MMM d')})`}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 grid grid-cols-14 pointer-events-none">
          {dates.map(date => (
            <div key={date.toISOString()} className="border-1 border-gray-600 h-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
