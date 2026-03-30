import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, Users } from "lucide-react";
import { useInstructor } from "@/context/instructorContext";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function instructorDashboard() {
  const { instructorCoursesList } = useInstructor();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:p-4 p-2 lg:gap-6 gap-2">
        <Card>
          <CardHeader className={"flex justify-between items-center"}>
            <CardTitle className={" text-xl lg:text-2xl font-semibold"}>
              Students
            </CardTitle>
            <Users />
          </CardHeader>
          <CardContent className={"text-xl font-bold"}>
            {instructorCoursesList &&
              instructorCoursesList.reduce((acc, obj, index) => {
                return acc + obj.students.length;
              }, 0)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={"flex justify-between items-center"}>
            <CardTitle className={"text-xl lg:text-2xl font-semibold"}>
              Total Revenue
            </CardTitle>
            <DollarSign />
          </CardHeader>
          <CardContent className={"text-xl font-bold"}>
            {instructorCoursesList &&
              instructorCoursesList.reduce((acc, obj, index) => {
                return acc + obj.students.length * obj.pricing;
              }, 0)}
          </CardContent>
        </Card>
      </div>
      <div className="lg:p-4 p-2">
        <Table>
          <TableCaption>Students data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className={"text-center"}>Courses Enrolled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instructorCoursesList?.flatMap((course) =>
              (course.students || []).map((student, index) => (
                <TableRow key={`${course._id}-${student.studentId || index}`}>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.studentEmail}</TableCell>
                  <TableCell className={"text-center"}>{course.title}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default instructorDashboard;
