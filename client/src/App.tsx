import React, { useState } from 'react';
import { LayoutGrid, Calendar, BarChart2 } from 'lucide-react';
import TaskBoard from './components/TaskBoard';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';

type View = 'board' | 'timeline' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('dashboard');

  const content = (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Task Manager</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('dashboard')}
            className={`p-2 rounded-md flex items-center gap-2 ${
              view === 'dashboard'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BarChart2 size={20} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setView('board')}
            className={`p-2 rounded-md flex items-center gap-2 ${
              view === 'board'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LayoutGrid size={20} />
            <span>Board</span>
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`p-2 rounded-md flex items-center gap-2 ${
              view === 'timeline'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar size={20} />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {view === 'dashboard' && <Dashboard />}
      {view === 'board' && <TaskBoard />}
      {view === 'timeline' && <Timeline />}
    </div>
  );

  return <Layout>{content}</Layout>;
}