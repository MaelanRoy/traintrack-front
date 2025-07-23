import { NavLink } from "react-router-dom";

const AdministrationPage = () => {
  return (
    <div className="dashboard-page">
      <NavLink
        className="p-2 rounded-xl bg-accent text-primary hover:bg-accent-hover transition-colors duration-200 cursor-pointer"
        type="button"
        to={"/administration/exercise/create"}
      >
        Ajouter un exercice
      </NavLink>
    </div>
  );
};
export default AdministrationPage;
