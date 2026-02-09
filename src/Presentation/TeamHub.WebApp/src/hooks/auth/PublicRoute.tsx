import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "./useAuth";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated)
    return <Navigate to="/dashboard" replace />;
  
  return children;
}
