import { create } from 'zustand';
import { generateMockTasks } from '../utils/mockData';

const useTaskStore = create((set, get) => ({
  tasks: new Map(generateMockTasks(50).map(task => [task.id, task])),
  columns: [
    'General Information',
    'Backlog',
    'In progress',
    'Paused',
    'Ready for launch',
  ],

  addTask: task =>
    set(state => {
      const newTasks = new Map(state.tasks);
      newTasks.set(task.id, task);
      return { tasks: newTasks };
    }),

  updateTask: (taskId, updates) =>
    set(state => {
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(taskId);
      if (task) {
        newTasks.set(taskId, { ...task, ...updates });
      }
      return { tasks: newTasks };
    }),

  moveTask: (taskId, destinationColumn) =>
    set(state => {
      const newTasks = new Map(state.tasks);
      const task = newTasks.get(taskId);
      if (task) {
        newTasks.set(taskId, { ...task, status: destinationColumn });
      }
      return { tasks: newTasks };
    }),

  getTasksByColumn: column => {
    const tasks = Array.from(get().tasks.values());
    return tasks
      .filter(task => task.status === column)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  reorderTasks: (column, startIndex, endIndex) =>
    set(state => {
      const columnTasks = Array.from(state.tasks.values())
        .filter(task => task.status === column)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      if (startIndex === endIndex) return state;

      const newTasks = new Map(state.tasks);
      const [movedTask] = columnTasks.splice(startIndex, 1);

      if (!movedTask) return state;

      columnTasks.splice(endIndex, 0, movedTask);

      // Update order for all tasks in the column
      columnTasks.forEach((task, index) => {
        const existingTask = newTasks.get(task.id);
        if (existingTask) {
          newTasks.set(task.id, { ...existingTask, order: index });
        }
      });

      return { tasks: newTasks };
    }),
}));

export default useTaskStore;
