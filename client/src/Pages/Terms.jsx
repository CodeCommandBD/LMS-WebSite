import React from "react";
import { Link } from "react-router-dom";
import { Shield, ChevronRight, Scale, BookOpen } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-blue-600 tracking-tight uppercase text-[10px] font-black">
          Terms of Service
        </span>
      </div>

      <div className="max-w-4xl mx-auto bg-[#1e293b]/20 border border-gray-800 rounded-[40px] p-8 md:p-16 space-y-12">
        <div className="flex items-center gap-6 pb-12 border-b border-gray-800/50">
          <div className="bg-purple-600/10 p-5 rounded-[24px] border border-purple-600/20">
            <Scale className="w-10 h-10 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic">
              Terms of <span className="text-purple-600">Service</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
              Last Updated: February 2026
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              1. General Use
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              By accessing EduHub, you agree to comply with these terms. The
              platform provides educational content, and you agree to use it for
              personal, non-commercial learning only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              2. User Accounts
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account credentials. EduHub reserves the right to suspend accounts
              that violate our community guidelines.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              3. Course Content
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              All course materials are intellectual property of EduHub and its
              instructors. Unauthorized distribution, sharing, or copying of
              content is strictly prohibited.
            </p>
          </section>
        </div>

        <div className="pt-12 text-center text-gray-500 text-sm font-medium border-t border-gray-800/50">
          If you have any questions regarding these terms, please{" "}
          <Link
            to="/contact"
            className="text-purple-500 font-bold hover:underline"
          >
            contact us
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Terms;
