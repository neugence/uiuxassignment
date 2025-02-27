import { configureStore } from "@reduxjs/toolkit";
import  TaskSlice  from "./Slices/TaskSlice";


export default configureStore({
    reducer:{
        Tasks:TaskSlice
    }
})