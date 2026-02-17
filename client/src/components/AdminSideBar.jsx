import {
  BookOpen,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Home,
} from "lucide-react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/services/authApi";
import { clearUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

const AdminSideBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(clearUser());
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    },
  });

  const menuItems = [
    { icon: Home, label: "Go to Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: BookOpen, label: "Courses", path: "/admin/courses" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  ];

  const supportItems = [
    { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: HelpCircle, label: "Help Center", path: "/admin/help" },
  ];

  return (
    <div className="w-[80px] md:w-[280px] bg-[#0f172a] text-gray-400 flex flex-col sticky left-0 top-0 h-screen transition-all duration-300 z-50">
      {/* Logo Section */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <h1 className="text-white font-bold text-xl hidden md:block">
            EduAdmin
          </h1>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Main Menu */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-4 hidden md:block">
            Main Menu
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "hover:bg-gray-800/50 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium hidden md:block text-sm">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-4 hidden md:block">
            Support
          </p>
          <div className="space-y-1">
            {supportItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800/50 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium hidden md:block text-sm">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 mt-auto border-t border-gray-800/50">
        <div className="bg-gray-800/30 rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-600/20">
              <AvatarImage src={user?.photoUrl} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.name || "Alex Morgan"}
              </p>
              <p className="text-[10px] text-gray-500 truncate uppercase">
                {user?.role || "Admin"}
              </p>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors hidden md:block"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
