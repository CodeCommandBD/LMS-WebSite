import React, { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Search,
  ChevronRight,
  Loader2,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

const getContacts = () => api.get("/contact").then((r) => r.data);
const markRead = (id) => api.patch(`/contact/${id}/read`).then((r) => r.data);

const AdminHelpCenter = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread | read
  const [selected, setSelected] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminContacts"],
    queryFn: getContacts,
  });

  const markReadMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminContacts"]);
    },
    onError: () => toast.error("Failed to mark as read"),
  });

  const contacts = data?.contacts || [];

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "unread" && !c.isRead) ||
      (filter === "read" && c.isRead);
    return matchSearch && matchFilter;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  const handleOpen = (contact) => {
    setSelected(contact);
    if (!contact.isRead) {
      markReadMutation.mutate(contact._id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            Help Center Inbox
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Contact form submissions from users
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-xl">
              {unreadCount} Unread
            </span>
          )}
          <button
            onClick={() => refetch()}
            className="p-2 bg-[#1e293b]/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-all text-gray-400 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: contacts.length, color: "text-white" },
          { label: "Unread", value: unreadCount, color: "text-blue-400" },
          { label: "Read", value: contacts.length - unreadCount, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message List */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#1e293b]/50 border border-gray-800 rounded-xl px-3 text-sm text-gray-300 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 font-bold text-sm">No messages found</p>
            </div>
          ) : (
            filtered.map((contact) => (
              <button
                key={contact._id}
                onClick={() => handleOpen(contact)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected?._id === contact._id
                    ? "bg-blue-600/10 border-blue-600/50"
                    : contact.isRead
                    ? "bg-[#1e293b]/20 border-gray-800 hover:border-gray-700"
                    : "bg-[#1e293b]/40 border-blue-600/20 hover:border-blue-600/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`font-black text-sm truncate ${contact.isRead ? "text-gray-300" : "text-white"}`}>
                    {contact.name}
                  </p>
                  {!contact.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs font-bold text-gray-400 truncate mb-1">{contact.subject}</p>
                <p className="text-[10px] text-gray-600 font-bold">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-7">
          {selected ? (
            <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">{selected.subject}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                      {selected.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selected.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {selected.isRead ? (
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                    <CheckCircle className="w-3.5 h-3.5" /> Read
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5" /> Unread
                  </span>
                )}
              </div>

              <div className="h-px bg-gray-800" />

              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                  From: {selected.name}
                </p>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {selected.message}
                </p>
              </div>

              <div className="pt-4">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#1e293b]/10 border border-gray-800/50 rounded-[32px] p-20 text-center h-full flex flex-col items-center justify-center">
              <div className="bg-blue-600/10 p-6 rounded-full mb-6">
                <MessageSquare className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Select a message</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Choose a message from the inbox to view the full content and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHelpCenter;
