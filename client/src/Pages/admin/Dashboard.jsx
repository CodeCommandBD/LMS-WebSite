import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/services/courseApi";
import {
  LineChart,
  Line,
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
} from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
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

  const { totalRevenue, totalSales, courseStats } = data?.stats || {
    totalRevenue: 0,
    totalSales: 0,
    courseStats: [],
  };

  // Mock data for the engagement chart
  const engagementData = [
    { name: "Nov 01", value: 30 },
    { name: "Nov 05", value: 45 },
    { name: "Nov 10", value: 40 },
    { name: "Nov 15", value: 65 },
    { name: "Nov 20", value: 55 },
    { name: "Nov 25", value: 80 },
    { name: "Nov 30", value: 95 },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "registration",
      user: "John Doe",
      action: "enrolled in Python 101",
      time: "2 mins ago",
      iconColor: "bg-blue-500/20 text-blue-500",
    },
    {
      id: 2,
      type: "completion",
      user: "Sarah Smith",
      action: "finished UX Design Basics",
      time: "1 hour ago",
      iconColor: "bg-green-500/20 text-green-500",
    },
    {
      id: 3,
      type: "approval",
      user: "System",
      action: 'New course "Advanced AI" needs review',
      time: "3 hours ago",
      iconColor: "bg-yellow-500/20 text-yellow-500",
    },
  ];

  const departments = [
    { name: "Computer Science", value: 856, color: "bg-blue-500" },
    { name: "Business Administration", value: 643, color: "bg-purple-500" },
    { name: "Graphic Design", value: 432, color: "bg-cyan-500" },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-300 font-bold mb-1">Dashboard Overview</h2>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            Welcome back, {user?.name?.split(" ")[0] || "Alex"}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            Here's what's happening with your learning platform today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1e293b] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="bg-[#1e293b] p-2 rounded-full hover:bg-gray-700 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4">
        <button className="bg-[#1e293b] text-gray-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all border border-gray-700/50 shadow-lg">
          <FileText className="w-4 h-4" />
          Report
        </button>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Students",
            value: "12,450",
            change: "+5.2%",
            growth: "from last month",
            icon: GraduationCap,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
          },
          {
            label: "Active Courses",
            value: totalSales + 40,
            change: "+2.4%",
            growth: "new this week",
            icon: BookOpen,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
          },
          {
            label: "Total Revenue",
            value: `৳${(totalRevenue / 1000).toFixed(0)}k`,
            change: "+12%",
            growth: "growth rate",
            icon: DollarSign,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
          },
          {
            label: "Completion Rate",
            value: "78%",
            change: "+3%",
            growth: "vs industry avg",
            icon: TrendingUp,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-[#1e293b] border-none rounded-[2rem] p-6 shadow-xl hover:translate-y-[-4px] transition-all group overflow-hidden relative"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} blur-[80px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}
            ></div>
            <div className="relative flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </span>
                <div className={`${stat.bgColor} p-2 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-extrabold mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 mt-auto">
                <span
                  className={`text-xs font-bold ${stat.color} flex items-center`}
                >
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {stat.change}
                </span>
                <span className="text-gray-400 text-[10px] font-medium">
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
        <Card className="lg:col-span-2 bg-[#1e293b] border-none rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative">
            <div>
              <CardTitle className="text-xl font-extrabold mb-1">
                Course Engagement
              </CardTitle>
              <p className="text-gray-500 text-xs font-medium italic">
                Average daily active students over the last 30 days
              </p>
            </div>
            <select className="bg-[#0f172a] border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
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
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#1e293b] border-none rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <CardTitle className="text-xl font-extrabold">
              Recent Activity
            </CardTitle>
            <MoreHorizontal className="text-gray-500 w-5 h-5 cursor-pointer" />
          </div>

          <div className="space-y-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-800"></div>

            {recentActivity.map((activity) => (
              <div key={activity.id} className="relative flex gap-4">
                <div
                  className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#1e293b] ${activity.iconColor}`}
                >
                  {activity.type === "registration" && (
                    <Users className="w-4 h-4" />
                  )}
                  {activity.type === "completion" && (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  {activity.type === "approval" && (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white mb-0.5">
                    {activity.user === "System"
                      ? "System Notification"
                      : activity.user}
                  </p>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 italic">
                    {activity.action}
                  </p>
                  <p className="text-[10px] text-blue-500 font-bold mt-1.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-3 bg-[#0f172a] hover:bg-gray-800 rounded-2xl text-xs font-bold transition-all border border-gray-700/30">
            View All Activity
          </button>
        </Card>
      </div>

      {/* Bottom Row - Enrollment Details */}
      <Card className="bg-[#1e293b] border-none rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <CardTitle className="text-2xl font-extrabold mb-2 tracking-tight">
              Student Enrollment by Department
            </CardTitle>
            <p className="text-gray-500 text-sm font-medium italic">
              Distribution of active students across major faculties
            </p>
          </div>
          <button className="text-blue-500 text-sm font-bold hover:underline">
            View Detailed Report
          </button>
        </div>

        <div className="space-y-8">
          {departments.map((dept, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-gray-300">{dept.name}</span>
                <span className="font-extrabold tabular-nums">
                  {dept.value}
                </span>
              </div>
              <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dept.color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
                  style={{ width: `${(dept.value / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
