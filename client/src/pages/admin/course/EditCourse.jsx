import { Button } from "@/components/ui/button";
// import React from "react";
import CourseTab from "./CourseTab";
import { Link } from "react-router-dom";
import EnrolledStudents from "./EnrolledStudents";

const EditCourse = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Course</h1>
          <Button onClick={handlePublishCourse}>
            {isPublished ? "Unpublish Course" : "Publish Course"}
          </Button>
        </div>

        {/* Course Details Form */}
        <Card>
          {/* ... existing form code ... */}
        </Card>

        {/* Lectures Section */}
        <Card>
          {/* ... existing lectures code ... */}
        </Card>

        {/* Enrolled Students Section */}
        <EnrolledStudents />
      </div>
    </div>
  );
};

export default EditCourse;
