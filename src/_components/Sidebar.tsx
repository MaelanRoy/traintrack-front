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

type MenuItemProps = {
  icon: IconType;
  text: string;
  className?: string;
};

const MenuItem = ({ icon: Icon, text, className = "" }: MenuItemProps) => (
  <li>
    <button
      className={`flex items-center p-2 hover:text-primary hover:bg-accent rounded-[12px] cursor-pointer gap-2 w-full text-left transition duration-200 ${className}`}
    >
      <Icon />
      {text}
    </button>
  </li>
);

const Sidebar = () => {
  const menuItems = [
    { icon: AiFillLayout, text: "Tableau de bord" },
    { icon: FaDumbbell, text: "Mes entrainements" },
    { icon: FaCalendarAlt, text: "Programmes" },
    { icon: FaRunning, text: "Exercices" },
    { icon: FaChartBar, text: "Statistiques" },
    { icon: FaUser, text: "Profil" },
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
            <MenuItem key={index} icon={item.icon} text={item.text} />
          ))}
        </ul>
        <ul>
          <MenuItem
            icon={IoSettingsSharp}
            text="Paramètres"
            className="mb-10"
          />
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
