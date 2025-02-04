
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { TASK_STATUS } from '../constants/taskConstants';

// const useTaskStore = create(
//   persist(
//     (set, get) => ({
//       // Store tasks as an object instead of Map
//       tasks: {},
//       filters: {
//         search: '',
//         status: '',
//         assignee: '',
//       },
//       currentPage: 1,
//       itemsPerPage: 10,

//       // Add a new task
//       addTask: (task) => {
//         set((state) => ({
//           tasks: {
//             ...state.tasks,
//             [task.id]: {
//               ...task,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             }
//           }
//         }));
//       },

//       // Update an existing task
//       updateTask: (taskId, updates) => {
//         set((state) => {
//           if (!state.tasks[taskId]) return state;
          
//           return {
//             tasks: {
//               ...state.tasks,
//               [taskId]: {
//                 ...state.tasks[taskId],
//                 ...updates,
//                 updatedAt: new Date().toISOString(),
//               }
//             }
//           };
//         });
//       },

//       // Delete a task
//       deleteTask: (taskId) => {
//         set((state) => {
//           const newTasks = { ...state.tasks };
//           delete newTasks[taskId];
//           return { tasks: newTasks };
//         });
//       },

//       // Update task status
//       updateTaskStatus: (taskId, newStatus) => {
//         set((state) => {
//           if (!state.tasks[taskId]) return state;

//           return {
//             tasks: {
//               ...state.tasks,
//               [taskId]: {
//                 ...state.tasks[taskId],
//                 status: newStatus,
//                 updatedAt: new Date().toISOString(),
//               }
//             }
//           };
//         });
//       },

//       // Set filters
//       setFilters: (newFilters) => {
//         set((state) => ({
//           filters: { ...state.filters, ...newFilters },
//           currentPage: 1,
//         }));
//       },

//       // Update pagination
//       setCurrentPage: (page) => set({ currentPage: page }),
//       setItemsPerPage: (items) => set({ itemsPerPage: items }),

//       // Clear all filters
//       clearFilters: () => {
//         set({
//           filters: {
//             search: '',
//             status: '',
//             assignee: '',
//           },
//           currentPage: 1,
//         });
//       },

//       // Helper function to get tasks as array
//       getTasksArray: () => {
//         const state = get();
//         return Object.values(state.tasks);
//       },

//       // Helper function to get task by id
//       getTask: (taskId) => {
//         const state = get();
//         return state.tasks[taskId];
//       }
//     }),
//     {
//       name: 'task-storage',
//       getStorage: () => localStorage,
//     }
//   )
// );

// export default useTaskStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TASK_STATUS } from '../constants/taskConstants';

 const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: {},
      filters: {
        search: '',
        status: '',
        assignee: '',
      },
      currentPage: 1,
      itemsPerPage: 10,

      // Add a new task
      addTask: (task) => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            [task.id]: {
              ...task,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        }));
      },

      // Get filtered tasks
      getFilteredTasks: () => {
        const state = get();
        const tasksArray = Object.values(state.tasks);
        const { search, status, assignee } = state.filters;

        return tasksArray.filter(task => {
          const searchMatch = search.trim() === '' || 
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase());

          const statusMatch = !status || task.status === status;
          
          const assigneeMatch = !assignee || 
            (task.assignee && task.assignee.includes(assignee));

          return searchMatch && statusMatch && assigneeMatch;
        });
      },

      // Set search filter
      setSearchFilter: (searchTerm) => {
        set((state) => ({
          filters: {
            ...state.filters,
            search: searchTerm
          },
          currentPage: 1 // Reset to first page on search
        }));
      },

      // Other existing methods...
      updateTask: (taskId, updates) => {
        set((state) => {
          if (!state.tasks[taskId]) return state;
          
          return {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...state.tasks[taskId],
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            }
          };
        });
      },

      updateTaskStatus: (taskId, newStatus) => {
        set((state) => {
          if (!state.tasks[taskId]) return state;

          return {
            tasks: {
              ...state.tasks,
              [taskId]: {
                ...state.tasks[taskId],
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            }
          };
        });
      },

      // Clear all filters
      clearFilters: () => {
        set({
          filters: {
            search: '',
            status: '',
            assignee: '',
          },
          currentPage: 1,
        });
      },
    }),
    {
      name: 'task-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useTaskStore