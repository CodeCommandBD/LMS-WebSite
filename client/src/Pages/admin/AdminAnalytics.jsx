import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "@/services/courseApi";
import {
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  Loader2,
  PieChart,
  Calendar,
  DollarSign,
  UserPlus,
  ArrowRight,
  UserX,
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
  LineChart,
  Line,
  Legend,
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
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `৳${stats.totalRevenue?.toLocaleString() ?? 0}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Avg. Order Value",
            value: `৳${stats.avgOrderValue?.toLocaleString() ?? 0}`,
            icon: TrendingUp,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Enrollments",
            value: stats.totalSales ?? 0,
            icon: Target,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Active Students",
            value: stats.totalStudents ?? 0,
            icon: UserPlus,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
          {
            label: "Completion",
            value: `${stats.completionRate ?? 0}%`,
            icon: Activity,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
          {
            label: "Unenrollments",
            value: stats.totalUnenrollments ?? 0,
            icon: UserX,
            color: "text-gray-400",
            bg: "bg-gray-400/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#1e293b]/30 border border-gray-800 p-5 rounded-2xl relative overflow-hidden group hover:border-gray-700 transition-all"
          >
            <div className={`${stat.bg} w-10 h-10 flex items-center justify-center rounded-xl mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {stat.label}
            </p>
            <h2 className="text-xl font-black text-white mt-1">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Primary Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white tracking-tight">
              Monthly Revenue
            </h3>
            <span className="text-[10px] font-black text-gray-500 uppercase bg-gray-800/50 px-3 py-1 rounded-full">
              Last 12 Months
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                  labelStyle={{ color: "#64748b", fontSize: "10px", fontWeight: "bold", marginBottom: "4px" }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Growth Line Chart */}
        <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white tracking-tight">
              Student Acquisitions
            </h3>
            <span className="text-[10px] font-black text-gray-500 uppercase bg-gray-800/50 px-3 py-1 rounded-full">
              New Students / Month
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 30 Day Enrollment Trend */}
        <div className="lg:col-span-8 bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white tracking-tight">
              Recent Enrollment Trend
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-[10px] font-black text-gray-500 uppercase">Last 30 Days</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.engagementData}>
                <defs>
                  <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }} />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fill="url(#colorEnroll)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="lg:col-span-4 bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8 flex flex-col">
          <h3 className="text-lg font-black text-white tracking-tight mb-8">
            Category Distribution
          </h3>
          <div className="h-[220px] w-full relative mb-auto">
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
                    <Cell key={`cell-${index}`} fill={entry.color?.replace("bg-", "#").replace("500", "63eb")} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px" }} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-black text-white">{stats.totalSales}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total</p>
            </div>
          </div>
          <div className="space-y-2 mt-6">
            {stats.categoryEnrollment?.slice(0, 5).map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span className="text-xs font-bold text-gray-400">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-white">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Courses Section */}
      <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-white tracking-tight">
            Top 10 Courses by Revenue
          </h3>
          <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-500/20">
            Highest Earners
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50">
                <th className="pb-4">Rank</th>
                <th className="pb-4">Course Title</th>
                <th className="pb-4">Sales Count</th>
                <th className="pb-4 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/20">
              {stats.courseStats?.map((course, i) => (
                <tr key={i} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 text-sm font-black text-gray-500">
                    #{i + 1}
                  </td>
                  <td className="py-4 text-sm font-bold text-gray-300 group-hover:text-blue-400 transition-colors">
                    {course.name}
                  </td>
                  <td className="py-4 text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-purple-500" />
                      {course.sales}
                    </div>
                  </td>
                  <td className="py-4 text-right text-sm font-black text-emerald-400">
                    ৳{course.revenue.toLocaleString()}
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
