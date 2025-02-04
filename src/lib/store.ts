import { create } from 'zustand';
import { Task } from '../types/task';
import { tasks } from '../constants/hardCodedTasks';
import { arrayMove } from '@dnd-kit/sortable';
import zukeeper from 'zukeeper';

interface Column {
  id: string;
  title: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
  updateTaskTitle: (taskId: string, newTitle: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  updateTask: (taskId: string, updatedTask: Task) => void;
  columns: Column[];
  addColumn: (column: Column) => void;
}

// Add a new utility function to generate a clean column ID
const generateColumnId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Add type declaration for window
declare global {
  interface Window {
    store: ReturnType<typeof useTaskStore>;
  }
}

export const useTaskStore = create(zukeeper((set) => ({
  tasks: tasks,
  addTask: (task) => 
    set((state) => ({ tasks: [...state.tasks, task] })),
  updateTaskStatus: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    })),
  updateTaskTitle: (taskId, newTitle) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      ),
    })),
  reorderTasks: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.tasks.findIndex((task) => task.id === activeId);
      const newIndex = state.tasks.findIndex((task) => task.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return state;
      
      // Only allow reordering within the same status
      if (state.tasks[oldIndex].status !== state.tasks[newIndex].status) {
        return state;
      }
      
      return {
        tasks: arrayMove(state.tasks, oldIndex, newIndex),
      };
    }),
  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? updatedTask : task
      ),
    })),
  columns: [
    { id: 'general-info', title: 'General Information' },
    { id: 'backlog', title: 'Backlog' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'paused', title: 'Paused' },
    { id: 'completed', title: 'Ready for Launch' },
  ],
  addColumn: (column) =>
    set((state) => ({
      columns: [...state.columns, {
        ...column,
        id: generateColumnId(column.title) // Use title-based ID instead of timestamp
      }]
    })),
})));

// Make the store available on the window object for Zukeeper
window.store = useTaskStore;