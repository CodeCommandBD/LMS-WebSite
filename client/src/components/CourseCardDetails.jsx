import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Loader2,
  Star,
  PlayCircle,
  Lock,
  Clock,
  Globe,
  Users,
  Award,
  ChevronRight,
  Info,
  CheckCircle2,
  ChevronDown,
  Share2,
  Heart,
  Gift,
  FileText,
  Smartphone,
  Tv,
} from "lucide-react";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CourseCardDetails = () => {
  const { course, isLoading, isError, error } = useCourseDetails();
  const [activeTab, setActiveTab] = useState("About");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading course details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
          <Info className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-6">
            {error?.message || "Could not fetch course details."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const tabs = ["About", "Curriculum", "Instructor", "Reviews"];

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Courses</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-semibold truncate">{course.category || "General"}</span>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
        
        {/* LEFT SECTION: Info & Content */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-100 group">
              <img 
                src={course.courseThumbnail} 
                alt={course.courseTitle} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-white/90 p-4 rounded-full shadow-lg">
                    <PlayCircle className="h-12 w-12 text-blue-600" />
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <Badge className="bg-blue-600 hover:bg-blue-600 text-white rounded-md px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                BEST SELLER
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {course.courseTitle}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-4 w-4 ${i === 5 ? 'text-gray-300' : 'fill-current'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">4.9</span>
                    <span className="text-gray-500 text-sm">(12,430 ratings)</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold">45,000+ Students</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 sticky top-20 bg-white z-20 pt-2">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold transition-all relative ${
                    activeTab === tab 
                    ? "text-blue-600" 
                    : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* About this course */}
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100/50">
              <h2 className="text-2xl font-black text-gray-900 mb-8">About this course</h2>
              <div 
                className="prose prose-blue max-w-none text-gray-600 leading-relaxed description-content mb-10"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Master manual mode and settings",
                  "Understand lighting and composition",
                  "Professional editing workflow",
                  "Landscape & Portrait mastery"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900">Course Curriculum</h2>
                  <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">
                    12 Sections • 84 Lectures • 22h 15m total length
                  </span>
               </div>

               <div className="space-y-4">
                  {/* Mocking major sections like in the image */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between p-5 bg-gray-50/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                         <ChevronDown className="h-5 w-5 text-gray-400" />
                         <h3 className="font-bold text-gray-900">Section {course.lectures ? '1' : '0'}: The Foundations</h3>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">{course.lectures?.length || 0} Lessons • 45m</span>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      {course.lectures?.map((lecture, index) => (
                        <div key={lecture._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                           <div className="flex items-center gap-4">
                              {index === 0 
                                ? <PlayCircle className="h-5 w-5 text-blue-500" />
                                : <Lock className="h-4 w-4 text-gray-300" />
                              }
                              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                {index + 1}. {lecture.lectureTitle}
                              </span>
                           </div>
                           <div className="flex items-center gap-4">
                              {index === 0 && <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600">Preview</span>}
                              <span className="text-xs text-gray-400 font-medium">10:15</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Instructor */}
            <div className="pt-10 space-y-8">
               <h2 className="text-2xl font-black text-gray-900">Instructor</h2>
               <div className="flex flex-col md:flex-row gap-8 items-start bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                       <img src="https://github.com/shadcn.png" alt="instructor" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-full shadow-lg">
                       <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-black text-gray-900">
                      {course.creator?.name || "David Sterling"}
                    </h3>
                    <p className="text-blue-600 text-sm font-bold">National Geographic Contributor & Commercial Photographer</p>
                    <div className="flex gap-6 text-sm">
                       <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-bold">4.9 Instructor Rating</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="font-bold">215,000 Students</span>
                       </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                       David has spent the last 15 years traveling the globe capturing stunning landscapes and intimate portraits. His work has been featured in international galleries...
                    </p>
                    <Button variant="link" className="text-blue-600 font-black p-0 h-auto hover:text-blue-800 transition-colors">
                      View Full Profile <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDEBAR (Pricing & Sticky) */}
        <div className="lg:col-span-4 lg:relative">
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-8 space-y-8 transition-transform hover:-translate-y-1">
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">৳{course.price}</span>
                  <span className="text-lg text-gray-400 line-through font-medium">৳{course.price + 500}</span>
                  <Badge className="bg-green-100 text-green-700 border-0 font-bold px-2 py-0.5">40% OFF</Badge>
                </div>
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                   <Clock className="h-3 w-3 animate-pulse" />
                   <span>18 hours left at this price!</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]">
                  Enroll Now
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-xl border-2 border-gray-100 font-black text-lg hover:bg-gray-50 transition-all">
                  Add to Cart
                </Button>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                  30-day money-back guarantee
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="font-black text-gray-900 text-sm">This course includes:</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: PlayCircle, text: `${course.lectures?.length || 0} hours on-demand video` },
                    { icon: FileText, text: "15 downloadable resources" },
                    { icon: Globe, text: "Full lifetime access" },
                    { icon: Smartphone, text: "Access on mobile and TV" },
                    { icon: Award, text: "Certificate of completion" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <item.icon className="h-4 w-4 text-blue-500" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  <Share2 className="h-4 w-4" /> Share
                </button>
                <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest">
                  <Heart className="h-4 w-4" /> Save
                </button>
                <button className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  <Gift className="h-4 w-4" /> Gift
                </button>
              </div>
            </div>

            <div className="flex bg-gray-100/50 rounded-2xl p-2 border border-gray-200">
               <input 
                type="text" 
                placeholder="Enter Coupon Code" 
                className="bg-transparent border-0 flex-1 px-4 text-sm font-bold placeholder:text-gray-400 focus:ring-0" 
               />
               <Button variant="ghost" className="text-blue-600 font-black text-xs hover:bg-white rounded-xl shadow-sm transition-all">
                 Apply
               </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseCardDetails;
