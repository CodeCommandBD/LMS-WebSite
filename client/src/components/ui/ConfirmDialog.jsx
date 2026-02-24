import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Global reusable Confirm Dialog.
 *
 * Props:
 *  open        – boolean, controls visibility
 *  onClose     – () => void, called when cancelled
 *  onConfirm   – () => void, called when confirmed
 *  title       – string  (default: "Are you sure?")
 *  description – string  (default: "This action cannot be undone.")
 *  confirmText – string  (default: "Delete")
 *  isLoading   – boolean (optional) disables buttons while pending
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  isLoading = false,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="bg-[#1e293b] border-none text-white rounded-3xl p-8 max-w-sm shadow-2xl">
        <DialogHeader className="items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-medium mt-2 text-sm">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3 mt-6 sm:flex-row flex-col">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-700 transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl font-black bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40 transition-all cursor-pointer"
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
