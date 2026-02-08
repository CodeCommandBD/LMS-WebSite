import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="mt-20 bg-gray-100 h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center md:items-start space-x-8 md:space-x-12">
            {/* profile picture */}
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              <img
                src={user.protoUrl || "https://github.com/shadcn.png"}
                alt=""
                className="object-cover w-full h-full "
              />
            </div>
            {/* profile information */}
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">
                {user.name || "No name available"}
              </h1>
              <p className="font-bold">
                Email :{" "}
                <span className="font-semibold text-blue-500">
                  {user.email || "No email available"}
                </span>
              </p>
              <p className="font-bold">
                Role :{" "}
                <span className="font-semibold text-blue-500">
                  {user.role || "No role available"}
                </span>
              </p>

              <p className="font-bold">
                Bio :{" "}
                <span className="font-semibold text-blue-500">
                  {user.bio || "No bio available"}
                </span>
              </p>
              <Dialog className="">
                <DialogTrigger>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-semibold transition-all duration-300 hover:scale-105 shadow-md">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      <form action="" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="profilePicture">
                            Profile Picture
                          </Label>
                          <Input
                            type="file"
                            id="profilePicture"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            type="text"
                            id="name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            type="email"
                            id="email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Input
                            type="text"
                            id="bio"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-semibold transition-all duration-300 hover:scale-105 shadow-md">
                          Save Changes
                        </Button>
                      </form>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src="https://github.com/shadcn.png"
                alt=""
                className="object-cover w-full h-full "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
