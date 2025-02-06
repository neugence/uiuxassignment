import React, { useMemo } from 'react';
import { BarChart, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import useTaskStore from '../store/useTaskStore';
import { format } from 'date-fns';

export default function Dashboard() {
  const { tasks } = useTaskStore();
  
  const stats = useMemo(() => {
    const taskArray = Array.from(tasks.values());
    const total = taskArray.length;
    
    return {
      total,
      completed: taskArray.filter(t => t.status === 'completed').length,
      inProgress: taskArray.filter(t => t.status === 'in-progress').length,
      paused: taskArray.filter(t => t.status === 'paused').length,
      backlog: taskArray.filter(t => t.status === 'backlog').length,
      averageProgress: Math.round(
        taskArray.reduce((acc, task) => acc + task.progress, 0) / total || 0
      ),
      upcomingDeadlines: taskArray
        .filter(t => t.endDate && new Date(t.endDate) > new Date())
        .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
        .slice(0, 5),
    };
  }, [tasks]);

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: BarChart,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Paused',
      value: stats.paused,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-gray-800 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-100">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color} bg-opacity-10`}>
                <card.icon
                  className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {stats.averageProgress}% Complete
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block">
                  {stats.total} Tasks
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${stats.averageProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {stats.upcomingDeadlines.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={16} />
                  <span className="text-sm font-medium">{task.title}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(task.endDate!), 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}