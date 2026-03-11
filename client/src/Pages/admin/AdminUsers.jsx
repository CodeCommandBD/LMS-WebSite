import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsersService } from "@/services/authApi";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Users,
  Mail,
  Calendar,
  ShieldCheck,
  UserCircle,
  Loader2,
  Search,
  Trash2,
  Ban,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null); // userId to confirm delete
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.auth.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsersService,
  });

  // Ban/Unban mutation
  const banMutation = useMutation({
    mutationFn: (userId) =>
      api.patch(`/users/${userId}/ban`).then((r) => r.data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) =>
      toast.error(
        err?.response?.data?.message || "Failed to update ban status",
      ),
  });

  // Role change mutation
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) =>
      api.patch(`/users/${userId}/role`, { role }).then((r) => r.data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to change role"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (userId) => api.delete(`/users/${userId}`).then((r) => r.data),
    onSuccess: (data) => {
      toast.success(data.message);
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete user"),
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

  const allUsers = data?.users || [];

  // Filter
  const users = allUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const ROLE_COLORS = {
    admin: "bg-rose-500/10 text-rose-400",
    teacher: "bg-emerald-500/10 text-emerald-400",
    student: "bg-blue-500/10 text-blue-400",
  };

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all w-full md:w-64"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2 px-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: allUsers.length,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Students",
            value: allUsers.filter((u) => u.role === "student").length,
            icon: UserCircle,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Teachers",
            value: allUsers.filter((u) => u.role === "teacher").length,
            icon: ShieldCheck,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Banned",
            value: allUsers.filter((u) => u.isBanned).length,
            icon: Ban,
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
                  User
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Email
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Role
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Joined
                </th>
                <th className="p-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right pr-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {users.map((user) => {
                const isSelf = user._id === currentUser?.id;
                const isAdmin = user.role === "admin";
                return (
                  <tr
                    key={user._id}
                    className={`group hover:bg-white/2 transition-colors ${user.isBanned ? "opacity-60" : ""}`}
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
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-blue-400 font-normal">
                              (You)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-5">
                      {isSelf || isAdmin ? (
                        <Badge
                          className={`${ROLE_COLORS[user.role]} border-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}
                        >
                          {user.role}
                        </Badge>
                      ) : (
                        <div className="relative group/role inline-block">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              roleMutation.mutate({
                                userId: user._id,
                                role: e.target.value,
                              })
                            }
                            className={`appearance-none cursor-pointer border-0 rounded-lg text-[10px] font-black uppercase tracking-wider px-3 py-1.5 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${ROLE_COLORS[user.role]} bg-opacity-100`}
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                        </div>
                      )}
                    </td>
                    <td className="p-5">
                      {user.isBanned ? (
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg">
                          Banned
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5 text-right pr-8">
                      {!isSelf && !isAdmin && (
                        <div className="flex items-center justify-end gap-2">
                          {/* Ban / Unban */}
                          <button
                            onClick={() => banMutation.mutate(user._id)}
                            disabled={banMutation.isPending}
                            title={user.isBanned ? "Unban user" : "Ban user"}
                            className={`p-2 rounded-xl border transition-colors ${
                              user.isBanned
                                ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            }`}
                          >
                            {user.isBanned ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </button>

                          {/* Delete */}
                          {confirmDelete === user._id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => deleteMutation.mutate(user._id)}
                                disabled={deleteMutation.isPending}
                                className="text-[10px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-wider py-1.5 px-3 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                              >
                                {deleteMutation.isPending ? "..." : "Confirm"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-[10px] font-black text-gray-400 uppercase tracking-wider py-1.5 px-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(user._id)}
                              title="Delete user"
                              className="p-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
