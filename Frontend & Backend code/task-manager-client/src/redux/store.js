import { configureStore } from "@reduxjs/toolkit";
import taskApi from "./baseApi/baseApi";

const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      taskApi.middleware
    ),
});

export default store