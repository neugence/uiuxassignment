import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from '../types/task';

interface TaskStore {
  tasks: Map<string, Task>;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, oldIndex: number, newIndex: number) => void;
  updateProgress: (taskId: string, progress: number) => void;
}

const initialTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'UI Kit Update',
    description: 'Revise design system components',
    status: 'backlog',
    assignees: ['John Smith'],
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Company Roadmap',
    description: 'Create quarterly strategic plan',
    status: 'backlog',
    assignees: ['Jane'],
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Communication Plan',
    description: 'Develop team communication strategy',
    status: 'in-progress',
    assignees: ['Mike'],
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    progress: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'API Documentation',
    description: 'Update technical documentation',
    status: 'paused',
    assignees: ['Jane', 'Mike'],
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    progress: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Main page update',
    description: 'Implement new hero section',
    status: 'in-progress',
    assignees: ['John Smith', 'Sarah Chen'],
    startDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    progress: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Analytics Dashboard',
    description: 'Create new analytics features',
    status: 'in-progress',
    assignees: ['Mike Wilson', 'Jane Cooper'],
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    progress: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const useTaskStore = create<TaskStore>((set) => ({
  tasks: new Map(initialTasks.map(task => [task.id, task])),
  
  addTask: (taskData) => set((state) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { 
      tasks: new Map(state.tasks).set(newTask.id, newTask)
    };
  }),

  moveTask: (taskId, newStatus) => set((state) => {
    const updatedTasks = new Map(state.tasks);
    const task = updatedTasks.get(taskId);
    
    if (task) {
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
    }
    
    return { tasks: updatedTasks };
  }),

  reorderTasks: (status, oldIndex, newIndex) => set((state) => {
    const statusTasks = Array.from(state.tasks.values())
      .filter(task => task.status === status);
    
    const reorderedTasks = arrayMove(statusTasks, oldIndex, newIndex);
    const updatedTasks = new Map(state.tasks);
    
    reorderedTasks.forEach(task => {
      updatedTasks.set(task.id, task);
    });
    
    return { tasks: updatedTasks };
  }),

  updateProgress: (taskId, progress) => set((state) => {
    const updatedTasks = new Map(state.tasks);
    const task = updatedTasks.get(taskId);
    
    if (task) {
      task.progress = progress;
      task.updatedAt = new Date().toISOString();
    }
    
    return { tasks: updatedTasks };
  })
}));

export default useTaskStore;
