import { useState, useMemo, useCallback } from 'react';
import useTaskStore from './store/taskStore';
import TaskColumn from './components/TaskColumn';
import TaskModal from './components/TaskModal';
import Timeline from './components/Timeline';
import { Task, TaskStatus } from './types/task';
import { Search, LayoutGrid, Calendar } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { cn } from './utils/cn';

type ViewMode = 'board' | 'timeline';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>();
  
  const { tasks, moveTask, deleteTask } = useTaskStore();

  const filteredTasks = useMemo(() => {
    const tasksArray = Array.from(tasks.values());
    if (!searchQuery) return tasksArray;
    
    const query = searchQuery.toLowerCase();
    return tasksArray.filter(task => 
      task.title.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  const groupedTasks = useMemo(() => {
    return {
      backlog: filteredTasks.filter(t => t.status === 'backlog'),
      'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
      paused: filteredTasks.filter(t => t.status === 'paused'),
      ready: filteredTasks.filter(t => t.status === 'ready'),
    };
  }, [filteredTasks]);

  const handleAddTask = useCallback((status?: TaskStatus) => {
    setSelectedTask(undefined);
    setDefaultStatus(status);
    setIsModalOpen(true);
  }, []);

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(undefined);
    setDefaultStatus(undefined);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      moveTask(taskId, newStatus);
    }
  }, [moveTask]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      moveTask(taskId, newStatus);
    }
  }, [moveTask]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg self-start">
                <button
                  onClick={() => setViewMode('board')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'board' ? 'bg-white shadow' : 'hover:bg-white/50'
                  )}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'timeline' ? 'bg-white shadow' : 'hover:bg-white/50'
                  )}
                >
                  <Calendar size={20} />
                </button>
              </div>
              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
  {viewMode === 'board' ? (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
        <TaskColumn
          title="Backlog"
          status="backlog"
          tasks={groupedTasks.backlog}
          onAddTask={() => handleAddTask('backlog')}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={groupedTasks['in-progress']}
          onAddTask={() => handleAddTask('in-progress')}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          title="Paused"
          status="paused"
          tasks={groupedTasks.paused}
          onAddTask={() => handleAddTask('paused')}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          title="Ready for Launch"
          status="ready"
          tasks={groupedTasks.ready}
          onAddTask={() => handleAddTask('ready')}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
      </div>
    </DndContext>
  ) : (
    <Timeline onTaskClick={handleTaskClick} />
  )}
</main>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}

export default App;