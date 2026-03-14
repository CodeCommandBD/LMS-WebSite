import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
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
    control,
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
        setTimeout(() => navigate(from), 1500);
      }
    },
    onError: (error) => {
      // Handle different error scenarios
      // Check for needsVerification flag
      if (error.response?.data?.needsVerification) {
        toast.error(error.response.data.message, { duration: 5000 });
        navigate("/verify-email");
        return;
      }

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-10 shadow-2xl text-center space-y-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Please enter your details to login</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-bold block ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="bg-white/5 border-white/10 rounded-xl px-4 py-6 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 ml-1 font-medium">
                  {errors.email?.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm font-bold block ml-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-white/5 border-white/10 rounded-xl px-4 py-6 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 ml-1 font-medium">
                  {errors.password?.message}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-3">
              <Label className="text-gray-300 text-sm font-bold block ml-1">Login as</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4 p-1"
                  >
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <RadioGroupItem
                        value="student"
                        id="student"
                        className="border-white/20 text-purple-500 focus:ring-purple-500"
                      />
                      <Label htmlFor="student" className="text-gray-400 group-hover:text-white transition-colors cursor-pointer">
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer group">
                      <RadioGroupItem
                        value="teacher"
                        id="teacher"
                        className="border-white/20 text-purple-500 focus:ring-purple-500"
                      />
                      <Label htmlFor="teacher" className="text-gray-400 group-hover:text-white transition-colors cursor-pointer">
                        Teacher
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full rounded-2xl py-6 bg-purple-600 hover:bg-purple-700 font-bold text-white transition-all transform active:scale-[0.98] shadow-lg shadow-purple-900/20"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                Create one now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
