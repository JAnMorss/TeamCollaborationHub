import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/components/appLayout/PublicLayout";
import AppLayout from "@/components/appLayout/AppLayout";
import LandingPage from "@/pages/landing/LandingPage";
import PublicRoute from "@/hooks/auth/PublicRoute";
import RequireAuth from "@/hooks/auth/RequireAuth";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProjectPage from "@/pages/projects/ProjectPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import ProjectMembersPage from "@/pages/members/ProjectMembersPage";
import TasksPage from "@/pages/tasks/TasksPage ";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <PublicRoute><LandingPage /></PublicRoute> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/projects", element: <ProjectPage /> },
          { path: "/dashboard/members", element: <ProjectMembersPage /> },
          { path: "/dashboard/tasks", element: <TasksPage /> },
          { path: "/dashboard/calendar", element: <CalendarPage /> },
        ],
      },
    ],
  },
]);
