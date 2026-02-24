import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsersService } from "@/services/authApi";
import {
  Users,
  Mail,
  Calendar,
  ShieldCheck,
  UserCircle,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AdminUsers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsersService,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load users. Please try again.</p>
      </div>
    );
  }

  const users = data?.users || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Users className="w-6 h-6" />
            </div>
            User Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Manage your student and teacher community
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-[#1e293b]/50 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: users.length,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Students",
            value: users.filter((u) => u.role === "student").length,
            icon: UserCircle,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Teachers",
            value: users.filter((u) => u.role === "teacher").length,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "admin").length,
            icon: ShieldCheck,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#1e293b]/30 border border-gray-800 p-5 rounded-2xl flex items-center gap-4"
          >
            <div className={`${stat.bg} p-3 rounded-xl`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/50 bg-gray-900/20">
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] pl-8">
                  User Information
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Contact
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Role
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Joined Date
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right pr-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="group hover:bg-white/2 transition-colors"
                >
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-gray-800 group-hover:ring-blue-600/30 transition-all">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-blue-600/10 text-blue-600 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-gray-200 group-hover:text-white transition-colors">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <Badge
                      className={`${
                        user.role === "admin"
                          ? "bg-rose-500/10 text-rose-500"
                          : user.role === "teacher"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-blue-500/10 text-blue-500"
                      } border-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-5 text-right pr-8">
                    <button className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors py-2 px-4 rounded-xl border border-blue-500/20 hover:bg-blue-500/10">
                      View Profile
                    </button>
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

export default AdminUsers;
