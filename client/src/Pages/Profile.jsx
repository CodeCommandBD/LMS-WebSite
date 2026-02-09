import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProfileInfo } from "@/components/ProfileInfo";
import { EditProfileDialog } from "@/components/EditProfileDialog";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
    <div className="mt-20 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shrink-0">
              <img
                src={user.photoUrl || "https://github.com/shadcn.png"}
                alt={user.name}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Profile Info & Edit Button */}
            <div className="flex-1 space-y-4">
              <ProfileInfo user={user} />
              <EditProfileDialog user={user} />
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://github.com/shadcn.png"
                alt="Course"
                className="object-cover w-full h-48 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
