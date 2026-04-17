import React from "react";
import { useCart } from "@/hooks/useCart";
import { Trash2, ShoppingBag, ArrowRight, BookOpen, Tag, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { validateCoupon } from "@/services/couponApi";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, removeFromCart, isLoading, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  const [discount, setDiscount] = React.useState(0);
  const [isValidating, setIsValidating] = React.useState(false);
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const total = cartItems.reduce((acc, item) => acc + (item.courseId?.price || 0), 0);
  const finalTotal = Math.max(0, total - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    try {
      const res = await validateCoupon(couponCode, total);
      if (res.success) {
        setDiscount(res.discount);
        setAppliedCoupon(res.couponCode);
        toast.success(res.message);
      }
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const courseIds = cartItems.map(item => item.courseId?._id);
      const res = await api.post("/purchase/checkout", { 
        courseIds, 
        couponCode: appliedCoupon 
      });
      
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 pt-20">
        <div className="animate-pulse text-indigo-600 font-bold">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            Shopping Cart
          </h1>
          <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
            {cartItems.length} {cartItems.length === 1 ? "Course" : "Courses"}
          </Badge>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Looks like you haven't added any courses yet. Start your learning journey today!
            </p>
            <Button asChild size="lg" className="rounded-xl px-8 shadow-lg shadow-indigo-500/20">
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.courseId?._id}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-4 flex gap-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                    <img
                      src={item.courseId?.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"}
                      alt={item.courseId?.courseTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                        {item.courseId?.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                        By <span className="font-semibold">{item.courseId?.creator?.name}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                       <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                          Best Seller
                       </Badge>
                       <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> 12 Lectures
                       </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0 pl-2">
                    <span className="font-black text-lg text-slate-900 dark:text-white">
                      ৳{item.courseId?.price}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.courseId?._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl sticky top-28">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>

                {/* Coupon Input */}
                {!appliedCoupon ? (
                  <div className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase font-bold"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponCode}
                      className="rounded-xl px-4"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-3 flex items-center justify-between mb-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wide">
                          COUPON APPLIED: {appliedCoupon}
                       </span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-red-500 transition-colors">
                       <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-bold">৳{total}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span className="text-sm font-medium">Coupon Discount</span>
                      <span className="font-bold">-৳{discount}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-black text-indigo-600">৳{finalTotal}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full rounded-xl h-12 text-base font-bold shadow-lg shadow-indigo-500/20 group"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-widest">
                    Secure 256-bit SSL encrypted payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
