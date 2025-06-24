// src/components/Layout.tsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="">
      <Sidebar></Sidebar>
      <div className=" ml-[222px] ">
        <Navbar></Navbar>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
