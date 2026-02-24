import React from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/CourseCard";
import CourseSkeleton from "@/components/CourseSkeleton";
import { Heart, Search, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { getWishlist } from "@/services/authApi";

const Wishlist = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/profile" className="hover:text-pink-600 transition-colors">
            Profile
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-medium">Wishlist</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <Heart className="w-10 h-10 text-pink-500 fill-pink-500/10" />
          Your Wishlist
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-lg mx-auto">
          Keep track of the courses you're interested in. Your future self will
          thank you for these learning opportunities!
        </p>
      </div>

      {/* Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : data?.courses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="relative bg-white dark:bg-gray-800 p-10 rounded-full shadow-2xl border border-pink-50 dark:border-pink-900/30">
              <Heart className="w-20 h-20 text-pink-200 dark:text-pink-900" />
              <div className="absolute top-4 right-4 bg-pink-500 p-2 rounded-full text-white shadow-lg animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-10">
            Found a course you like but not ready to enroll? Save it here to
            access it later anytime.
          </p>
          <Link to="/courses">
            <Button
              size="lg"
              className="rounded-full px-10 py-6 bg-pink-600 hover:bg-pink-700 text-lg font-bold shadow-xl shadow-pink-500/25 transition-all active:scale-95"
            >
              Explore Courses
              <Search className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
