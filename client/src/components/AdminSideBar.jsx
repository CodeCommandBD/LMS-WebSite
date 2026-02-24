import {
  BookOpen,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Home,
  LayoutGrid,
} from "lucide-react";
import React from "react";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const AdminSideBar = () => {
  const { user } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.ui);
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
    { icon: HelpCircle, label: "Quizzes", path: "/admin/quizzes" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  ];

  const supportItems = [
    { icon: LayoutGrid, label: "Categories", path: "/admin/categories" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: HelpCircle, label: "Help Center", path: "/admin/help" },
  ];

  return (
    <div
      className={`${isSidebarOpen ? "w-[280px]" : "w-[80px]"} bg-[#0f172a] text-gray-400 flex flex-col sticky left-0 top-0 h-screen transition-all duration-300 z-50 border-r border-gray-800/50`}
    >
      {/* Logo Section */}
      <div className="p-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shrink-0">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <h1 className="text-white font-bold text-xl truncate animate-in fade-in slide-in-from-left-2 duration-300">
              EduAdmin
            </h1>
          )}
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden md:flex p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-colors"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Main Menu */}
        <div>
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-4 animate-in fade-in duration-300">
              Main Menu
            </p>
          )}
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
                {isSidebarOpen && (
                  <span className="font-medium text-sm animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div>
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-4 animate-in fade-in duration-300">
              Support
            </p>
          )}
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
                {isSidebarOpen && (
                  <span className="font-medium text-sm animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
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
            {isSidebarOpen && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-white truncate">
                  {user?.name || "Alex Morgan"}
                </p>
                <p className="text-[10px] text-gray-500 truncate uppercase">
                  {user?.role || "Admin"}
                </p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => logoutMutation.mutate()}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors animate-in fade-in duration-300"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
