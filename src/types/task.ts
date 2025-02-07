export type TaskStatus = 'backlog' | 'in-progress' | 'paused' | 'ready';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignees: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}