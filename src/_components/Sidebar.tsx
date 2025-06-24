import { AiFillLayout } from "react-icons/ai";
import {
  FaCalendarAlt,
  FaChartBar,
  FaDumbbell,
  FaRunning,
  FaUser,
} from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { IoSettingsSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";

type MenuItemProps = {
  icon: IconType;
  text: string;
  className?: string;
  link?: string;
};

const MenuItem = ({
  icon: Icon,
  text,
  className = "",
  link = "/",
}: MenuItemProps) => (
  <li>
    <NavLink
      to={link}
      className={({ isActive }) =>
        `
        flex items-center p-2 gap-2 w-full text-left transition duration-200 rounded-[12px]
        ${
          isActive
            ? "bg-accent text-primary"
            : "hover:bg-accent hover:text-primary"
        }
        ${className}
        `
      }
    >
      <Icon />
      {text}
    </NavLink>
  </li>
);

const Sidebar = () => {
  const menuItems = [
    { icon: AiFillLayout, text: "Tableau de bord", link: "/" },
    { icon: FaDumbbell, text: "Mes entrainements", link: "/trainings" },
    { icon: FaCalendarAlt, text: "Programmes", link: "/programs" },
    { icon: FaRunning, text: "Exercices", link: "/exercises" },
    { icon: FaChartBar, text: "Statistiques", link: "/statistics" },
    { icon: FaUser, text: "Profil", link: "/profile" },
  ];

  return (
    <nav className="fixed flex flex-col w-[222px] top-0 left-0 h-screen bg-primary">
      <div className="flex items-center justify-center font-semibold text-2xl mt-[19px] gap-2.5">
        <FaDumbbell className="text-[42px] rotate-45" />
        <span>
          <span className="text-accent">Train</span>Track
        </span>
      </div>
      <div className="flex flex-col justify-between h-full mx-auto mt-20">
        <ul className="flex flex-col gap-6">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              text={item.text}
              link={item.link}
            />
          ))}
        </ul>
        <ul>
          <MenuItem
            icon={IoSettingsSharp}
            text="Paramètres"
            className="mb-10"
            link="/settings"
          />
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
