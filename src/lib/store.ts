import { create } from 'zustand';
import { Task } from '../types/task';
import { tasks } from '../constants/hardCodedTasks';
import { arrayMove } from '@dnd-kit/sortable';

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
  deleteTask: (taskId: string) => void;
  columns: Column[];
  addColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;
}

// Add a new utility function to generate a clean column ID
const generateColumnId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: tasks,
  addTask: (task: Task) => 
    set((state: TaskState) => ({ tasks: [...state.tasks, task] })),
  updateTaskStatus: (taskId: string, newStatus: string) =>
    set((state: TaskState) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    })),
  updateTaskTitle: (taskId: string, newTitle: string) =>
    set((state: TaskState) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      ),
    })),
  reorderTasks: (activeId: string, overId: string) =>
    set((state: TaskState) => {
      const oldIndex = state.tasks.findIndex((task: Task) => task.id === activeId);
      const newIndex = state.tasks.findIndex((task: Task) => task.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return state;
      
      // Only allow reordering within the same status
      if (state.tasks[oldIndex].status !== state.tasks[newIndex].status) {
        return state;
      }
      
      return {
        tasks: arrayMove(state.tasks, oldIndex, newIndex),
      };
    }),
  updateTask: (taskId: string, updatedTask: Task) =>
    set((state: TaskState) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === taskId ? updatedTask : task
      ),
    })),
  deleteTask: (taskId: string) =>
    set((state: TaskState) => ({
      tasks: state.tasks.filter((task: Task) => task.id !== taskId),
    })),
  columns: [
    { id: 'general-info', title: 'General Information' },
    { id: 'backlog', title: 'Backlog' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'paused', title: 'Paused' },
    { id: 'completed', title: 'Ready for Launch' },
  ],
  addColumn: (column: Column) =>
    set((state: TaskState) => ({
      columns: [...state.columns, {
        ...column,
        id: generateColumnId(column.title)
      }]
    })),
  deleteColumn: (columnId: string) =>
    set((state: TaskState) => ({
      columns: state.columns.filter((column: Column) => column.id !== columnId),
      tasks: state.tasks.filter((task: Task) => task.status !== columnId),
    })),
}));