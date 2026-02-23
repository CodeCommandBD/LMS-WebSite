import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { AlertCircle, Home, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const GlobalErrorPage = () => {
  const error = useRouteError();
  console.error("Router Catch-all Error:", error);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Cinematic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] text-red-500 shadow-2xl shadow-red-500/10">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Unexpected <span className="text-red-500">System Error</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            The application encountered an internal fault. Our engineers have
            been alerted, but for now, let's get you back to safety.
          </p>
        </div>

        {error?.statusText || error?.message ? (
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 max-w-md mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">
              Error Signature
            </p>
            <code className="text-sm font-mono text-red-400/80 break-all leading-snug font-bold">
              {error.statusText || error.message}
            </code>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-7 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-2xl backdrop-blur-xl transition-all active:scale-95 flex items-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Restore Session
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full px-12 py-7 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-3">
              <Home className="w-5 h-5" />
              Return Home
            </Button>
          </Link>
        </div>

        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] pt-8">
          ErrorCode: 0x882A - LMS Internal Failover
        </p>
      </div>
    </div>
  );
};

export default GlobalErrorPage;
