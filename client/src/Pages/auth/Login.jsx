import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Update Redux state with user data if available
      if (data.user) {
        dispatch(setUser(data.user));
      }

      // Show success message and navigate
      if (data.success) {
        toast.success("Login successful! Welcome back.");
        setTimeout(() => navigate("/"), 1500);
      }
    },
    onError: (error) => {
      // Handle different error scenarios
      const errorMessage = error.message?.toLowerCase() || "";

      if (errorMessage.includes("email") || errorMessage.includes("password")) {
        toast.error("Incorrect email or password.");
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("fetch")
      ) {
        toast.error(
          "Network error. Please check your connection and try again.",
        );
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="mt-20 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700 ">
          Login
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Welcome back! Please enter your details.
        </p>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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
                  {errors.email?.message}
                </p>
              )}
            </div>
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
                  {errors.password?.message}
                </p>
              )}
            </div>
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
                  {errors.role?.message}
                </p>
              )}
            </div>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {" "}
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Login...
                </span>
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
