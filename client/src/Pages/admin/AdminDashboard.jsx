import AdminSideBar from "@/components/AdminSideBar";
import React from "react";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <div className="flex w-full min-h-screen pt-20">
      <AdminSideBar />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
