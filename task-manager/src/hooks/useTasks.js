import { create } from 'zustand';

export const useTasks = create((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
}));