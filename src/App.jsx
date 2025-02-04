import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from 'react-router-dom';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import MembersDashboard from './components/MembersDashboard';
import { Plus, LayoutDashboard, ListTodo } from 'lucide-react';
import { GlobalProvider, GlobalContext } from './context/GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

function AppContent() {
  const { isModalOpen, selectedTask, openModal, closeModal } =
    useContext(GlobalContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Task Manager
                </h1>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <NavLink
                    to="/board"
                    className={({ isActive }) =>
                      `flex items-center px-2 py-1 rounded ${
                        isActive
                          ? 'text-gray-900 bg-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    <ListTodo size={16} className="mr-1" />
                    <span className="text-sm sm:text-base">Board</span>
                  </NavLink>
                  <NavLink
                    to="/timeline"
                    className={({ isActive }) =>
                      `flex items-center px-2 py-1 rounded ${
                        isActive
                          ? 'text-gray-900 bg-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`
                    }
                  >
                    <LayoutDashboard size={16} className="mr-1" />
                    <span className="text-sm sm:text-base">Timeline</span>
                  </NavLink>
                </div>
              </div>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2 md:mt-0"
              >
                <Plus size={18} className="mr-1" />
                <span className="text-sm sm:text-base">Add Task</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/board" replace />} />
            <Route path="/board" element={<TaskBoard />} />
            <Route path="/timeline" element={<MembersDashboard />} />
          </Routes>
        </main>

        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          task={selectedTask}
        />
      </div>
    </Router>
  );
}

export default App;
