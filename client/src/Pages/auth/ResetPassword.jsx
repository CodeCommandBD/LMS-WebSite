import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { resetPassword } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        setIsSuccess(true);
        toast.success("Password reset successful!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Token is invalid or has expired");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    mutation.mutate({ token, password: formData.password });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4 text-purple-600 dark:text-purple-400">
                  <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Password
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Please enter a strong new password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 p-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>
                    Choose a password you haven't used recently. Minimum 6
                    characters.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-14 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4 text-green-600 dark:text-green-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Set!
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Your password has been reset successfully. You can now use your
                new password to sign in.
              </p>

              <Link
                to="/login"
                className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-semibold rounded-xl hover:shadow-xl transition-all active:scale-95"
              >
                Sign In Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
