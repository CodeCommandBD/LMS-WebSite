import { GraduationCap, Search, LogOut } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

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
    <div className="z-50 w-full fixed top-0 backdrop-blur-md bg-linear-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 group shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight hidden md:block">
              EduHub
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-lg relative group hidden sm:block"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300"
          />
        </form>

        {/* Menu */}
        <nav className="shrink-0">
          <ul className="flex items-center gap-2 md:gap-6">
            <li className="relative group hidden lg:block">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 ${
                    isActive ? "bg-white/20 shadow-md" : "hover:text-white/80"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="relative group">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `text-white font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 ${
                    isActive ? "bg-white/20 shadow-md" : "hover:text-white/80"
                  }`
                }
              >
                Courses
              </NavLink>
            </li>
            {!user ? (
              <div className="flex items-center gap-2 md:gap-3 ml-2 md:ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white font-semibold cursor-pointer bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm transition-all duration-300 shadow-md h-9"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 font-semibold cursor-pointer bg-white hover:bg-gray-100 border-0 transition-all duration-300 shadow-lg h-9 hidden md:flex"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 md:gap-4 ml-2 md:ml-4">
                {["admin", "teacher"].includes(user?.role?.toLowerCase()) && (
                  <Link
                    to="/admin"
                    className="text-white font-medium hover:text-white/80 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 hidden md:block"
                  >
                    Admin
                  </Link>
                )}
                <Link to="/profile">
                  <Avatar className="h-9 w-9 ring-2 ring-white/50 hover:ring-white transition-all duration-300">
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
                  size="sm"
                  disabled={logoutMutation.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white cursor-pointer font-semibold transition-all duration-300 shadow-md h-9 px-3"
                >
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:block">
                    {logoutMutation.isPending ? "..." : "Logout"}
                  </span>
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
