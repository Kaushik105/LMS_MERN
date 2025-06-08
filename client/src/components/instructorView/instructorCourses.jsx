import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "lucide-react";

function InstructorCourses() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <Card>
        <CardHeader className={"flex justify-between"}>
          <CardTitle className={"text-2xl "}>All Courses</CardTitle>
          <Button
            className={"p-5.5 cursor-pointer text-[17px]"}
            onClick={() => {
              navigate("/instructor/add-new-course");
            }}
          >
            Add New Course
          </Button>
        </CardHeader>
        <CardContent>
          <Table className={"w-full"}>
            <TableHeader>
              <TableRow className={"text-lg"}>
                <TableHead className="w-[400px]">Course Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={"text-[17px]"}>
              <TableRow>
                <TableCell className="font-medium">
                  React and Redux full course 2025
                </TableCell>
                <TableCell className={"font-semibold"}>355</TableCell>
                <TableCell className={"font-semibold"}>$ 5000</TableCell>
                <TableCell className="text-right font-semibold">
                  <Button
                    variant={"outline"}
                    className={"border-none shadow-none"}
                  >
                    <EditIcon className="size-[22px]" />
                  </Button>
                  <Button
                    variant={"outline"}
                    className={"border-none shadow-none"}
                  >
                    <DeleteIcon className="size-[22px]" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorCourses;
