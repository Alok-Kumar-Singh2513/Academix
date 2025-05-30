import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetCreatorCourseQuery,
  useRemoveCourseMutation,
  usePublishCourseMutation,
} from "@/features/api/courseApi";

import { DeleteIcon, Edit } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CourseTable = () => {
  const { data, isLoading, refetch } = useGetCreatorCourseQuery();

  const navigate = useNavigate();
  const [removeCourse] = useRemoveCourseMutation();
  const [publishCourse] = usePublishCourseMutation();

  const deleteCourse = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;

    try {
      if (!courseId) return;
      await removeCourse(courseId).unwrap();
      toast.success("Course deleted successfully");
      refetch();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handlePublishStatus = async (courseId, currentStatus) => {
    try {
      const response = await publishCourse({
        courseId,
        query: currentStatus ? "false" : "true"
      }).unwrap();
      toast.success(response.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update course status");
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  // console.log(data);

  return (
    <div>
      <Button onClick={() => navigate(`create`)}>Create a new course</Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Publish</TableHead>
            <TableHead className="text-right">Delete</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">
                {course?.coursePrice || "NA"}
              </TableCell>
              <TableCell>
                <Badge>{course.isPublished ? "Published" : "Draft"}</Badge>
              </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant={course.isPublished ? "destructive" : "default"}
                  onClick={() => handlePublishStatus(course._id, course.isPublished)}
                  disabled={!course.lectures || course.lectures.length === 0}
                >
                  {course.isPublished ? "Unpublish" : "Publish"}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteCourse(`${course._id}`)}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${course._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
