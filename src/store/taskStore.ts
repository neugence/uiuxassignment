import { create } from 'zustand';
import { Task, TaskStatus, User } from '../types/task';

interface TaskState {
  tasks: Map<string, Task>;
  users: Map<string, User>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, taskIds: string[]) => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
  },
];

const useTaskStore = create<TaskState>((set) => ({
  tasks: new Map(),
  users: new Map(mockUsers.map(user => [user.id, user])),
  
  addTask: (task) => set((state) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newTask = {
      ...task,
      id,
      assignees: [mockUsers[0].id], // Assign to first user by default
      createdAt: now,
      updatedAt: now,
    };
    const newTasks = new Map(state.tasks);
    newTasks.set(id, newTask);
    return { tasks: newTasks };
  }),

  updateTask: (id, updates) => set((state) => {
    const newTasks = new Map(state.tasks);
    const task = newTasks.get(id);
    if (!task) return state;
    
    newTasks.set(id, {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return { tasks: newTasks };
  }),

  deleteTask: (id) => set((state) => {
    const newTasks = new Map(state.tasks);
    newTasks.delete(id);
    return { tasks: newTasks };
  }),

  moveTask: (taskId, status) => set((state) => {
    const newTasks = new Map(state.tasks);
    const task = newTasks.get(taskId);
    if (!task) return state;
    
    newTasks.set(taskId, {
      ...task,
      status,
      updatedAt: new Date().toISOString(),
    });
    return { tasks: newTasks };
  }),

  reorderTasks: (status, taskIds) => set((state) => {
    const newTasks = new Map(state.tasks);
    // Implementation for reordering will be added with DnD
    return { tasks: newTasks };
  }),
}));

export default useTaskStore;