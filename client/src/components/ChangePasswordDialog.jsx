import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const changePasswordFn = (data) =>
  api.post("/users/change-password", data).then((r) => r.data);

const ChangePasswordDialog = ({ open, onClose }) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const mutation = useMutation({
    mutationFn: changePasswordFn,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to change password.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    mutation.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  const inputClass =
    "w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-11 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-500" />
            Change Password
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
                className={`${inputClass} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                required
                className={`${inputClass} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength indicator */}
            {form.newPassword.length > 0 && (
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.newPassword.length >= i * 3
                        ? form.newPassword.length >= 10
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">
                  {form.newPassword.length < 6
                    ? "Too short"
                    : form.newPassword.length < 10
                    ? "Fair"
                    : "Strong"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Repeat new password"
              required
              className={`${inputClass} ${
                form.confirmPassword && form.confirmPassword !== form.newPassword
                  ? "border-red-400 focus:ring-red-400/40"
                  : ""
              }`}
            />
            {form.confirmPassword && form.confirmPassword !== form.newPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11"
            >
              {mutation.isPending ? "Saving..." : "Change Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
