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
          "http://localhost:8080/api/v1/course",
          { withCredentials: true }
        );
        
        const courses = coursesResponse.data.courses;
        const allStudents = new Map(); // Use Map to avoid duplicates

        // Fetch enrolled students for each course
        for (const course of courses) {
          const response = await axios.get(
            `http://localhost:8080/api/v1/course/${course._id}/enrolled-students`,
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
        }

        setStudents(Array.from(allStudents.values()));
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
        toast.error("Failed to fetch enrolled students");
      } finally {
        setLoading(false);
      }
    };

    if (userData?.user?.role === "instructor") {
      fetchAllEnrolledStudents();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {student.enrolledIn.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell>{student.enrolledIn.length}</TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No students enrolled yet
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