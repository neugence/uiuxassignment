import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { ToastContainer } from "react-toastify";
import Authprovider from "./auth/AuthProvider";
import { Provider } from "react-redux";
import store from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="bg-gray-100 font">
      <Provider store={store}>
        <ToastContainer />
        <Authprovider>
          <RouterProvider router={router}></RouterProvider>
        </Authprovider>
      </Provider>
    </div>
  </StrictMode>
);
