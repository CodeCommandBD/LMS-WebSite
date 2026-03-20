import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, Calendar, User, BookOpen, Download, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fetchVerification = (id) => api.get(`/certificates/verify/${id}`).then((r) => r.data.certificate);

const VerifyCertificate = () => {
  const { id } = useParams();

  const { data: cert, isLoading, isError } = useQuery({
    queryKey: ["verifyCertificate", id],
    queryFn: () => fetchVerification(id),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Verifying achievement credentials...</p>
        </div>
      </div>
    );
  }

  if (isError || !cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-2xl border-2 border-dashed border-red-100 dark:border-red-900/20 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Invalid Certificate</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The certificate ID you provided is either invalid or has been revoked. Please check the ID and try again.
          </p>
          <Link to="/">
            <Button className="rounded-full w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 shadow-xl shadow-blue-500/20">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to EduHub
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700/30">
          {/* Status Header */}
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Verified Achievement</h1>
                <p className="text-emerald-50 opacity-90 font-medium">This certificate is authentic and valid.</p>
              </div>
            </div>
            <div className="px-6 py-2 bg-black/10 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest backdrop-blur-sm">
              ID: {cert.certificateId}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Recipient Details */}
              <div className="space-y-10">
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <User className="w-3 h-3" /> Recipient Information
                  </h3>
                  <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                    <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-gray-800 shadow-xl">
                      <AvatarImage src={cert.userId?.profilePicture} />
                      <AvatarFallback className="text-2xl font-black bg-blue-100 text-blue-600">
                        {cert.userId?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                        {cert.userId?.name}
                      </h4>
                      <p className="text-gray-500 font-medium text-sm">Verified Student</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> Credential Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
                      <span className="text-sm text-gray-500 font-medium">Issue Date</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(cert.issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
                      <span className="text-sm text-gray-500 font-medium">Issuer</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">EduHub LMS Platform</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-gray-500 font-medium">Status</span>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-full">
                        Permanent Record
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Course Details */}
              <div className="space-y-10">
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Course Accomplishment
                  </h3>
                  <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[40px] border border-blue-100 dark:border-blue-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                      <ShieldCheck className="w-32 h-32 text-blue-600" />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4 relative z-10">
                      {cert.courseId?.courseTitle}
                    </h4>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-xs text-gray-500 font-medium">Instructed by</span>
                      <span className="text-xs font-bold text-blue-600">{cert.courseId?.creator?.name}</span>
                    </div>
                  </div>
                </section>

                <div className="pt-4">
                  <Link to={`/courseDetails/${cert.courseId?._id}`}>
                    <Button variant="outline" className="w-full rounded-2xl h-14 font-bold border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95">
                      <Download className="w-4 h-4 mr-2" />
                      View Course Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
          This verification page is hosted by EduHub to confirm that the individual named above has successfully met all the requirements to be awarded this certificate of completion.
        </p>
      </div>
    </div>
  );
};

export default VerifyCertificate;
