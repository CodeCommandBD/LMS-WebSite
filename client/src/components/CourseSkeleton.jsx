import React from "react";

const CourseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700/30 animate-pulse">
      <div className="p-3">
        <div className="aspect-16/10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
      <div className="p-5 pt-1 space-y-4 grow">
        <div className="flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="mt-auto pt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSkeleton;
