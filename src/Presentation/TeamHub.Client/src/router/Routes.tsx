import { createBrowserRouter, type RouteObject } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import MainPage from "../Pages/MainPage/MainPage";
import DashboardHome from "../Pages/DashboardHome/DashboardHome";
import ProjectPage from "../Pages/ProjectPage/ProjectPage";
import LoginPage from "../Pages/Auth/LoginPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login", 
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <MainPage />, 
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "projects",
        element: <ProjectPage />,
      },
      {
        path: "settings", 
        element: <div>Settings Page</div>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
