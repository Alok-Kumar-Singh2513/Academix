import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const EnrolledStudents = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/course/${courseId}/enrolled-students`,
          { withCredentials: true }
        );
        setStudents(response.data.students);
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

    if (courseId) {
      fetchEnrolledStudents();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enrolled Students ({students.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Enrolled Courses</TableHead>
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
                <TableCell>{student.enrolledCourses?.length || 0}</TableCell>
                <TableCell>
                  {new Date(student.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No students enrolled yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EnrolledStudents; 