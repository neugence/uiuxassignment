import React, { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { MemberDashboard } from './components/MemberDashboard';
import { LayoutGrid, Users, PlusCircle } from 'lucide-react';
import { useViewStore } from './store/viewStore';
import './App.css';

const App = () => {
  const { view, setView } = useViewStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TopBarButtons = () => (
    <div className="absolute top-6 right-8 z-10 flex flex-col gap-2">
      <button
        onClick={() => setView(view === 'kanban' ? 'members' : 'kanban')}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/90 text-gray-200 text-sm rounded-lg 
          shadow-lg hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm
          hover:border-purple-500/50 group"
      >
        {view === 'kanban' ? (
          <>
            <Users className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
            <span className="text-gray-300 group-hover:text-gray-200">Member View</span>
          </>
        ) : (
          <>
            <LayoutGrid className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
            <span className="text-gray-300 group-hover:text-gray-200">Kanban View</span>
          </>
        )}
      </button>
      
      {/* ...rest of your buttons... */}
    </div>
  );

  return (
    <div className="relative">
      <TopBarButtons />
      {view === 'kanban' ? <KanbanBoard /> : <MemberDashboard />}
      {/* ...rest of your component... */}
    </div>
  );
};

export default App;
