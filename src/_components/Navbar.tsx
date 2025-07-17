import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LoginDialog } from "./LoginDialog";
import { RegisterDialog } from "./RegisterDialog";
import { useAuth } from "@/hooks/useAuth";

const TITLE_MAP: Record<string, string> = {
  "/": "Tableau de bord",
  "/trainings": "Mes entraînements",
  "/programs": "Programmes",
  "/exercises": "Exercices",
  "/statistics": "Statistiques",
  "/profile": "Profil",
  "/administration": "Administration",
  "/settings": "Paramètres",
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, logout: authLogout } = useAuth();

  const logout = () => {
    authLogout();
    queryClient.clear();
    navigate("/");
    console.log("Déconnexion réussie");
  };

  const pageTitle = useMemo(() => {
    const pathname =
      location.pathname === "/" ? "/" : `/${location.pathname.split("/")[1]}`;
    return TITLE_MAP[pathname] || "Page";
  }, [location.pathname]);

  return (
    <nav className="flex items-center h-20 bg-primary justify-between">
      <h1 className="ml-[19px] text-2xl">{pageTitle}</h1>
      {isAuthenticated ? (
        <div className="flex items-center mr-[19px]">
          <button
            className="p-2 rounded-xl bg-secondary hover:bg-secondary-hover transition-colors duration-200 cursor-pointer "
            onClick={logout}
          >
            Se deconnecter
          </button>
        </div>
      ) : (
        <div className="flex items-center mr-[19px] gap-3">
          <LoginDialog
            trigger={
              <button className="p-2 rounded-xl bg-secondary hover:bg-secondary-hover transition-colors duration-200 cursor-pointer">
                Se connecter
              </button>
            }
          />
          <RegisterDialog
            trigger={
              <button
                className="p-2 rounded-xl bg-accent text-primary hover:bg-accent-hover transition-colors duration-200 cursor-pointer"
                type="button"
              >
                S'inscrire
              </button>
            }
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
