import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import MainPage from "../Pages/MainPage/MainPage";
import DashboardHome from "../Pages/DashboardHome/DashboardHome";
import ProjectPage from "../Pages/ProjectPage/ProjectPage";
import LoginPage from "../Pages/Auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute"; 
import TaskPage from "../Pages/TaskPage/TaskPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },

  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <MainPage />,
        children: [
          { path: "", element: <DashboardHome /> },
          { path: "projects", element: <ProjectPage /> },
          { 
            path: "tasks", 
            element: <TaskPage /> 
          }
, 
          { path: "settings", element: <div>Settings Page</div> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
