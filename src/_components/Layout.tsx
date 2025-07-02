// src/components/Layout.tsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { AxiosInterceptor } from "@/config/api/AxiosInterceptor";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <AxiosInterceptor>
        <div className="">
          <Sidebar></Sidebar>
          <div className=" ml-[222px] ">
            <Navbar></Navbar>
            <div className="p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </AxiosInterceptor>
    </>
  );
};

export default Layout;
