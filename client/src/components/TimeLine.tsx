import React, { useMemo, useState, useRef, useEffect } from 'react';
import { format, eachDayOfInterval, startOfWeek, addWeeks, isWithinInterval, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import useTaskStore from '../store/useTaskStore';
import { Task } from '../types/task';

const TASK_COLORS = {
  'Review': 'bg-rose-100 text-rose-800 border-l-4 border-rose-400',
  'Main page': 'bg-sky-100 text-sky-800 border-l-4 border-sky-400',
  'Notifications': 'bg-violet-100 text-violet-800 border-l-4 border-violet-400',
  'Profile': 'bg-indigo-100 text-indigo-800 border-l-4 border-indigo-400',
  'Analytics': 'bg-emerald-100 text-emerald-800 border-l-4 border-emerald-400',
  'Specs': 'bg-amber-100 text-amber-800 border-l-4 border-amber-400',
  'Optimization': 'bg-cyan-100 text-cyan-800 border-l-4 border-cyan-400',
  'Refactoring': 'bg-fuchsia-100 text-fuchsia-800 border-l-4 border-fuchsia-400',
  'Images': 'bg-lime-100 text-lime-800 border-l-4 border-lime-400',
  'Blog post': 'bg-orange-100 text-orange-800 border-l-4 border-orange-400',
  'Workspaces': 'bg-teal-100 text-teal-800 border-l-4 border-teal-400',
  'QA': 'bg-pink-100 text-pink-800 border-l-4 border-pink-400',
  'Main page update': 'bg-purple-100 text-purple-800 border-l-4 border-purple-400',
  'New feature': 'bg-green-100 text-green-800 border-l-4 border-green-400',
  default: 'bg-gray-200 text-gray-800 border-l-4 border-gray-900'
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export default function Timeline() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { tasks } = useTaskStore();

  const dates = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = addWeeks(start, Math.round(2 * zoom));
    return eachDayOfInterval({ start, end });
  }, [currentDate, zoom]);

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

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(current => addWeeks(current, direction === 'prev' ? -1 : 1));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(current => {
      const newZoom = direction === 'in' ? current + 0.5 : current - 0.5;
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (timelineRef.current?.offsetLeft || 0));
    setScrollLeft(timelineRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (timelineRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const getTaskPosition = (task: Task) => {
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

  const getTaskColor = (title: string) => {
    const key = Object.keys(TASK_COLORS).find(k => title.toLowerCase().includes(k.toLowerCase()));
    return TASK_COLORS[key || 'default'];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-xl font-semibold text-gray-800">Members Dashboard</h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleZoom('out')}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => handleZoom('in')}
                className="p-1.5 rounded-lg hover:bg-gray-100"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Group by:</span>
              <select className="text-sm border rounded-md px-2 py-1">
                <option>Member</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          ref={timelineRef}
          className="relative min-w-max p-6"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <div className="grid border-b border-gray-100 mb-4 sticky top-0 bg-white z-10"
               style={{ gridTemplateColumns: `200px repeat(${dates.length}, minmax(${100 * zoom}px, 1fr))` }}>
            <div></div>
            {dates.map(date => (
              <div key={date.toISOString()} 
                   className="text-sm text-gray-500 pb-2 text-center">
                <div className="font-medium">{format(date, 'EEE')}</div>
                <div>{format(date, 'd')}</div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {Array.from(tasksByAssignee.entries()).map(([assignee, assigneeTasks]) => (
              <div key={assignee} 
                   className="relative grid" 
                   style={{ gridTemplateColumns: `200px repeat(${dates.length}, minmax(${100 * zoom}px, 1fr))` }}>
                <div className="flex items-center gap-3 px-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {assignee.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {assignee}
                  </span>
                </div>
                <div className="col-span-full col-start-2 relative -mt-8">
                  {assigneeTasks.map((task: Task) => {
                    const position = getTaskPosition(task);
                    if (!position) return null;
                    return (
                      <div
                        key={task.id}
                        className={`absolute h-8 rounded-md px-3 text-sm flex items-center shadow-sm transition-all hover:shadow-md ${getTaskColor(task.title)}`}
                        style={{
                          ...position,
                          top: '1rem'
                        }}
                        title={`${task.title} (${format(parseISO(task.startDate), 'MMM d')} - ${format(parseISO(task.endDate), 'MMM d')})`}
                      >
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 grid pointer-events-none"
               style={{ gridTemplateColumns: `200px repeat(${dates.length}, minmax(${100 * zoom}px, 1fr))` }}>
            <div></div>
            {dates.map(date => (
              <div key={date.toISOString()} className="border-l border-gray-100 h-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
