import AdminSideBar from "@/components/AdminSideBar";
import React from "react";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <div className="flex w-full min-h-screen bg-[#0f172a]">
      <AdminSideBar />
      <div className="flex-1 w-full overflow-y-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
