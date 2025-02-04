// taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: []  // Change to an object with items array
    },
    reducers: {
        addTask: (state, action) => {
            const { title, startDate, endDate } = action.payload;
            const newTask = { id: Date.now().toString(),startDate, endDate, title, subTasks: [] };
            state.items.push(newTask);
        },
        addSubTask: (state, action) => {
            const { taskId, subTaskTitle } = action.payload;
            const task = state.items.find((task) => task.id === taskId);
            if (task) {
                const newSubTask = { id: Date.now().toString(), title: subTaskTitle,status: "pending"};
                task.subTasks.push(newSubTask);
            }
        },
        editTask: (state, action) => {
            const { taskId, title } = action.payload;
            const task = state.items.find((task) => task.id === taskId);
            if (task) {
                task.title = title;
            }
        },
        deleteTask: (state, action) => {
            const { taskId } = action.payload;
            state.items = state.items.filter((task) => task.id !== taskId);
        },
        deleteSubTask: (state, action) => {
            const { taskId, subTaskId } = action.payload;
            const task = state.items.find((task) => task.id === taskId);
            if (task) {
                task.subTasks = task.subTasks.filter((subTask) => subTask.id !== subTaskId);
            }
        },
        moveTask: (state, action) => {
            const { sourceId, destId, sourceIndex, destIndex } = action.payload;
            const sourceTask = state.items.find((task) => task.id === sourceId);
            const destTask = state.items.find((task) => task.id === destId);
            if (sourceTask && destTask) {
                const [movedTask] = sourceTask.subTasks.splice(sourceIndex, 1);
                destTask.subTasks.splice(destIndex, 0, movedTask);
            }
        },
        editSubTask: (state, action) => {
            const { taskId, subTaskId, title } = action.payload;
            const task = state.items.find((task) => task.id === taskId);
            if (task) {
                const subTask = task.subTasks.find((subTask) => subTask.id === subTaskId);
                if (subTask) {
                    subTask.title = title;
                }
            }
        },
        toggleSubTaskStatus: (state, action) => {
            const { taskId, subTaskId } = action.payload;
            const task = state.items.find((task) => task.id === taskId);
            if (task) {
                const subTask = task.subTasks.find((subTask) => subTask.id === subTaskId);
                if (subTask) {
                    subTask.status = subTask.status === "pending" ? "completed" : "pending"; // Toggle status
                }
            }
        },
        assignMemberToSubTask: (state, action) => {
            const { taskId, subTaskId, member } = action.payload;
            const task = state.items.find((task) => task.id === taskId);
            if (task) {
                const subTask = task.subTasks.find((subTask) => subTask.id === subTaskId);
                if (subTask) {
                    if (!subTask.assignee.includes(member)) {
                        subTask.assignee.push(member); // Add the new member
                    }
                }
            }
        },
        
    },
});

export const { 
    addTask, 
    addSubTask, 
    editTask, 
    deleteTask, 
    deleteSubTask, 
    moveTask,
    editSubTask,
    toggleSubTaskStatus,
    assignMemberToSubTask 
} = taskSlice.actions;
export default taskSlice.reducer;