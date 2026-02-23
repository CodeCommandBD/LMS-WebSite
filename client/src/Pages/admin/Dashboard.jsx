import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/services/courseApi";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Loader2,
  Bell,
  Search,
  FileText,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  GraduationCap,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper to format time ago
const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStatsService,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
        Error loading dashboard stats: {error.message}
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalSales = 0,
    courseStats = [],
    totalStudents = 0,
    activeCourses = 0,
    completionRate = 0,
    engagementData = [],
    recentActivity = [],
    categoryEnrollment = [],
  } = data?.stats || {};

  // Find the max value in category enrollment for the progress bar
  const maxCategoryValue = Math.max(
    ...categoryEnrollment.map((c) => c.value),
    1,
  );

  return (
    <div className="space-y-8 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-white/70 font-bold mb-1 uppercase tracking-tighter text-xs">
            Dashboard Overview
          </h2>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Alex"}! 👋
          </h1>
          <p className="text-gray-300 text-sm mt-1 font-medium">
            Here's what's happening with your learning platform today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1e293b] border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-64 text-white placeholder:text-gray-500"
            />
          </div>
          <button className="bg-[#1e293b] p-2 rounded-full hover:bg-gray-700 transition-colors relative border border-gray-800">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <button className="bg-[#1e293b] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all border border-gray-800 shadow-lg">
          <FileText className="w-4 h-4" />
          Report
        </button>
        <button
          onClick={() => navigate("/admin/createCourse")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Students",
            value: totalStudents.toLocaleString(),
            change: `${totalStudents}`,
            growth: "registered students",
            icon: GraduationCap,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
          },
          {
            label: "Active Courses",
            value: activeCourses,
            change: `${activeCourses}`,
            growth: "published courses",
            icon: BookOpen,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
          },
          {
            label: "Total Revenue",
            value: `৳${totalRevenue > 0 ? (totalRevenue / 1000).toFixed(0) + "k" : "0"}`,
            change: `${totalSales} sales`,
            growth: "total enrollments",
            icon: DollarSign,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
          },
          {
            label: "Completion Rate",
            value: `${completionRate}%`,
            change: `${completionRate}%`,
            growth: "course completions",
            icon: TrendingUp,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-[#1e293b] border border-gray-800/50 rounded-[2rem] p-6 shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} blur-[80px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}
            ></div>
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-[10px] font-black uppercase tracking-widest opacity-80">
                  {stat.label}
                </span>
                <div className={`${stat.bgColor} p-2 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-black mb-2 tracking-tighter text-white">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 mt-auto">
                <span
                  className={`text-xs font-black ${stat.color} flex items-center bg-white/5 py-0.5 px-1.5 rounded-lg border border-white/5`}
                >
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {stat.change}
                </span>
                <span className="text-gray-300 text-[10px] font-bold uppercase tracking-wide opacity-60">
                  {stat.growth}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <Card className="lg:col-span-2 bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10 relative">
            <div>
              <CardTitle className="text-2xl font-black mb-1 text-white tracking-tight">
                Enrollment Trend
              </CardTitle>
              <p className="text-gray-300 text-xs font-bold italic opacity-70">
                Daily enrollments over the last 30 days
              </p>
            </div>
            <div className="bg-[#0f172a] border border-gray-800 rounded-xl px-4 py-2 text-xs font-black text-white">
              Last 30 Days
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval={4}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  labelStyle={{
                    color: "#94a3b8",
                    fontSize: "10px",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  name="Enrollments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <CardTitle className="text-xl font-black text-white">
              Recent Activity
            </CardTitle>
            <MoreHorizontal className="text-gray-400 w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="space-y-8 relative">
            {/* Timeline Line */}
            {recentActivity.length > 0 && (
              <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-800"></div>
            )}

            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm italic text-center py-8">
                No recent activity yet
              </p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="relative flex gap-4">
                  <div
                    className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#1e293b] shadow-lg shadow-black/20 ${
                      activity.type === "enrollment"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    {activity.type === "enrollment" ? (
                      <UserPlus className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-white mb-0.5">
                      {activity.userName}
                    </p>
                    <p className="text-xs text-gray-200 font-bold line-clamp-2 italic opacity-80">
                      {activity.action}
                    </p>
                    <p className="text-[10px] text-blue-400 font-black mt-2 uppercase tracking-widest">
                      {formatTimeAgo(activity.time)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-10 py-4 bg-[#0f172a] hover:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-gray-800 shadow-xl">
            View All Activity
          </button>
        </Card>
      </div>

      {/* Bottom Row - Enrollment by Category */}
      <Card className="bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <CardTitle className="text-2xl font-black mb-2 text-white uppercase tracking-tighter">
              Enrollment by Category
            </CardTitle>
            <p className="text-gray-300 text-sm font-bold italic opacity-70">
              Distribution of enrolled students across course categories
            </p>
          </div>
          <button className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors">
            Detailed Report
          </button>
        </div>

        <div className="space-y-10">
          {categoryEnrollment.length === 0 ? (
            <p className="text-gray-400 text-sm italic text-center py-8">
              No enrollment data yet
            </p>
          ) : (
            categoryEnrollment.map((cat, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-white uppercase tracking-wider">
                    {cat.name}
                  </span>
                  <span className="font-black tabular-nums text-white text-base">
                    {cat.value}
                  </span>
                </div>
                <div className="h-3 w-full bg-[#0f172a] rounded-full overflow-hidden border border-gray-800/50 p-[2px]">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
                    style={{
                      width: `${Math.max((cat.value / maxCategoryValue) * 100, 2)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
