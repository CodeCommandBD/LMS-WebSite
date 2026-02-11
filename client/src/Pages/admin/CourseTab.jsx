import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";

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
            <Button>Unpublish</Button>
            <Button variant="destructive">Remove Course</Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CourseTab;
