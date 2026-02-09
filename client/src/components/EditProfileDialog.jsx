import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileForm } from "./ProfileForm";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/services/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

export const EditProfileDialog = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.user) dispatch(setUser(data.user));
      toast.success("Profile updated successfully!");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <ProfileForm
          user={user}
          onSuccess={(data) => updateMutation.mutate(data)}
          isLoading={updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
