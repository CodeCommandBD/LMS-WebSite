import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Loader2,
  GraduationCap,
  Heart,
  User as UserIcon,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileInfo } from "@/components/ProfileInfo";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/authApi";
import { clearUser } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed. Please try again.");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Auth check with useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      {/* Visual Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            Profile
          </span>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white dark:border-gray-700/30 overflow-hidden mb-8">
          <div className="h-32 bg-linear-to-r from-blue-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute -bottom-16 left-8 translate-y-2">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-2xl backdrop-blur-sm bg-opacity-80">
                <Avatar className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage
                    src={user.photoUrl || "https://github.com/shadcn.png"}
                    alt={user.name}
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                  />
                  <AvatarFallback className="text-3xl font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {user.name}
                <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg uppercase tracking-wider">
                  {user.role}
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {user.email}
              </p>
              <div className="flex gap-4 mt-4">
                <EditProfileDialog user={user} />
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200 dark:border-gray-700 h-11 px-6"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="rounded-xl border-red-200 dark:border-red-900/30 h-11 px-6 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/my-learning" className="flex-1 md:flex-none">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl h-14 px-8 shadow-xl shadow-blue-500/20 group">
                  <GraduationCap className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                  My Learning
                </Button>
              </Link>
              <Link to="/wishlist" className="flex-1 md:flex-none">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl h-14 px-8 border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:text-pink-600 hover:border-pink-200 transition-all group"
                >
                  <Heart className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" />
                  Wishlist
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Tabs/Sections Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-xl border border-gray-100 dark:border-gray-700/30">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" />
                About Me
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">
                {user.bio ||
                  "No biography provided yet. Tell the world about your learning journey!"}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <GraduationCap className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold mb-2">Learning Progress</h3>
              <p className="text-indigo-100 text-sm mb-6">
                Complete courses to earn certificates.
              </p>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">
                    Total Progress
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[15%]" />
                    </div>
                    <span className="font-bold">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
