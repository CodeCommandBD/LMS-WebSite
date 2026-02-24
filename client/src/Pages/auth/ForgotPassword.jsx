import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

import { forgotPassword } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data.success) {
        setIsSent(true);
        toast.success("Reset link sent!");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
          {!isSent ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 text-blue-600 dark:text-blue-400">
                  <Mail className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Forgot Password
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  No worries! Enter your email and we'll send you a link to
                  reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-14 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
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
                Check Your Email
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {email}
                </span>
                .
              </p>
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                💡 For development, check the server console logs for the reset
                link!
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
