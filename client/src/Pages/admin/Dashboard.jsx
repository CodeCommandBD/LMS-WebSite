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
  ArrowRight,
  MoreHorizontal,
  GraduationCap,
  UserPlus,
  CheckCircle,
  Star,
  MessageSquare,
  ShieldAlert,
  Edit3,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
    totalStudents = 0,
    activeCourses = 0,
    completionRate = 0,
    engagementData = [],
    recentActivity = [],
    categoryEnrollment = [],
    adminStats = {},
    recentReviews = [],
    recentContacts = [],
  } = data?.stats || {};

  const maxCategoryValue = Math.max(
    ...categoryEnrollment.map((c) => c.value),
    1,
  );

  return (
    <div className="space-y-8 text-white animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-white/70 font-bold mb-1 uppercase tracking-tighter text-xs">
            Admin Management Hub
          </h2>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}!
          </h1>
          <p className="text-gray-300 text-sm mt-1 font-medium">
            System overview and critical tasks for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/notifications" className="bg-[#1e293b] p-2.5 rounded-full hover:bg-gray-700 transition-colors relative border border-gray-800 group">
            <Bell className="w-5 h-5 text-gray-300 group-hover:text-white" />
            {(adminStats.unreadMessagesCount > 0) && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-[#0f172a] text-[10px] font-black flex items-center justify-center">
                {adminStats.unreadMessagesCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => navigate("/admin/createCourse")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      {/* Quick Access Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Draft Courses", value: adminStats.draftCoursesCount || 0, icon: Edit3, color: "text-amber-400", bg: "bg-amber-400/10", link: "/admin/courses" },
          { label: "Banned Users", value: adminStats.bannedUsersCount || 0, icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-400/10", link: "/admin/users" },
          { label: "Help Requests", value: adminStats.unreadMessagesCount || 0, icon: Mail, color: "text-cyan-400", bg: "bg-cyan-400/10", link: "/admin/helpCenter" },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className="bg-[#1e293b]/50 border border-gray-800 rounded-2xl p-4 flex items-center justify-between hover:border-gray-700 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`${item.bg} p-3 rounded-xl`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-black text-white">{item.value}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: totalStudents.toLocaleString(), sub: "Registered Users", icon: GraduationCap, color: "text-blue-500", bgColor: "bg-blue-500/10" },
          { label: "Published Courses", value: activeCourses, sub: "Live Content", icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-500/10" },
          { label: "Total Revenue", value: `৳${totalRevenue > 1000 ? (totalRevenue / 1000).toFixed(1) + "k" : totalRevenue}`, sub: `${totalSales} Sales`, icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
          { label: "Success Rate", value: `${completionRate}%`, sub: "Course Completion", icon: TrendingUp, color: "text-amber-500", bgColor: "bg-amber-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1e293b] border border-gray-800/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} blur-[60px] -mr-12 -mt-12 group-hover:scale-150 transition-all duration-700`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                <div className={`${stat.bgColor} p-2 rounded-xl`}><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
              </div>
              <div className="text-2xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{stat.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white">Enrollment Trend</h3>
            <span className="text-[10px] font-black text-gray-500 uppercase bg-gray-800 px-3 py-1 rounded-full">Last 30 Days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dy={10} interval={5} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Message Inbox */}
        <Card className="bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white">Help Center</h3>
            <Link to="/admin/helpCenter" className="text-blue-400 hover:text-white transition-colors"><ExternalLink className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-4 flex-1">
            {recentContacts.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-10">No messages</p>
            ) : (
              recentContacts.map((msg, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all ${msg.isRead ? "bg-transparent border-gray-800" : "bg-blue-600/5 border-blue-600/20"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black text-white truncate max-w-[120px]">{msg.name}</p>
                    <span className="text-[10px] text-gray-500 font-bold">{formatTimeAgo(msg.createdAt)}</span>
                  </div>
                  <p className="text-[10px] font-bold text-blue-400 truncate uppercase mb-1">{msg.subject}</p>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                </div>
              ))
            )}
          </div>
          <button onClick={() => navigate("/admin/helpCenter")} className="w-full mt-6 py-3 bg-gray-800 hover:bg-gray-700 text-[10px] font-black uppercase tracking-widest text-white rounded-xl transition-all border border-gray-700">
            Open Help Center
          </button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-8 shadow-2xl">
          <CardTitle className="text-xl font-black text-white mb-8">System Activity</CardTitle>
          <div className="space-y-6 relative">
            {recentActivity.length > 0 && (
              <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-800"></div>
            )}
            {recentActivity.map((activity, index) => (
              <div key={index} className="relative flex gap-4">
                <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#1e293b] shadow-lg ${activity.type === "enrollment" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"}`}>
                  {activity.type === "enrollment" ? <UserPlus className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-white">{activity.userName}</p>
                  <p className="text-xs text-gray-400 font-bold italic">{activity.action}</p>
                  <p className="text-[10px] text-blue-400 font-black mt-1 uppercase">{formatTimeAgo(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Student Reviews */}
        <Card className="bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-8 shadow-2xl">
          <CardTitle className="text-xl font-black text-white mb-8">Course Reviews</CardTitle>
          <div className="space-y-5">
            {recentReviews.length === 0 ? (
              <div className="text-center py-10">
                <Star className="w-8 h-8 text-gray-800 mx-auto mb-2" />
                <p className="text-gray-500 text-sm font-bold">No reviews yet</p>
              </div>
            ) : (
              recentReviews.map((review, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-8 h-8 border border-gray-700">
                      <AvatarImage src={review.userId?.profilePicture} />
                      <AvatarFallback className="bg-blue-600 text-[10px] font-black">{review.userId?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-white truncate">{review.userId?.name}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-2.5 h-2.5 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 truncate mt-0.5">on {review.courseId?.courseTitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 font-medium line-clamp-2 leading-relaxed italic">"{review.comment || "No comment provided."}"</p>
                  <p className="text-[10px] text-blue-400 font-black mt-3 uppercase tracking-widest">{formatTimeAgo(review.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Category Enrollment */}
      <Card className="bg-[#1e293b] border border-gray-800/50 rounded-[2.5rem] p-10 shadow-2xl">
        <h3 className="text-2xl font-black mb-8 text-white uppercase tracking-tighter">Growth by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {categoryEnrollment.map((cat, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-400">{cat.name}</span>
                <span className="text-white">{cat.value} Students</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full transition-all duration-1000`} style={{ width: `${(cat.value / maxCategoryValue) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
