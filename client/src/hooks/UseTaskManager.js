import { useMemo, useCallback } from 'react';
import useTaskStore from '../store/taskStore';

const useTaskManager = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    filters,
    currentPage,
    itemsPerPage
  } = useTaskStore();

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    const tasksArray = Array.from(tasks.values());
    
    return tasksArray.filter(task => {
      const searchMatch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      const statusMatch = !filters.status || task.status === filters.status;
      
      const assigneeMatch = !filters.assignee || 
        (Array.isArray(task.assignee) && task.assignee.includes(filters.assignee));
      
      return searchMatch && statusMatch && assigneeMatch;
    });
  }, [tasks, filters]);

  // Memoized paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Task operations with error handling
  const handleAddTask = useCallback(async (taskData) => {
    try {
      const newTask = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...taskData
      };
      
      await addTask(newTask);
      return { success: true, task: newTask };
    } catch (error) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }
  }, [addTask]);

  const handleUpdateTask = useCallback(async (taskId, updates) => {
    try {
      await updateTask(taskId, {
        updatedAt: new Date().toISOString(),
        ...updates
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  }, [updateTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  }, [deleteTask]);

  // Task statistics
  const taskStats = useMemo(() => {
    const tasksArray = Array.from(tasks.values());
    
    return {
      total: tasksArray.length,
      byStatus: tasksArray.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {}),
      completion: {
        completed: tasksArray.filter(task => task.status === 'Ready for Launch').length,
        inProgress: tasksArray.filter(task => task.status === 'In Progress').length,
        percentage: tasksArray.length 
          ? Math.round((tasksArray.filter(task => task.status === 'Ready for Launch').length / tasksArray.length) * 100)
          : 0
      }
    };
  }, [tasks]);

  return {
    filteredTasks,
    paginatedTasks,
    totalPages,
    taskStats,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};

export default useTaskManager;