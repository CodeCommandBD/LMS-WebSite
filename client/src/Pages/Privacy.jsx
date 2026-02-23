import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ChevronRight, Lock, Eye } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-blue-600 tracking-tight uppercase text-[10px] font-black">
          Privacy Policy
        </span>
      </div>

      <div className="max-w-4xl mx-auto bg-[#1e293b]/20 border border-gray-800 rounded-[40px] p-8 md:p-16 space-y-12">
        <div className="flex items-center gap-6 pb-12 border-b border-gray-800/50">
          <div className="bg-emerald-600/10 p-5 rounded-[24px] border border-emerald-600/20">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic">
              Privacy <span className="text-emerald-600">Policy</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
              Last Updated: February 2026
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <Lock className="w-5 h-5 text-emerald-600" />
              Data Encryption
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              Your personal data is encrypted both in transit and at rest. We
              use industry-standard security protocols to ensure your
              information stays private.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <Eye className="w-5 h-5 text-emerald-600" />
              Information We Collect
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              We only collect information necessary to provide you with the best
              learning experience, such as your profile details and coarse
              progress data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              Third-Party Services
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              We use Stripe for secure payment processing. We never store your
              credit card details on our own servers.
            </p>
          </section>
        </div>

        <div className="pt-12 text-center text-gray-500 text-sm font-medium border-t border-gray-800/50">
          For any privacy-related inquiries, please email{" "}
          <span className="text-emerald-500 font-bold">privacy@eduhub.com</span>
          .
        </div>
      </div>
    </div>
  );
};

export default Privacy;
