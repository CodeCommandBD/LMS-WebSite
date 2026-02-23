import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="relative group">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 select-none">
          404
        </h1>
        <div className="absolute inset-0 blur-2xl bg-linear-to-r from-blue-600/30 to-purple-600/30 -z-10 group-hover:scale-110 transition-transform duration-500" />
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Whoops! Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
      </div>

      <Link
        to="/"
        className="mt-10 flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 active:scale-95"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="mt-12 flex items-center gap-2 text-gray-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Error Code: 404_PAGE_NOT_FOUND</span>
      </div>
    </div>
  );
};

export default NotFound;
