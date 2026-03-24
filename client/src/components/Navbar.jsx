import {
  GraduationCap,
  Search,
  LogOut,
  Bell,
  BellRing,
  CheckCheck,
  X,
  Menu,
  User,
  FileText,
  MessageSquare,
  ChevronDown,
  Settings,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/services/authApi";
import { clearUser } from "@/store/slices/authSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Switch } from "./ui/switch";
import api from "@/lib/api";
import { socket } from "@/lib/socket";

// Notification API helpers
const notifApi = {
  getAll: () => api.get("/notifications").then((r) => r.data),
  markRead: (id) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};

// Relative time helper
const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: notifApi.getAll,
    enabled: !!user,
    // refetchInterval: 60000, // REMOVED POLLING!
  });

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: notifApi.markRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  const markAllReadMutation = useMutation({
    mutationFn: notifApi.markAllRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔌 Socket.io Real-time Logic
  useEffect(() => {
    if (user) {
      // 1. Connect and Join Room
      if (!socket.connected) socket.connect();
      socket.emit("join", user._id);

      // 2. Listen for Events
      const handleNewNotification = (notification) => {
        // Invalidate query to refetch data
        queryClient.invalidateQueries(["notifications"]);
        
        // Show a little toast for extra UX
        toast.success(`New notification: ${notification.title}`, {
           icon: '🔔',
           duration: 4000
        });
      };

      socket.on("new-notification", handleNewNotification);

      return () => {
        socket.off("new-notification", handleNewNotification);
      };
    } else {
      socket.disconnect();
    }
  }, [user, queryClient]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl hover:bg-white/15 transition-colors text-white focus:outline-none"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 animate-[wiggle_1s_ease-in-out_infinite]" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-purple-600/90 shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[420px] flex flex-col rounded-2xl bg-[#1e293b] border border-white/10 shadow-2xl shadow-black/40 z-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <span className="font-black text-sm text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-xs font-medium">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => {
                    if (!n.isRead) markReadMutation.mutate(n._id);
                    if (n.link) {
                      setOpen(false);
                      navigate(n.link);
                    }
                  }}
                  className={`px-4 py-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                    !n.isRead ? "bg-blue-500/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread indicator */}
                    <div
                      className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                        !n.isRead ? "bg-blue-400" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white leading-snug">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1 font-medium">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wiggle animation */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
      `}</style>
    </div>
  );
};

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <>
      <header className="z-50 w-full fixed top-0 backdrop-blur-md bg-linear-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 shadow-lg border-b border-white/20">
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

          {/* Menu Toggle (Mobile) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 animate-in spin-in-90 duration-300" />
            ) : (
              <Menu className="w-6 h-6 animate-in zoom-in-50 duration-300" />
            )}
          </button>

          {/* Desktop Menu */}
          <nav className="shrink-0 hidden lg:block">
            <ul className="flex items-center gap-2 lg:gap-4 xl:gap-6">
              <li className="relative group">
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
                  to="/blog"
                  className={({ isActive }) =>
                    `text-white font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 ${
                      isActive ? "bg-white/20 shadow-md" : "hover:text-white/80"
                    }`
                  }
                >
                  Blog
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
              <li className="relative group">
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `text-white font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 ${
                      isActive ? "bg-white/20 shadow-md" : "hover:text-white/80"
                    }`
                  }
                >
                  Leaderboard
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
                  {/* 🔔 Notification Bell */}
                  <NotificationBell />

                  {/* 👤 Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfile}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all duration-300 group"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-white/30 group-hover:ring-white transition-all duration-300">
                        <AvatarImage
                          src={user?.photoUrl || "https://github.com/shadcn.png"}
                        />
                        <AvatarFallback className="bg-white/20 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown
                        className={`w-4 h-4 text-white/70 transition-transform duration-300 ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-60 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* User Header */}
                        <div className="px-5 py-4 border-b border-white/10 mb-2">
                          <p className="text-sm font-bold text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>

                        {/* Links */}
                        <div className="px-2 space-y-1">
                          <Link
                            to="/profile"
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
                          >
                            <User className="w-4 h-4 text-blue-400" />
                            My Profile
                          </Link>
                          {["admin", "teacher"].includes(
                            user?.role?.toLowerCase()
                          ) && (
                            <Link
                              to="/admin"
                              onClick={closeMenu}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
                            >
                              <Settings className="w-4 h-4 text-purple-400" />
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            to="/notes"
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
                          >
                            <FileText className="w-4 h-4 text-amber-400" />
                            Notes
                          </Link>
                          <Link
                            to="/qa"
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium text-sm"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            Q&A
                          </Link>
                        </div>

                        <div className="h-px bg-white/10 my-2" />

                        {/* Theme Toggle in Dropdown */}
                        <div className="px-5 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-white/80">
                            {theme === "dark" ? (
                              <Moon className="w-4 h-4" />
                            ) : (
                              <Sun className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">Theme</span>
                          </div>
                          <Switch
                            checked={theme === "dark"}
                            onCheckedChange={toggleTheme}
                            className="data-[state=checked]:bg-blue-600 scale-75"
                          />
                        </div>

                        <div className="h-px bg-white/10 my-2" />

                        {/* Logout */}
                        <div className="px-2 pb-1">
                          <button
                            onClick={() => {
                              handleLogout();
                              closeMenu();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-bold text-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-[70px] bg-slate-950 backdrop-blur-xl transition-all duration-500 z-100 overflow-y-auto ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="sm:hidden relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </form>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/blog", label: "Blog" },
              { to: "/courses", label: "Courses" },
              { to: "/leaderboard", label: "Leaderboard" },
              { to: "/notes", label: "Notes" },
              { to: "/qa", label: "Q&A" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `text-lg font-semibold py-3 px-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="h-px bg-white/10 my-2" />

          {/* User Actions / Theme */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl">
              <span className="text-white font-medium flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                Theme
              </span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {!user ? (
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mt-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all border border-white/20"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {["admin", "teacher"].includes(user?.role?.toLowerCase()) && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 text-white font-semibold p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
