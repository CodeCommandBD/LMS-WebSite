import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/services/categoryApi";
import {
  Plus,
  Trash,
  Loader2,
  Filter,
  Search,
  LayoutGrid,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      setIsAddModalOpen(false);
      setNewCategoryName("");
      setNewCategoryDesc("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createMutation.mutate({
      name: newCategoryName,
      description: newCategoryDesc,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-600/20">
              <Filter className="w-6 h-6 text-white" />
            </div>
            Category Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Manage your courses by creating and organizing categories
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-6 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5 text-white" />
          New Category
        </Button>
      </div>

      {/* Grid Container */}
      <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-gray-800/50">
            <TableRow className="hover:bg-transparent border-gray-800">
              <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-[10px]">
                Name
              </TableHead>
              <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-[10px]">
                Description
              </TableHead>
              <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-[10px] text-center">
                Created At
              </TableHead>
              <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-[10px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow
                key={cat._id}
                className="hover:bg-gray-800/30 border-gray-800/50 transition-colors"
              >
                <TableCell className="py-5 px-6">
                  <span className="text-white font-bold">{cat.name}</span>
                </TableCell>
                <TableCell className="py-5 px-6">
                  <span className="text-gray-400 text-sm line-clamp-1">
                    {cat.description || "No description"}
                  </span>
                </TableCell>
                <TableCell className="py-5 px-6 text-center">
                  <span className="text-gray-500 font-mono text-[10px] uppercase font-bold">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="py-5 px-6 text-right">
                  <Button
                    onClick={() => deleteMutation.mutate(cat._id)}
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-gray-500 transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <LayoutGrid className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                      No categories found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#0f172a] border-gray-800 text-white rounded-[32px] overflow-hidden max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Add New Category
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-medium">
              Create a new category for the platform.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-6 pt-4">
            <div className="space-y-2 text-sm">
              <Label
                htmlFor="name"
                className="text-gray-300 font-bold uppercase tracking-wider text-[10px]"
              >
                Category Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Data Science"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="bg-gray-800/50 border-gray-700 rounded-xl py-6 focus:ring-blue-500 text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="desc"
                className="text-gray-300 font-bold uppercase tracking-wider text-[10px]"
              >
                Description (Optional)
              </Label>
              <Input
                id="desc"
                placeholder="Briefly describe this category"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                className="bg-gray-800/50 border-gray-700 rounded-xl py-6 focus:ring-blue-500 text-white placeholder:text-gray-600"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="border-gray-800 text-gray-400 hover:bg-gray-800 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 rounded-xl"
              >
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
