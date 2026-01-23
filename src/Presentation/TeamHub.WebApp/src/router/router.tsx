import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/dashboard";
import PublicRoute from "@/hooks/auth/PublicRoute";
import RequireAuth from "@/hooks/auth/RequireAuth";

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
          { path: "/dashboard", element: <Dashboard /> },
        ],
      },
    ],
  },
]);
