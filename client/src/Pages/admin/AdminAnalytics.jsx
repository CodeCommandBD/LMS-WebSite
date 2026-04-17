import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  Users,
  CreditCard,
  Target,
  Loader2,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminAnalytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminFullStats"],
    queryFn: () => api.get("/purchase/stats").then((res) => res.data.stats),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const {
    totalRevenue,
    totalSales,
    avgOrderValue,
    completionRate,
    revenueTrend,
    courseStats,
    categoryEnrollment,
    recentActivity,
  } = data || {};

  const COLORS = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <TrendingUp className="w-7 h-7" />
          </div>
          Advanced Analytics
        </h1>
        <p className="text-gray-400 mt-1 font-medium">Deep financial insights and student engagement trends</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `৳${totalRevenue?.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Enrollments", value: totalSales, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Avg. Order Value", value: `৳${avgOrderValue}`, icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Completion Rate", value: `${completionRate}%`, icon: Target, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1e293b]/30 border-gray-800 shadow-2xl backdrop-blur-xl hover:translate-y-[-4px] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} p-2.5 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-8 bg-[#1e293b]/30 border-gray-800 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white font-black text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Revenue & Enrollment Trend
            </CardTitle>
            <CardDescription className="text-gray-500">Daily performance over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ fontWeight: "bold" }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area yAxisId="right" type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="lg:col-span-4 bg-[#1e293b]/30 border-gray-800 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white font-black text-lg">Category Split</CardTitle>
            <CardDescription className="text-gray-500">Popular subject areas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryEnrollment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryEnrollment?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-gray-500 text-[10px] font-black uppercase">Top</span>
              <span className="text-white text-xl font-black">{categoryEnrollment?.[0]?.name?.split(' ')[0]}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {/* Top Courses */}
        <Card className="bg-[#1e293b]/30 border-gray-800 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white font-black text-lg">Top Performing Courses</CardTitle>
            <CardDescription className="text-gray-500">Ranked by revenue generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseStats?.slice(0, 5).map((course, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white truncate">{course.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{course.sales} Sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">৳{course.revenue.toLocaleString()}</p>
                    <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${(course.revenue / totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#1e293b]/30 border-gray-800 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white font-black text-lg">Recent Engagement</CardTitle>
            <CardDescription className="text-gray-500">Live feed of student actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity?.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`h-2 w-2 rounded-full ${activity.type === 'enrollment' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-[0_0_8px] ${activity.type === 'enrollment' ? 'shadow-blue-500/50' : 'shadow-emerald-500/50'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">
                      <span className="text-white font-bold">{activity.userName}</span> {activity.action}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-gray-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
