import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema } from "@/schemas/profileUpdateSchema";
import toast from "react-hot-toast";

export const ProfileForm = ({ user, onSuccess, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Store the actual file
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("bio", data.bio || "");

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    onSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Profile Picture */}
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture</Label>
        {imagePreview && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 mx-auto">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <Input
          type="file"
          id="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          {...register("name")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          {...register("email")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input
          type="text"
          id="bio"
          {...register("bio")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-md w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};
