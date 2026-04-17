import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Settings,
  User,
  Bell,
  Lock,
  Globe,
  Camera,
  Loader2,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/authApi";
import api from "@/lib/api";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const { siteName: currentSiteName, siteLogo: currentSiteLogo, contactEmail: currentContactEmail, footerText: currentFooterText } = useSelector((state) => state.settings);
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

  // Change Password state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => api.post("/users/change-password", data).then((r) => r.data),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPwForm({ current: "", newPw: "", confirm: "" });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to change password"),
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) return toast.error("Passwords do not match");
    if (pwForm.newPw.length < 6) return toast.error("New password must be at least 6 characters");
    changePasswordMutation.mutate({ currentPassword: pwForm.current, newPassword: pwForm.newPw });
  };

  // Platform Branding State
  const [platformData, setPlatformData] = useState({
    siteName: currentSiteName,
    contactEmail: currentContactEmail,
    footerText: currentFooterText,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(currentSiteLogo);

  const updatePlatformMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.put("/settings/platform", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["platformSettings"]);
      // Update global store
      dispatch({ type: "settings/setSettings", payload: data.settings.data });
      toast.success("Platform branding updated!");
    },
    onError: (err) => toast.error(err.message || "Failed to update branding"),
  });

  const handlePlatformSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("data", JSON.stringify(platformData));
    if (logoFile) formData.append("logo", logoFile);
    updatePlatformMutation.mutate(formData);
  };

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Security", icon: Lock },
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

          {activeTab === "Security" && (
            <div className="p-8 lg:p-12 space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/10 p-3 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Change Password</h3>
                  <p className="text-gray-500 text-sm">Update your admin account password</p>
                </div>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                {[
                  { label: "Current Password", key: "current" },
                  { label: "New Password", key: "newPw" },
                  { label: "Confirm New Password", key: "confirm" },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
                    <div className="relative">
                      <input
                        type={showPw[key] ? "text" : "password"}
                        value={pwForm[key]}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        required
                        className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-3 px-4 pr-11 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {changePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "Platform" && (
            <div className="p-8 lg:p-12 space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500/10 p-3 rounded-xl">
                  <Globe className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Platform Branding</h3>
                  <p className="text-gray-500 text-sm">Customize your LMS identity and global info</p>
                </div>
              </div>

              <form onSubmit={handlePlatformSubmit} className="space-y-8">
                {/* Logo Upload */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-[#1e293b]/30 p-6 rounded-[24px] border border-gray-800/50">
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-2xl bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-700 group-hover:border-blue-500/50 transition-all">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                      ) : (
                        <Globe className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setLogoFile(file);
                            setLogoPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider">Site Logo</h4>
                    <p className="text-xs text-gray-500 font-medium">Upload a transparent PNG or SVG for best results (Max 1MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Site Name</label>
                    <input
                      type="text"
                      value={platformData.siteName}
                      onChange={(e) => setPlatformData({ ...platformData, siteName: e.target.value })}
                      className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                      placeholder="e.g. EduHub LMS"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                    <input
                      type="email"
                      value={platformData.contactEmail}
                      onChange={(e) => setPlatformData({ ...platformData, contactEmail: e.target.value })}
                      className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                      placeholder="support@domain.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Footer Text</label>
                  <input
                    type="text"
                    value={platformData.footerText}
                    onChange={(e) => setPlatformData({ ...platformData, footerText: e.target.value })}
                    className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                    placeholder="Copyright info or tagline"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatePlatformMutation.isPending}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {updatePlatformMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Platform Settings
                  </button>
                </div>
              </form>

              <div className="h-px bg-gray-800/50 my-10" />

              <div className="space-y-4 max-w-lg">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">System Environment</h4>
                {[
                  { label: "Frontend", value: "React + Vite" },
                  { label: "Backend", value: "Node.js + Express" },
                  { label: "Storage", value: "Cloudinary" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between bg-[#1e293b]/30 border border-gray-800/40 rounded-xl px-5 py-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
                    <span className="text-xs font-bold text-white/70">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
