import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Settings,
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Camera,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/authApi";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("Profile");

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      queryClient.invalidateQueries(["currentUser"]);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Update failed");
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Security", icon: Lock },
    { name: "Notifications", icon: Bell },
    { name: "Platform", icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <div className="bg-gray-700 p-2 rounded-xl shadow-lg shadow-black/20">
            <Settings className="w-6 h-6" />
          </div>
          General Settings
        </h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">
          Manage your account preferences and site configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 group ${
                activeTab === tab.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-[#1e293b]/30 text-gray-400 hover:bg-[#1e293b]/50 hover:text-white border border-transparent hover:border-gray-800"
              }`}
            >
              <tab.icon
                className={`w-5 h-5 ${activeTab === tab.name ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`}
              />
              <span className="font-bold text-sm tracking-tight">
                {tab.name}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-[#1e293b]/20 border border-gray-800 rounded-[32px] overflow-hidden">
          {activeTab === "Profile" && (
            <div className="p-8 lg:p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
              {/* Avatar Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-8 border-b border-gray-800/50 pb-10">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-[#1e293b] shadow-2xl transition-all group-hover:ring-blue-600/30">
                    <AvatarImage src={user?.photoUrl} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-black">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg shadow-blue-600/30 hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {user?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {user?.role?.toUpperCase()} ACCOUNT
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Administrator
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <form
                onSubmit={handleProfileSubmit}
                className="space-y-6 max-w-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-[#1e293b]/30 border border-gray-800/50 rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Professional Bio
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-medium resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== "Profile" && (
            <div className="p-20 text-center space-y-4 animate-in fade-in duration-500">
              <div className="bg-blue-600/10 p-4 rounded-full w-fit mx-auto">
                <Globe className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-white">
                Under Development
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
                {activeTab} settings are currently being fine-tuned to provide
                the best admin experience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
