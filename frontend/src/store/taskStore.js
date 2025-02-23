import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const url = 'https://task-manager-xnd1.onrender.com';

const useTaskStore = create((set, get) => ({
  tasks: [],
  users: [],
  fetchTasks: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ tasks: response.data.tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },
  fetchUsers: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/api/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ users: response.data });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },
  addTask: async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      // Get current tasks in the same status column
      const tasksInColumn = get().tasks.filter(t => t.status === newTask.status);
      
      // Calculate new order (append to end of column)
      const maxOrder = tasksInColumn.length > 0 
        ? Math.max(...tasksInColumn.map(t => t.order))
        : 0;
      const order = maxOrder + 1000;

      const taskWithOrder = { ...newTask, order };
      
      const response = await axios.post(`${url}/api/tasks`, taskWithOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      set((state) => ({ tasks: [...state.tasks, response.data] }));
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  },

  updateTask: async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const currentTask = get().tasks.find(t => t._id === updatedTask._id);
      
      // If status changed, calculate new order
      if (currentTask.status !== updatedTask.status) {
        const tasksInNewColumn = get().tasks.filter(t => t.status === updatedTask.status);
        const maxOrder = tasksInNewColumn.length > 0 
          ? Math.max(...tasksInNewColumn.map(t => t.order))
          : 0;
        updatedTask.order = maxOrder + 1000;
      }

      const response = await axios.put(`${url}/api/tasks/${updatedTask._id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === updatedTask._id ? response.data : task
        ),
      }));
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },
  deleteTask: async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      }));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },
  reorderTask: async (taskId, newOrder, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${url}/api/tasks/${taskId}/reorder`, 
        { order: newOrder, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId 
            ? { ...task, order: newOrder, status }
            : task
        )
      }));
    } catch (error) {
      console.error('Error reordering task:', error);
    }
  }
}));

export default useTaskStore;