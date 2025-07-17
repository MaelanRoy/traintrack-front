import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  fallbackPath = "/",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si pas connecté, rediriger vers l'accueil
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Si admin requis mais utilisateur pas admin, rediriger
  if (requireAdmin && !isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Sinon, afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute;
