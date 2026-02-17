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
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useEditCourse from "@/hooks/useEditCourse";

const CourseTab = () => {
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
    <div>
      <Card>
        <CardHeader className="flex md:flex-row flex-col items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Course Information
            </CardTitle>
            <CardDescription>
              <p className="text-lg font-semibold">
                Update your course information
              </p>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => togglePublishCourseMutaion.mutate()}
              className="cursor-pointer"
            >
              {course?.isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="destructive" className="text-white cursor-pointer">
              Remove Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label>Title</Label>
                <Input
                  {...register("courseTitle")}
                  type="text"
                  placeholder="Enter course title"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Subtitle</Label>
                <Input
                  {...register("subTitle")}
                  type="text"
                  placeholder="Ex. Complete Web Development Bootcamp"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="next js">Next js</SelectItem>
                          <SelectItem value="react js">React js</SelectItem>
                          <SelectItem value="node js">Node js</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
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
                          <SelectItem value="ant design">Ant Design</SelectItem>
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
                <div className="flex flex-col gap-3">
                  <Label>Course Level</Label>
                  <Controller
                    name="courseLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course level" />
                        </SelectTrigger>
                        <SelectContent>
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
                <div className="flex flex-col gap-3">
                  <Label>Price</Label>
                  <Input
                    {...register("price")}
                    type="number"
                    placeholder="200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Course Thumbnail</Label>
                <Input
                  {...register("courseThumbnail")}
                  onChange={(e) => {
                    register("courseThumbnail").onChange(e);
                    if (e.target.files && e.target.files[0]) {
                      selectThumbnail(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="cursor-pointer w-fit"
                  placeholder="Upload course thumbnail"
                  type="file"
                  id="courseThumbnail"
                />
                {previewThumbnail && (
                  <img
                    src={previewThumbnail}
                    alt="Course Thumbnail"
                    className="w-[200px] h-[200px] my-2 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Link to="/admin/courses">
                <Button
                  variant="destructive"
                  className="cursor-pointer text-white"
                >
                  Cancel
                </Button>
              </Link>
              <Button className="cursor-pointer text-white">
                Update Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
