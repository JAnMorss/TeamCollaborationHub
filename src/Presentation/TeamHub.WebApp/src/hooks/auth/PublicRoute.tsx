import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import type { JSX } from "react";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated)
    return <Navigate to="/dashboard" replace />;
  
  return children;
}
