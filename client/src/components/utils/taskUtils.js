// taskUtils.js
import { formatDate, formatDuration } from './dateUtils';

/**
 * Generate a unique task ID
 */
export const generateTaskId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate task completion percentage
 */
export const calculateTaskProgress = (task) => {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === 'Ready for Launch' ? 100 : 0;
  }

  const completedSubtasks = task.subtasks.filter(
    subtask => subtask.status === 'Ready for Launch'
  ).length;

  return Math.round((completedSubtasks / task.subtasks.length) * 100);
};

/**
 * Sort tasks by different criteria
 */
export const sortTasks = (tasks, sortBy = 'dueDate', order = 'asc') => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return order === 'asc'
          ? new Date(a.endDate) - new Date(b.endDate)
          : new Date(b.endDate) - new Date(a.endDate);
      
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return order === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      
      case 'status':
        const statusOrder = {
          'Backlog': 1,
          'In Progress': 2,
          'Paused': 3,
          'Ready for Launch': 4
        };
        return order === 'asc'
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      
      default:
        return 0;
    }
  });
};

/**
 * Group tasks by different criteria
 */
export const groupTasks = (tasks, groupBy = 'status') => {
  return tasks.reduce((groups, task) => {
    const key = task[groupBy];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(task);
    return groups;
  }, {});
};

/**
 * Format task for display
 */
export const formatTaskForDisplay = (task) => {
  return {
    ...task,
    formattedStartDate: formatDate(task.startDate),
    formattedEndDate: formatDate(task.endDate),
    duration: formatDuration(task.startDate, task.endDate),
    progress: calculateTaskProgress(task),
  };
};

/**
 * Validate task data
 */
export const validateTask = (taskData) => {
  const errors = {};

  if (!taskData.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!taskData.status) {
    errors.status = 'Status is required';
  }

  if (!taskData.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!taskData.endDate) {
    errors.endDate = 'End date is required';
  }

  if (taskData.startDate && taskData.endDate) {
    if (new Date(taskData.endDate) < new Date(taskData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get task statistics
 */
export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'Ready for Launch').length;
  const inProgress = tasks.filter(task => task.status === 'In Progress').length;
  const paused = tasks.filter(task => task.status === 'Paused').length;
  const backlog = tasks.filter(task => task.status === 'Backlog').length;

  return {
    total,
    completed,
    inProgress,
    paused,
    backlog,
    completionRate: total ? Math.round((completed / total) * 100) : 0
  };
};

/**
 * Search tasks
 */
export const searchTasks = (tasks, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      task.assignee.some(user => user.toLowerCase().includes(term))
    );
  });
};

/**
 * Filter tasks
 */
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    const statusMatch = !filters.status || task.status === filters.status;
    const assigneeMatch = !filters.assignee || task.assignee.includes(filters.assignee);
    const priorityMatch = !filters.priority || task.priority === filters.priority;
    
    return statusMatch && assigneeMatch && priorityMatch;
  });
};