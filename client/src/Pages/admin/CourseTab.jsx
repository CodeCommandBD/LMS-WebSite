import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";
import useEditCourse from "@/hooks/useEditCourse";

const CourseTab = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    previewThumbnail,
    selectThumbnail,
    onSubmit,
    isLoading,
    isError,
    isPending,
    togglePublishCourseMutaion,
    course,
  } = useEditCourse();

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Failed to load course data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Edit Course
          </h1>
          <p className="text-gray-400 font-medium mt-1">
            Fine-tune your course details and settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => togglePublishCourseMutaion.mutate()}
            className={`px-6 py-6 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
              course?.isPublished
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                : "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
            }`}
          >
            {course?.isPublished ? "Unpublish Course" : "Publish Course"}
          </Button>
          <Button
            variant="destructive"
            className="px-6 py-6 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20 cursor-pointer text-white"
          >
            Delete Course
          </Button>
        </div>
      </div>

      <Card className="bg-[#1e293b] border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-gray-800/50">
          <CardTitle className="text-xl font-extrabold text-white">
            Course Configuration
          </CardTitle>
          <CardDescription className="text-gray-400 font-medium italic">
            Please provide accurate information to enhance student engagement.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-gray-300 font-bold ml-1">
                    Course Title
                  </Label>
                  <Input
                    {...register("courseTitle")}
                    type="text"
                    placeholder="Enter course title"
                    className="bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300 font-bold ml-1">
                    Catchy Subtitle
                  </Label>
                  <Input
                    {...register("subTitle")}
                    type="text"
                    placeholder="Ex. Complete Web Development Bootcamp"
                    className="bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300 font-bold ml-1">
                    Course Description
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="rounded-2xl overflow-hidden border border-gray-800 bg-[#0f172a]">
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-gray-300 font-bold ml-1">
                      Category
                    </Label>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          key={field.value}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-[#0f172a] border-none rounded-2xl h-14 text-white px-6 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e293b] border-gray-800 text-white rounded-2xl shadow-2xl">
                            <SelectItem value="next js">Next js</SelectItem>
                            <SelectItem value="react js">React js</SelectItem>
                            <SelectItem value="node js">Node js</SelectItem>
                            <SelectItem value="javascript">
                              JavaScript
                            </SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="c++">C++</SelectItem>
                            <SelectItem value="c#">C#</SelectItem>
                            <SelectItem value="c">C</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="bootstrap">Bootstrap</SelectItem>
                            <SelectItem value="tailwind">Tailwind</SelectItem>
                            <SelectItem value="material ui">
                              Material UI
                            </SelectItem>
                            <SelectItem value="ant design">
                              Ant Design
                            </SelectItem>
                            <SelectItem value="vue js">Vue js</SelectItem>
                            <SelectItem value="angular">Angular</SelectItem>
                            <SelectItem value="svelte">Svelte</SelectItem>
                            <SelectItem value="laravel">Laravel</SelectItem>
                            <SelectItem value="symfony">Symfony</SelectItem>
                            <SelectItem value="ruby on rails">
                              Ruby on Rails
                            </SelectItem>
                            <SelectItem value="django">Django</SelectItem>
                            <SelectItem value="flask">Flask</SelectItem>
                            <SelectItem value="express">Express</SelectItem>
                            <SelectItem value="nest js">Nest js</SelectItem>
                            <SelectItem value="spring">Spring</SelectItem>
                            <SelectItem value="hibernate">Hibernate</SelectItem>
                            <SelectItem value="mybatis">MyBatis</SelectItem>
                            <SelectItem value="web-development">
                              Web Development
                            </SelectItem>
                            <SelectItem value="mobile-development">
                              Mobile Development
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300 font-bold ml-1">
                      Course Level
                    </Label>
                    <Controller
                      name="courseLevel"
                      control={control}
                      render={({ field }) => (
                        <Select
                          key={field.value}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-[#0f172a] border-none rounded-2xl h-14 text-white px-6 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select course level" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e293b] border-gray-800 text-white rounded-2xl shadow-2xl">
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300 font-bold ml-1">
                    Price (৳)
                  </Label>
                  <Input
                    {...register("price")}
                    type="number"
                    placeholder="200"
                    className="bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all font-extrabold text-xl placeholder:text-gray-600 tabular-nums"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300 font-bold ml-1 text-sm">
                    Course Appearance
                  </Label>
                  <div className="flex flex-col gap-5 p-6 bg-[#0f172a] rounded-3xl border border-dashed border-gray-800">
                    <div className="flex flex-col items-center gap-4 text-center">
                      {previewThumbnail ? (
                        <div className="relative group w-full">
                          <img
                            src={previewThumbnail}
                            alt="Course Thumbnail"
                            className="w-full h-48 object-cover rounded-2xl shadow-xl ring-2 ring-gray-800 group-hover:ring-blue-500/30 transition-all"
                          />
                          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-2xl transition-all">
                            <Label
                              htmlFor="courseThumbnail"
                              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                            >
                              Change Image
                            </Label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-800">
                          <p className="text-gray-600 text-sm font-bold">
                            No image selected
                          </p>
                        </div>
                      )}

                      <Input
                        {...register("courseThumbnail")}
                        onChange={(e) => {
                          register("courseThumbnail").onChange(e);
                          if (e.target.files && e.target.files[0]) {
                            selectThumbnail(e.target.files[0]);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                        type="file"
                        id="courseThumbnail"
                      />
                      {!previewThumbnail && (
                        <Label
                          htmlFor="courseThumbnail"
                          className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2.5 rounded-xl text-xs font-bold transition-all border border-gray-700/50"
                        >
                          Select Thumbnail
                        </Label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-10 border-t border-gray-800/50">
              <Button
                type="button"
                variant="ghost"
                className="px-8 py-6 rounded-2xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
                onClick={() => navigate("/admin/courses")}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Course Settings"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
