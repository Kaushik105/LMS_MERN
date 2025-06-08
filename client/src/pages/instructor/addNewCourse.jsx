import CourseCurriculum from "@/components/instructorView/courses/addNewCourse/courseCurriculum";
import CourseLanding from "@/components/instructorView/courses/addNewCourse/courseLanding";
import CourseSettings from "@/components/instructorView/courses/addNewCourse/courseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructor } from "@/context/instructorContext";
import React, { useState } from "react";

function AddNewCourse() {
const [activeTab, setActiveTab] = useState("curriculum")
const { courseLandingFormData, setCourseLandingFormData } = useInstructor();

  return (
    <div className="w-full flex flex-col">
      <div className=" w-full px-5 my-5 flex justify-between">
        <span className="text-2xl font-bold">Add New Course</span>
        <Button className={"font-bold text-lg p-5"}>Sumbit</Button>
      </div>
      <Card className={"m-5"}>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="courseLandingPage">
                Course Landing Page
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="curriculum"> <CourseCurriculum/></TabsContent>
            <TabsContent value="courseLandingPage">
              <CourseLanding formData={courseLandingFormData} setFormData={setCourseLandingFormData}/>
            </TabsContent>
            <TabsContent value="settings"> <CourseSettings/></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCourse;
