import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, PlayCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (courseId) {
      // Invalidate course status to show "Go to Course" instead of "Enroll"
      queryClient.invalidateQueries(["courseStatus", courseId]);
    }
  }, [courseId, queryClient]);

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">
            Validating purchase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-600 font-medium leading-relaxed">
            Your enrollment is being processed. You can now access all the
            lectures in this course.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate(`/course-progress/${courseId}`)}
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-100 group"
          >
            Start Learning{" "}
            <PlayCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full h-12 text-gray-500 font-bold hover:text-gray-900 hover:bg-gray-100 rounded-xl"
          >
            Return Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          A confirmation email has been sent to your inbox
        </p>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
