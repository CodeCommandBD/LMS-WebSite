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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
