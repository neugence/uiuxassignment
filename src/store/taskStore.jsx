import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Create initial state
const initialState = {
  tasks: [],
  searchQuery: '',
  filterPriority: 'all'
};

export const useTaskStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Add task with persistence
      addTask: (task) => set((state) => {
        const newTask = { ...task, id: Date.now().toString() };
        return { tasks: [...state.tasks, newTask] };
      }),

      // Delete task with persistence
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),

      // Update task with persistence
      updateTask: (taskId, updatedTask) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      })),

      // Move task between columns with persistence
      moveTask: (taskId, newStatus) => set((state) => ({
        tasks: state.tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      })),

      // Search and filter functions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterPriority: (priority) => set({ filterPriority: priority }),

      // Reorder tasks within or between columns
      reorderTasks: (sourceIndex, destinationIndex, sourceStatus, destinationStatus) => 
        set((state) => {
          const newTasks = [...state.tasks];
          const sourceTasks = newTasks.filter(task => task.status === sourceStatus);
          const [movedTask] = sourceTasks.splice(sourceIndex, 1);
          
          if (sourceStatus === destinationStatus) {
            sourceTasks.splice(destinationIndex, 0, movedTask);
            return {
              tasks: newTasks.map(task => 
                task.status === sourceStatus ? sourceTasks.shift() : task
              )
            };
          } else {
            movedTask.status = destinationStatus;
            return {
              tasks: [...newTasks.filter(t => t.id !== movedTask.id), movedTask]
            };
          }
        }),

      // Clear all tasks (useful for testing)
      clearTasks: () => set({ tasks: [] }),

      // Reset to initial state
      resetStore: () => set(initialState)
    }),
    {
      name: 'task-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      version: 1, // version for potential future migrations
      partialize: (state) => ({ 
        tasks: state.tasks // only persist tasks array
      })
    }
  )
);