import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const titleMap: Record<string, string> = {
    "/": "Tableau de bord",
    "/trainings": "Mes entraînements",
    "/programs": "Programmes",
    "/exercises": "Exercices",
    "/statistics": "Statistiques",
    "/profile": "Profil",
    "/settings": "Paramètres",
  };
  const pathname = location.pathname.split("/")[1];
  const pageTitle = titleMap[`/${pathname}`] || "Page";

  return (
    <nav className="flex items-center h-20 bg-primary">
      <h1 className="ml-[19px] text-2xl">{pageTitle}</h1>
    </nav>
  );
};

export default Navbar;
