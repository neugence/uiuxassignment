import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const Localtasks = JSON.parse(localStorage.getItem('Tasks')) ?? []
export const TaskSlice = createSlice({
  name: 'Tasks',
  initialState: {
    tasks: Localtasks
  },
  reducers: {
    addTask: (state, task) => {

      // console.log(state.tasks)
      if (state.tasks.length > 0) {
        if (state.tasks.some(present_task => present_task.title == task.payload.title)) {
          toast.error('Task Exist')
          return
        }
      }

      state.tasks.push(task.payload)
      localStorage.setItem('Tasks', JSON.stringify(state.tasks))
      toast.success('Task Added')

    },
    updateTask: (state, task) => {
    
        // console.log(JSON.parse(JSON.stringify(state.tasks)),task.payload)
        const index=state.tasks.findIndex(present_task => present_task.title == task.payload.old.title)
        
        state.tasks.splice(index, 1, task.payload.New)
        localStorage.setItem('Tasks', JSON.stringify(state.tasks))
        toast.success('Task Updated')

    }
  }
})
export const { addTask, updateTask } = TaskSlice.actions

export default TaskSlice.reducer