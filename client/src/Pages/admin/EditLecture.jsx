import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
        setValue("videoUrl", lecture.videoUrl);
        if (lecture.videoUrl) {
          setVideoPreview(lecture.videoUrl); // Assuming backend returns videoUrl
          if (!lecture.publicId) {
            setIsYoutube(true);
          }
        }
      }
    }
  }, [courseData, lectureId, setValue]);

  const watchedVideoUrl = watch("videoUrl");
  const isYoutubeMode = isYoutube; // Use local variable for clarity if needed, or just use isYoutube state
  const previewUrl = (isYoutube ? watchedVideoUrl : videoPreview) || "";

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
    if (window.confirm("Are you sure you want to remove this lecture?")) {
      removeLectureMutation.mutate();
    }
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-5">
        <div>
          <Link to={`/admin/courses/${courseId}/lectures`}>
            <Button
              variant="outline"
              type="button"
              className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">Update Your Lecture</h1>
      </div>
      <div className="bg-white rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold ">Edit Lecture</h2>
          <p className="text-gray-500">Make changes to your lecture</p>

          <Button
            disabled={removeLectureMutation.isPending}
            onClick={handleRemoveLecture}
            variant="destructive"
            type="button"
            className="cursor-pointer text-white mt-4 p-2"
          >
            {removeLectureMutation.isPending ? "Removing..." : "Remove Lecture"}
          </Button>

          <div className="mt-10 flex flex-col gap-3">
            <Label>Lecture Title</Label>
            <Input
              type="text"
              placeholder="Enter lecture title"
              {...register("lectureTitle")}
            />
            {errors.lectureTitle && (
              <p className="text-red-500 text-sm">
                {errors.lectureTitle.message}
              </p>
            )}
          </div>
          <div className="mt-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Lecture Video</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="video-source-switch"
                  checked={isYoutube}
                  onCheckedChange={setIsYoutube}
                />
                <Label htmlFor="video-source-switch">YouTube Link</Label>
              </div>
            </div>
            {isYoutube ? (
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                {...register("videoUrl")}
              />
            ) : (
              <Input
                type="file"
                accept="video/*"
                {...register("lectureVideo")}
                onChange={(e) => {
                  handleVideoChange(e);
                  register("lectureVideo").onChange(e); // Ensure react-hook-form also gets the event
                }}
              />
            )}
            {previewUrl && (
              <div className="mt-4 w-full h-64 md:h-96">
                <Label className="mb-2 block">Video Preview</Label>
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
                    className="rounded-lg border border-gray-200"
                  ></iframe>
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full rounded-lg border border-gray-200 object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
          <div className="mt-10 flex items-center gap-2">
            <Switch
              id="free-switch"
              onCheckedChange={(checked) => setValue("isFree", checked)}
            />
            <Label htmlFor="free-switch">Is this video FREE</Label>
          </div>

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {uploadProgress}% Uploaded
              </p>
            </div>
          )}

          <div className="mt-10">
            <Button
              disabled={editLectureMutation.isPending}
              type="submit"
              className="cursor-pointer text-white mt-4 p-2"
            >
              {editLectureMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Lecture"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLecture;
