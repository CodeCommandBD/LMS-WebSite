import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signupSchema";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  // TanStack Query mutation for signup
  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Update Redux state with user data
      if (data.success && data.user) {
        dispatch(setUser(data.user));
        toast.success(
          "Account created successfully! Redirecting to login...",
        );
        reset();
        setTimeout(() => navigate("/login"), 1500);
      }
    },
    onError: (error) => {
      // Handle different error scenarios with user-friendly messages
      const errorMessage = error.message?.toLowerCase() || "";

      if (errorMessage.includes("email") && errorMessage.includes("already")) {
        toast.error(
          "This email is already registered. Please login instead.",
        );
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("fetch")
      ) {
        toast.error(
          "Network error. Please check your connection and try again.",
        );
      } else if (errorMessage.includes("validation")) {
        toast.error("Please check your input and try again.");
      } else if (errorMessage.includes("server")) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Signup failed. Please try again.");
      }
    },
  });

  // Form submit handler
  const onSubmit = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="mt-20 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join us today! It's quick and easy.
        </p>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Name Field */}
            <div>
              <Label className="block text-gray-700 font-bold mb-2">
                Full Name
              </Label>
              <Input
                type="text"
                placeholder="Enter your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <Label className="block text-gray-700 font-bold mb-2">
                Email
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label className="block text-gray-700 font-bold mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <Label className="block text-gray-700 font-bold mb-2">Role</Label>
              <RadioGroup defaultValue="student" className="flex gap-3">
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    className="text-blue-500"
                    value="student"
                    id="student"
                    {...register("role")}
                  />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    className="text-blue-500"
                    value="teacher"
                    id="teacher"
                    {...register("role")}
                  />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
              </RadioGroup>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing up...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
