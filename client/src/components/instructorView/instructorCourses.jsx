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
import { useInstructor } from "@/context/instructorContext";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";

function InstructorCourses({listOfCourses}) {
  const navigate = useNavigate();
  const {
    currentEditedCourseId,
    setCurrentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  } = useInstructor();


  return (
    <div className="w-full">
      <Card>
        <CardHeader className={"flex justify-between"}>
          <CardTitle className={"text-2xl "}>All Courses</CardTitle>
          <Button
            className={"p-5.5 cursor-pointer text-[17px]"}
            onClick={() => {
              navigate("/instructor/add-new-course");
              setCourseCurriculumFormData(courseCurriculumInitialFormData)
              setCourseLandingFormData(courseLandingInitialFormData)
              setCurrentEditedCourseId(null)
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
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((courseItem) => (
                    <TableRow key={courseItem?._id}>
                      <TableCell className="font-medium">
                        {courseItem?.title}
                      </TableCell>
                      <TableCell className={"font-semibold"}>{courseItem?.students?.length}</TableCell>
                      <TableCell className={"font-semibold"}>$ {courseItem?.pricing}</TableCell>
                      <TableCell className="text-right font-semibold">
                        <Button
                          variant={"outline"}
                          className={"border-none shadow-none"}
                          onClick={() => { 
                            setCurrentEditedCourseId(courseItem?._id)
                            navigate(`/instructor/edit-course/${courseItem?._id}`)
                           }}
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
                  ))
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorCourses;
