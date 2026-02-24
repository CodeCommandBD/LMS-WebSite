import React from "react";
import {
  HelpCircle,
  Book,
  MessageSquare,
  ExternalLink,
  Search,
  ChevronRight,
  LifeBuoy,
  FileText,
  ShieldQuestion,
} from "lucide-react";

const AdminHelpCenter = () => {
  const categories = [
    { name: "Getting Started", icon: Book, count: 12 },
    { name: "Course Management", icon: FileText, count: 8 },
    { name: "User Roles & Permissions", icon: ShieldQuestion, count: 5 },
    { name: "Payment & Revenue", icon: LifeBuoy, count: 7 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-blue-600/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-black text-white flex items-center gap-4 mb-4">
            How can we help you?
          </h1>
          <p className="text-blue-100 text-lg font-medium mb-8">
            Browse guides, search for FAQs, or contact our support team
            directly.
          </p>
          <div className="relative group max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search for articles, guides..."
              className="w-full bg-white/10 border border-white/20 rounded-[20px] py-4 pl-14 pr-6 text-white placeholder:text-blue-200 focus:outline-none focus:ring-4 focus:ring-white/10 focus:bg-white/20 transition-all font-bold backdrop-blur-md"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <HelpCircle className="w-64 h-64 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <button
            key={i}
            className="bg-[#1e293b]/30 border border-gray-800 p-6 rounded-[32px] hover:border-blue-600/50 hover:bg-[#1e293b]/50 transition-all group text-left"
          >
            <div className="bg-blue-600/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 transition-colors">
              <cat.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-white font-black tracking-tight mb-2">
              {cat.name}
            </h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {cat.count} Articles
            </p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xl font-black text-white flex items-center gap-3 mb-6">
            <ShieldQuestion className="w-6 h-6 text-blue-500" />
            Frequently Asked Questions
          </h3>
          {[
            "How do I verify a new teacher account?",
            "Can I bulk upload course content?",
            "What happens if a payment fails?",
            "How do I customize the course completion certificate?",
            "Where can I view the platform's overall revenue logs?",
          ].map((q, i) => (
            <button
              key={i}
              className="w-full bg-[#1e293b]/20 border border-gray-800 rounded-2xl p-5 flex items-center justify-between group hover:bg-[#1e293b]/40 transition-all"
            >
              <span className="text-gray-300 font-bold group-hover:text-white transition-colors">
                {q}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>

        {/* Support Links */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-8">
            <h3 className="text-white font-black mb-6">Need direct help?</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                <MessageSquare className="w-5 h-5" />
                Live Chat Support
              </button>
              <button className="w-full flex items-center gap-3 p-4 border border-gray-700 hover:border-gray-600 text-white rounded-2xl font-black text-sm transition-all">
                <ExternalLink className="w-5 h-5" />
                Submit a Ticket
              </button>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-[32px] p-8">
            <h4 className="text-purple-400 font-black text-xs uppercase tracking-[0.2em] mb-3">
              Community
            </h4>
            <p className="text-white font-bold leading-relaxed mb-4">
              Join our discord server to discuss with other administrators.
            </p>
            <button className="text-purple-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:text-purple-300 transition-colors">
              Join Now <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelpCenter;
