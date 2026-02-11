import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
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
import { Link } from "react-router";

const CourseTab = () => {
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
            <Button className="cursor-pointer">Unpublish</Button>
            <Button variant="destructive" className="text-white cursor-pointer">
              Remove Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label>Title</Label>
                <Input type="text" placeholder="Enter course title" />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Subtitle</Label>
                <Input
                  type="text"
                  placeholder="Ex. Complete Web Development Bootcamp"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Description</Label>
                <RichTextEditor />
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">
                        Web Development
                      </SelectItem>
                      <SelectItem value="mobile-development">
                        Mobile Development
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Course Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Price</Label>
                  <Input type="number" placeholder="200" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Course Thumbnail</Label>
                <Input
                  accept="image/*"
                  className="cursor-pointer w-fit"
                  placeholder="Upload course thumbnail"
                  type="file"
                  id="courseThumbnail"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Link to="/admin/courses">
                <Button variant="destructive" className="cursor-pointer text-white">
                  Cancel
                </Button>
              </Link>
              <Button className="cursor-pointer text-white">Update Course</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
