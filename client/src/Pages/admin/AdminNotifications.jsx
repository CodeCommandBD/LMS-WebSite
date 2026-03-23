import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Bell,
  Send,
  Users,
  User,
  CheckCircle2,
  Info,
  AlertTriangle,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const sendNotifFn = (data) =>
  api.post("/notifications/send", data).then((r) => r.data);

const types = [
  { value: "info", label: "Info", icon: Info, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
  { value: "success", label: "Success", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" },
  { value: "warning", label: "Warning", icon: AlertTriangle, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" },
  { value: "announcement", label: "Announcement", icon: Megaphone, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" },
];

const AdminNotifications = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    link: "",
    targetUserId: "",
  });
  const [mode, setMode] = useState("all"); // "all" | "specific"

  const mutation = useMutation({
    mutationFn: sendNotifFn,
    onSuccess: (data) => {
      toast.success(data.message);
      setForm({ title: "", message: "", type: "info", link: "", targetUserId: "" });
      setMode("all");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send notification.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      message: form.message,
      type: form.type,
      link: form.link,
    };
    if (mode === "specific" && form.targetUserId.trim()) {
      payload.targetUserId = form.targetUserId.trim();
    }
    mutation.mutate(payload);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
          <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Send Notification</h1>
          <p className="text-gray-400 text-sm">Broadcast announcements or target specific users</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Mode */}
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/5">
          <label className="block text-sm font-bold text-gray-300 mb-3">Recipients</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("all")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
                mode === "all"
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <Users className="w-4 h-4" />
              All Users
            </button>
            <button
              type="button"
              onClick={() => setMode("specific")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
                mode === "specific"
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <User className="w-4 h-4" />
              Specific User
            </button>
          </div>

          {mode === "specific" && (
            <div className="mt-3">
              <input
                type="text"
                value={form.targetUserId}
                onChange={(e) => setForm({ ...form, targetUserId: e.target.value })}
                placeholder="Enter User ID (MongoDB ObjectId)"
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 h-10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                required={mode === "specific"}
              />
            </div>
          )}
        </div>

        {/* Type */}
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/5">
          <label className="block text-sm font-bold text-gray-300 mb-3">Notification Type</label>
          <div className="grid grid-cols-2 gap-2">
            {types.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value })}
                  className={`flex items-center gap-2 p-3 rounded-xl border font-semibold text-sm transition-all ${
                    form.type === t.value
                      ? `${t.color} border-current/30`
                      : "border-white/5 text-gray-500 hover:border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1e293b] rounded-2xl p-5 border border-white/5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              maxLength={100}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Notification title..."
              required
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 h-11 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5">Message</label>
            <textarea
              value={form.message}
              maxLength={500}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message..."
              required
              rows={4}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
            />
            <p className="text-right text-[10px] text-gray-600 mt-1">{form.message.length}/500</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5">
              Link <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="/my-learning or /courses"
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 h-11 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>
        </div>

        {/* Preview */}
        {(form.title || form.message) && (
          <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Preview</p>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">{form.title || "Title here"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{form.message || "Message here"}</p>
                <p className="text-[10px] text-gray-600 mt-1">just now</p>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl gap-2 shadow-lg shadow-purple-500/20 text-base"
        >
          <Send className="w-4 h-4" />
          {mutation.isPending
            ? "Sending..."
            : mode === "all"
            ? "Broadcast to All Users"
            : "Send to User"}
        </Button>
      </form>
    </div>
  );
};

export default AdminNotifications;
