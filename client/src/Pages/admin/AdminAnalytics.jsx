import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/services/courseApi";
import {
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  PieChart,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart as RePieChart,
  Pie,
} from "recharts";

const AdminAnalytics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getDashboardStatsService,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-600/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            Advanced Analytics
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Deep dive into your platform's performance metrics
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1e293b]/50 p-1.5 rounded-xl border border-gray-800">
          <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20">
            Last 30 Days
          </button>
          <button className="px-4 py-1.5 text-gray-500 hover:text-white text-xs font-bold rounded-lg transition-colors">
            Last 90 Days
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue",
            value: `৳${stats.totalRevenue?.toLocaleString()}`,
            change: "+12.5%",
            trending: "up",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Course Enrollments",
            value: stats.totalSales,
            change: "+18.2%",
            trending: "up",
            icon: Target,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Completion Rate",
            value: `${stats.completionRate}%`,
            change: "-2.4%",
            trending: "down",
            icon: Activity,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Active Students",
            value: stats.totalStudents,
            change: "+5.1%",
            trending: "up",
            icon: Calendar,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#1e293b]/30 border border-gray-800 p-6 rounded-[32px] relative overflow-hidden group hover:border-gray-700 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trending === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"}`}
              >
                {stat.trending === "up" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {stat.label}
            </p>
            <h2 className="text-3xl font-black text-white mt-1 tracking-tight">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-8 bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white tracking-tight">
              Growth Over Time
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Enrollments
                </span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.engagementData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "16px",
                  }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="lg:col-span-4 bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8 flex flex-col">
          <h3 className="text-lg font-black text-white tracking-tight mb-8">
            Course Categories
          </h3>
          <div className="h-[250px] w-full relative mb-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={stats.categoryEnrollment}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.categoryEnrollment?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color
                        ?.replace("bg-", "#")
                        .replace("500", "63eb")}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "16px",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-black text-white">
                {stats.totalSales}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Enrollments
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            {stats.categoryEnrollment?.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span className="text-xs font-bold text-gray-400">
                    {cat.name}
                  </span>
                </div>
                <span className="text-xs font-black text-white">
                  {cat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Courses Table Preview */}
      <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
        <h3 className="text-lg font-black text-white tracking-tight mb-8">
          Revenue by Course
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50 pb-4">
                <th className="pb-4">Course Name</th>
                <th className="pb-4">Sales</th>
                <th className="pb-4">Revenue</th>
                <th className="pb-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/20">
              {stats.courseStats?.slice(0, 5).map((course, i) => (
                <tr key={i} className="group">
                  <td className="py-4 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                    {course.name}
                  </td>
                  <td className="py-4 text-sm font-medium text-gray-400">
                    {course.sales}
                  </td>
                  <td className="py-4 text-sm font-black text-white">
                    ৳{course.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3 h-3" />+
                      {(Math.random() * 20).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
