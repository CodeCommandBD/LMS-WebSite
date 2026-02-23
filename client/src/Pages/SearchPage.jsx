import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CourseCard from "@/components/CourseCard";
import {
  Filter,
  SlidersHorizontal,
  Search,
  BookOpen,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories } from "@/services/categoryApi";
import CourseSkeleton from "@/components/CourseSkeleton";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.getAll("categories"),
  );
  const [selectedLevels, setSelectedLevels] = useState(
    searchParams.getAll("levels"),
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [
      "searchCourses",
      query,
      selectedCategories,
      selectedLevels,
      sort,
      page,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      selectedCategories.forEach((c) => params.append("categories", c));
      selectedLevels.forEach((l) => params.append("levels", l));
      params.append("sort", sort);
      params.append("page", page);
      params.append("limit", "12");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/v1/courses/published?${params.toString()}`,
      );
      return response.data;
    },
    keepPreviousData: true,
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleCategoryChange = (category) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(next);
    updateParams({ categories: next });
  };

  const handleLevelChange = (level) => {
    const next = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    setSelectedLevels(next);
    updateParams({ levels: next });
  };

  const updateParams = (newParams) => {
    const current = new URLSearchParams(searchParams);

    if (newParams.categories) {
      current.delete("categories");
      newParams.categories.forEach((c) => current.append("categories", c));
    }
    if (newParams.levels) {
      current.delete("levels");
      newParams.levels.forEach((l) => current.append("levels", l));
    }
    if (newParams.sort) {
      current.set("sort", newParams.sort);
    }
    setSearchParams(current);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSearchParams({ q: query });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>Courses</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Search Results</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {query ? `Results for "${query}"` : "All Courses"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {data?.courses?.length || 0} courses found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 rounded-full"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateParams({ sort: e.target.value });
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${showFilters ? "fixed inset-0 z-60 bg-white dark:bg-gray-900 p-6" : "hidden"} md:block md:w-64 space-y-8 shrink-0`}
        >
          <div className="flex items-center justify-between md:hidden mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <X className="w-6 h-6" onClick={() => setShowFilters(false)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Category
              </h3>
              {(selectedCategories.length > 0 || selectedLevels.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="space-y-3">
              {isCategoriesLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-xs text-gray-500">Loading...</span>
                </div>
              ) : (
                categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryChange(cat.name)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-gray-600 checked:bg-blue-600 checked:border-blue-600 transition-all"
                      />
                      <svg
                        className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))
              )}
              {categories.length === 0 && !isCategoriesLoading && (
                <p className="text-xs text-gray-500 italic py-2">
                  No categories found
                </p>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Course Level
            </h3>
            <div className="space-y-3">
              {LEVELS.map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleLevelChange(level)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 dark:border-gray-600 checked:bg-purple-600 checked:border-purple-600 transition-all"
                    />
                    <svg
                      className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Button
            className="md:hidden w-full mt-8 rounded-xl bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </Button>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : data?.courses?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {data.totalPages > 1 && data.currentPage < data.totalPages && (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-6 border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all active:scale-95"
                    onClick={() => {
                      const nextPage = data.currentPage + 1;
                      const current = new URLSearchParams(searchParams);
                      current.set("page", nextPage);
                      setSearchParams(current);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Load More Results
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                We couldn't find any courses matching your search or filters.
                Try adjusting your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
