import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCoupons, createCoupon, deleteCoupon } from "@/services/couponApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  Ticket, 
  Calendar, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2,
  Percent,
  X 
} from "lucide-react";
import toast from "react-hot-toast";

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: "",
    expiresAt: "",
    usageLimit: "100",
    minPurchaseAmount: "0",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
  });

  const coupons = data?.coupons || [];

  const addMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success("Coupon created!");
      setIsAdding(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountAmount: "",
        expiresAt: "",
        usageLimit: "100",
        minPurchaseAmount: "0",
      });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create coupon"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      toast.success("Coupon deleted");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen pt-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-indigo-600" />
            Coupon Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage promotional discount codes</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-xl shadow-lg shadow-indigo-500/20">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Coupon
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-12 animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Discount Coupon</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Coupon Code</label>
              <Input
                placeholder="PROMO2024"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="rounded-xl border-2 focus:border-indigo-500 transition-all uppercase font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Discount Type</label>
              <select
                className="w-full h-10 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:border-indigo-500 transition-all outline-none"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="20"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  required
                  className="rounded-xl border-2 pl-8"
                />
                {formData.discountType === "percentage" ? (
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Expiry Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  required
                  className="rounded-xl border-2 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Usage Limit</label>
              <Input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="rounded-xl border-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1">Min. Purchase</label>
              <Input
                type="number"
                value={formData.minPurchaseAmount}
                onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                className="rounded-xl border-2"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" disabled={addMutation.isPending} className="rounded-xl px-8">
                {addMutation.isPending ? "Creating..." : "Save Coupon"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Code</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Discount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Limit/Used</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Expires</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No coupons found. Create one to get started!</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-lg">
                          <Ticket className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-none font-bold">
                        {coupon.discountType === "percentage" ? `${coupon.discountAmount}%` : `৳${coupon.discountAmount}`} OFF
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                           />
                        </div>
                        <span className="text-[10px] font-bold">{coupon.usedCount}/{coupon.usageLimit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          if (window.confirm("Delete this coupon?")) deleteMutation.mutate(coupon._id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
