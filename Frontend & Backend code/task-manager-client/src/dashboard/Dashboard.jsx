import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobSidebar from "./MobSidebar";

const Dashboard = () => {
  return (
    <div>
      <div className="flex h-screen">
        {/* <div className="overflow-y-auto lg:hidden">
          <MobSidebar /> 
        </div> */}
        <div className="hidden lg:block overflow-y-auto">
          <Sidebar /> 
        </div>
        <div className="block lg:hidden overflow-y-auto">
          <MobSidebar></MobSidebar>
        </div>
        <div className="flex-1 overflow-y-auto ">
          <div className="">
            <div className="bg-slate-200 h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
