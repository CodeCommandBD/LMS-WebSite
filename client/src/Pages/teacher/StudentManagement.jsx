import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseStudentsService } from "@/services/courseApi";
import { 
  Users, 
  ArrowLeft, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";

const StudentManagement = () => {
  const { id: courseId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["courseStudents", courseId],
    queryFn: () => getCourseStudentsService(courseId),
  });

  const students = data?.students || [];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10">
      <SEO title="Student Management" description="Manage your students and track their progress." />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link 
              to="/admin/courses" 
              className="group flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors mb-4"
            >
              <div className="p-2 rounded-xl bg-gray-900/50 group-hover:bg-blue-500/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Back to Courses</span>
            </Link>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
               <Users className="w-10 h-10 text-blue-500" />
               Student Management
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
               Monitor enrollment and track real-time progress for your students.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                   placeholder="Search students..." 
                   className="bg-gray-900/50 border-gray-800 rounded-2xl pl-10 h-12 w-full md:w-64 focus:ring-2 focus:ring-blue-500 transition-all"
                />
             </div>
             <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-12 px-6 font-bold shadow-xl shadow-blue-500/20">
                <FileText className="w-4 h-4 mr-2" /> Export CSV
             </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-900/50 rounded-3xl border border-gray-800" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-32 bg-gray-900/20 rounded-[40px] border border-dashed border-gray-800">
             <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-gray-700" />
             </div>
             <h2 className="text-2xl font-black text-gray-400">No students found</h2>
             <p className="text-gray-600 font-bold uppercase tracking-widest text-xs mt-2">Start publishing content to attract learners!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div 
                key={student._id} 
                className="group relative bg-[#0f172a] hover:bg-[#1e293b] rounded-[32px] p-6 border border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-4 ring-gray-900 group-hover:ring-blue-500/20 transition-all">
                      <AvatarImage src={student.profilePicture} />
                      <AvatarFallback className="bg-blue-600 text-xl font-black">{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-white truncate">{student.name}</h3>
                      <p className="text-xs text-gray-500 truncate font-bold uppercase tracking-wider mt-0.5">{student.email}</p>
                    </div>
                  </div>
                  {student.isCompleted ? (
                    <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-xl">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="text-blue-500 bg-blue-500/10 p-2 rounded-xl">
                       <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-gray-500">Course Progress</span>
                      <span className="text-blue-400">{student.progress}%</span>
                   </div>
                   <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000"
                        style={{ width: `${student.progress}%` }}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-800/50">
                   <div>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Enrolled On</p>
                      <p className="text-xs font-bold text-gray-300">{new Date(student.enrolledAt).toLocaleDateString()}</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Access Until</p>
                      <p className={`text-xs font-bold ${student.expiryDate && new Date() > new Date(student.expiryDate) ? 'text-rose-500' : 'text-gray-300'}`}>
                         {student.expiryDate ? new Date(student.expiryDate).toLocaleDateString() : "Lifetime"}
                      </p>
                   </div>
                </div>

                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <Button variant="outline" className="w-full rounded-2xl border-gray-800 bg-transparent hover:bg-white/5 font-bold h-11">
                      View full details <ExternalLink className="w-3 h-3 ml-2" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
