import { GraduationCap } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/services/authApi";
import { clearUser } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed. Please try again.");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <div className="z-50 w-full fixed top-0 backdrop-blur-md bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              EduHub
            </span>
          </Link>
        </div>
        {/* Menu */}
        <nav>
          <ul className="flex items-center gap-6">
            <li className="relative group">
              <Link
                to="/"
                className="text-white font-medium hover:text-white/80 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li className="relative group">
              <Link
                to="/courses"
                className="text-white font-medium hover:text-white/80 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
              >
                Courses
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            {!user ? (
              <div className="flex items-center gap-3 ml-4">
                <Button
                  variant="outline"
                  className="text-white font-semibold cursor-pointer bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-purple-600 font-semibold cursor-pointer bg-white hover:bg-gray-100 border-0 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                {["admin", "teacher"].includes(user?.role?.toLowerCase()) && (
                  <Link
                    to="/admin"
                    className="text-white font-medium hover:text-white/80 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10"
                  >
                    Admin
                  </Link>
                )}
                <Link to="/profile">
                  <Avatar className="ring-2 ring-white/50 hover:ring-white transition-all duration-300">
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
