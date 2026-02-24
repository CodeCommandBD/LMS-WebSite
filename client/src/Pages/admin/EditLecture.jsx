import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editLectureSchema } from "@/schemas/editLectureSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLectureService,
  editLectureService,
  getCourseById,
} from "@/services/courseApi";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.id;
  const lectureId = params.lectureId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState("");
  const [isYoutube, setIsYoutube] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(editLectureSchema),
    defaultValues: {
      lectureTitle: "",
      lectureVideo: undefined,
      videoUrl: "",
      isFree: false,
      sectionName: "Course Content",
    },
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseData?.course?.lectures) {
      const lecture = courseData.course.lectures.find(
        (l) => l._id === lectureId,
      );
      if (lecture) {
        setValue("lectureTitle", lecture.lectureTitle);
        setValue("isFree", lecture.isPreviewFree);

        if (lecture.videoUrl) {
          setVideoPreview(lecture.videoUrl);
          const isActuallyYoutube = !lecture.videoUrl.includes("cloudinary");
          setIsYoutube(isActuallyYoutube);

          if (isActuallyYoutube) {
            setValue("videoUrl", lecture.videoUrl);
          } else {
            setValue("videoUrl", ""); // Clear it so it doesn't get sent back as a YouTube URL
          }
        }

        if (lecture.sectionName) {
          setValue("sectionName", lecture.sectionName);
        }
      }
    }
  }, [courseData, lectureId, setValue]);

  const watchedVideoUrl = watch("videoUrl");
  const isYoutubeMode = isYoutube; // Use local variable for clarity if needed, or just use isYoutube state
  const previewUrl = (isYoutube ? watchedVideoUrl : videoPreview) || "";
  const isFree = watch("isFree");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const editLectureMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("lectureTitle", data.lectureTitle);
      if (data.lectureVideo && data.lectureVideo[0]) {
        formData.append("video", data.lectureVideo[0]); // Ensure backend expects "video"
      }
      if (data.videoUrl) {
        formData.append("videoUrl", data.videoUrl);
      }
      formData.append("isPreviewFree", data.isFree);
      if (data.sectionName) {
        formData.append("sectionName", data.sectionName);
      }

      return editLectureService(
        courseId,
        lectureId,
        formData,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      );
    },
    onSuccess: () => {
      toast.success("Lecture updated successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setUploadProgress(0); // Reset progress
      navigate(`/admin/courses/${courseId}/lectures`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to edit lecture");
      setUploadProgress(0); // Reset progress on error
    },
  });

  const removeLectureMutation = useMutation({
    mutationFn: () => deleteLectureService(courseId, lectureId), // Make sure this service handles the endpoint correctly
    onSuccess: () => {
      toast.success("Lecture removed successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      navigate(`/admin/courses/${courseId}/lectures`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove lecture");
    },
  });

  const onSubmit = (data) => {
    editLectureMutation.mutate(data);
  };

  const handleRemoveLecture = () => {
    setConfirmOpen(true);
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      {/* Header Section */}
      <div className="flex items-center gap-5">
        <Link to={`/admin/courses/${courseId}/lectures`}>
          <Button
            variant="ghost"
            type="button"
            className="w-12 h-12 rounded-2xl bg-[#1e293b] hover:bg-gray-800 text-gray-400 hover:text-white transition-all shadow-xl flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Edit Lecture
          </h1>
          <p className="text-gray-400 font-medium mt-1">
            Refine your content for a better learning experience
          </p>
        </div>
      </div>

      <Card className="bg-[#1e293b] border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-gray-800/50 flex flex-row items-center justify-between gap-6">
          <div>
            <CardTitle className="text-xl font-extrabold text-white">
              Lecture Settings
            </CardTitle>
            <CardDescription className="text-gray-400 font-medium mt-1">
              Update title, video content, and accessibility.
            </CardDescription>
          </div>
          <Button
            disabled={removeLectureMutation.isPending}
            onClick={handleRemoveLecture}
            variant="destructive"
            type="button"
            className="px-6 py-6 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20 cursor-pointer text-white"
          >
            {removeLectureMutation.isPending ? "Removing..." : "Delete Lecture"}
          </Button>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column: Metadata */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-gray-300 font-bold ml-1">
                    Lecture Title
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter lecture title"
                    className={`bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 font-bold ${errors.lectureTitle ? "ring-2 ring-red-500/50" : ""}`}
                    {...register("lectureTitle")}
                  />
                  {errors.lectureTitle && (
                    <p className="text-red-500 text-xs font-bold ml-1">
                      {errors.lectureTitle.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300 font-bold ml-1">
                    Section / Module Name
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Ex. Module 1: Introduction"
                      className="bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 font-bold"
                      {...register("sectionName")}
                    />

                    {/* Existing Sections Suggestions */}
                    {courseData?.course?.lectures?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                          Select Existing Module:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            new Set(
                              courseData.course.lectures.map(
                                (l) => l.sectionName || "Course Content",
                              ),
                            ),
                          ).map((section) => (
                            <button
                              key={section}
                              type="button"
                              onClick={() => setValue("sectionName", section)}
                              className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold hover:bg-blue-500/20 transition-all cursor-pointer"
                            >
                              {section}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-gray-500 text-[10px] italic ml-1">
                      Grouping lectures by section makes your curriculum
                      organized.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#0f172a] rounded-3xl border border-gray-800 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFree ? "bg-green-500/20 text-green-500" : "bg-gray-800 text-gray-500"}`}
                    >
                      <ArrowLeft
                        className={`w-5 h-5 ${isFree ? "rotate-90" : "-rotate-90"}`}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="free-switch"
                        className="text-white font-bold cursor-pointer"
                      >
                        Preview Mode
                      </Label>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Allow free access
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="free-switch"
                    checked={isFree}
                    onCheckedChange={(checked) => setValue("isFree", checked)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-3 p-6 bg-[#0f172a] rounded-3xl border border-blue-500/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-blue-500 uppercase tracking-widest">
                        Uploading Video
                      </span>
                      <span className="text-xs font-black text-white px-2 py-1 bg-blue-600 rounded-lg">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Video Content */}
              <div className="space-y-8">
                <div className="flex flex-col gap-6 p-6 bg-[#0f172a] rounded-3xl border border-gray-800">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 font-bold">
                      Video Source
                    </Label>
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-900 rounded-xl border border-gray-800">
                      <Switch
                        id="video-source-switch"
                        checked={isYoutube}
                        onCheckedChange={setIsYoutube}
                        className="data-[state=checked]:bg-red-500"
                      />
                      <Label
                        htmlFor="video-source-switch"
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                      >
                        YouTube
                      </Label>
                    </div>
                  </div>

                  {isYoutube ? (
                    <Input
                      type="text"
                      placeholder="Paste YouTube Link (e.g., https://youtu.be/...)"
                      className="bg-[#1e293b] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-red-500 transition-all placeholder:text-gray-700 font-bold text-sm"
                      {...register("videoUrl")}
                    />
                  ) : (
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        id="lectureVideo"
                        {...register("lectureVideo")}
                        onChange={(e) => {
                          handleVideoChange(e);
                          register("lectureVideo").onChange(e);
                        }}
                      />
                      <Label
                        htmlFor="lectureVideo"
                        className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-800 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
                      >
                        <p className="text-gray-500 text-xs font-bold group-hover:text-blue-400 transition-colors uppercase tracking-widest">
                          Select Video File
                        </p>
                      </Label>
                    </div>
                  )}

                  {previewUrl && (
                    <div className="space-y-3 pt-4">
                      <Label className="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-1">
                        Video Preview
                      </Label>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-2 ring-gray-800/50">
                        {isYoutube ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${
                              previewUrl.split("v=")[1]?.split("&")[0] ||
                              previewUrl.split("/").pop()
                            }`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        ) : (
                          <video
                            src={previewUrl}
                            controls
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-10 border-t border-gray-800/50">
              <Link to={`/admin/courses/${courseId}/lectures`}>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-8 py-6 rounded-2xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
                >
                  Discard
                </Button>
              </Link>
              <Button
                disabled={editLectureMutation.isPending}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                {editLectureMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Lecture Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          removeLectureMutation.mutate();
          setConfirmOpen(false);
        }}
        title="Delete Lecture?"
        description="This lecture will be permanently removed and cannot be recovered."
        isLoading={removeLectureMutation.isPending}
      />
    </div>
  );
};

export default EditLecture;
