import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    task: [],
}

const taskSlice = createSlice({
    name: "taskSlice",
    initialState,
    reducers: {}
})

export default taskSlice.reducer