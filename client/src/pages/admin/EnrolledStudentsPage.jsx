import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { useLoadUserQuery } from "@/features/api/authApi";

const EnrolledStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: userData } = useLoadUserQuery();

  useEffect(() => {
    const fetchAllEnrolledStudents = async () => {
      try {
        // Get all courses created by the instructor
        const coursesResponse = await axios.get(
          "http://localhost:3000/api/v1/course",
          { withCredentials: true }
        );
        
        if (!coursesResponse.data?.courses) {
          throw new Error("No courses found");
        }

        const courses = coursesResponse.data.courses;
        const allStudents = new Map(); // Use Map to avoid duplicates

        // Fetch enrolled students for each course
        await Promise.all(courses.map(async (course) => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/v1/course/${course._id}/enrolled-students`,
              { withCredentials: true }
            );
            
            // Add course name to each student
            response.data.students.forEach(student => {
              if (!allStudents.has(student._id)) {
                allStudents.set(student._id, {
                  ...student,
                  enrolledIn: [course.courseTitle]
                });
              } else {
                const existingStudent = allStudents.get(student._id);
                existingStudent.enrolledIn.push(course.courseTitle);
                allStudents.set(student._id, existingStudent);
              }
            });
          } catch (error) {
            console.error(`Error fetching students for course ${course.courseTitle}:`, error);
            // Continue with other courses even if one fails
          }
        }));

        setStudents(Array.from(allStudents.values()));
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
        if (error.response?.status === 401) {
          toast.error("Please login to view enrolled students");
        } else {
          toast.error(error.response?.data?.message || "Failed to fetch enrolled students");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userData?.user?.role === "instructor") {
      fetchAllEnrolledStudents();
    } else {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userData?.user?.role === "instructor") {
    return (
      <div className="flex items-center justify-center h-64">
        <h1 className="text-red-500">Access denied. Only instructors can view this page.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Enrolled Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled In</TableHead>
                <TableHead>Total Courses</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.photoUrl} alt={student.name} />
                      <AvatarFallback>
                        {student.name?.split(" ").map((n) => n[0]).join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.enrolledIn?.join(", ") || "No courses"}
                  </TableCell>
                  <TableCell>{student.enrolledIn?.length || 0}</TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No students enrolled in any courses
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrolledStudentsPage; 