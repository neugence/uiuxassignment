import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../home/Home";
import Login from "../authentication/Login";
import Signup from "../authentication/Signup";
import Dashboard from "../dashboard/Dashboard";
import ToDo from "../dashboardRoutes/ToDo";
import ManageTasks from "../dashboardRoutes/ManageTasks";
import EditTask from "../dashboardRoutes/EditTask";
import PrivateRoute from "./PrivateRoute";
import Members from "../dashboardRoutes/Members";
import Overview from "../dashboardRoutes/Overview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/todo-list",
        element: (
          <PrivateRoute>
            <ToDo></ToDo>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/manage-tasks",
        element: (
          <PrivateRoute>
            <ManageTasks></ManageTasks>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/manage-tasks/edit-task/:id",
        element: (
          <PrivateRoute>
            <EditTask></EditTask>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/members",
        element: (
          <PrivateRoute>
            <Members></Members>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/overview",
        element: (
          <PrivateRoute>
            <Overview></Overview>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
