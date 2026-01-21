import LandingPage from "@/pages/LandingPage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
]);