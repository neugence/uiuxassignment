import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useTaskStore = create((set, get) => ({
  tasks: [], // Array to store tasks
  currentPage: 1, // Current page number
  tasksPerPage: 5, // Number of tasks per page
  filter: 'all', // Current filter: 'all', 'completed', 'pending'
  sortBy: 'date', // Current sort: 'date', 'priority'
  theme: 'light', // Current theme: 'light' or 'dark'

  // Add a new task
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { id: uuidv4(), ...task, completed: false }],
    })),

  // Edit a task
  editTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    })),

  // Delete a task
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  // Toggle task completion
  toggleTaskCompletion: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),

  // Set the filter
  setFilter: (filter) => set({ filter }),

  // Set the sorting criteria
  setSortBy: (sortBy) => set({ sortBy }),

  // Toggle theme
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  // Reorder tasks
  reorderTasks: (startIndex, endIndex) => {
    set((state) => {
      const tasks = [...state.tasks];
      const [removed] = tasks.splice(startIndex, 1);
      tasks.splice(endIndex, 0, removed);
      return { tasks };
    });
  },

  // Get filtered and sorted tasks
  getFilteredAndSortedTasks: () => {
    const { tasks, filter, sortBy } = get();

    // Filter tasks
    let filteredTasks = tasks;
    if (filter === 'completed') {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filter === 'pending') {
      filteredTasks = tasks.filter((task) => !task.completed);
    }

    // Sort tasks
    if (sortBy === 'date') {
      filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'priority') {
      filteredTasks.sort((a, b) => a.priority - b.priority);
    }

    return filteredTasks;
  },

  // Pagination functions
  nextPage: () =>
    set((state) => ({
      currentPage: state.currentPage + 1,
    })),
  prevPage: () =>
    set((state) => ({
      currentPage: state.currentPage - 1,
    })),
  setTasksPerPage: (number) =>
    set(() => ({
      tasksPerPage: number,
    })),
}));

export default useTaskStore;