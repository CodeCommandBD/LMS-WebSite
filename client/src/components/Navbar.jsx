import {
  GraduationCap,
  Search,
  LogOut,
  Bell,
  BellRing,
  CheckCheck,
  X,
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
                      window.location.href = n.link;
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
                {["admin", "teacher"].includes(user?.role?.toLowerCase()) && (
                  <Link
                    to="/admin"
                    className="text-white font-medium hover:text-white/80 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 hidden md:block"
                  >
                    Admin
                  </Link>
                )}
                {/* 🔔 Notification Bell */}
                <NotificationBell />
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
                  <span className="hidden md:block">
                    {logoutMutation.isPending ? "..." : "Logout"}
                  </span>
                </Button>
              </div>
            )}
            <li className="relative group">
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `text-white font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 ${
                    isActive ? "bg-white/20 shadow-md" : "hover:text-white/80"
                  }`
                }
              >
                Notes
              </NavLink>
            </li>
            <li className="relative group">
              <NavLink
                to="/qa"
                className={({ isActive }) =>
                  `text-white font-medium transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 ${
                    isActive ? "bg-white/20 shadow-md" : "hover:text-white/80"
                  }`
                }
              >
                Q&A
              </NavLink>
            </li>
            <li className="flex items-center gap-2 ml-4">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-white" />
              ) : (
                <Sun className="w-4 h-4 text-white" />
              )}
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-blue-600"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
