import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post("/contact", form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-blue-600 tracking-tight uppercase text-[10px] font-black">
          Contact
        </span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Have questions? We're here to help. Send us a message and our team
            will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            {[
              {
                icon: MapPin,
                title: "Our Location",
                detail: "Dhaka, Bangladesh",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: Mail,
                title: "Email Us",
                detail: "support@eduhub.com",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                icon: Phone,
                title: "Call Us",
                detail: "+880 1234-567890",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-6 items-center p-6 bg-[#1e293b]/20 border border-gray-800 rounded-[32px]"
              >
                <div className={`${item.bg} p-4 rounded-2xl`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    {item.title}
                  </p>
                  <p className="text-white font-bold">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 bg-[#1e293b]/30 border border-gray-800 rounded-[40px] p-8 md:p-12">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-12 space-y-6">
                <div className="bg-emerald-500/10 p-6 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">
                    Message Sent!
                  </h2>
                  <p className="text-gray-400 max-w-xs">
                    Thank you for reaching out. We'll reply to your email within
                    24–48 hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-3 px-8 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-black text-sm uppercase tracking-wider rounded-2xl transition-all border border-blue-600/20"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all font-medium resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
