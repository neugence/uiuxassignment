export type TaskStatus = 'backlog' | 'in-progress' | 'paused' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignees: string[];
  startDate?: string;
  endDate?: string;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface TaskStore {
  tasks: Map<string, Task>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, startIndex: number, endIndex: number) => void;
  updateProgress: (taskId: string, progress: number) => void;
}