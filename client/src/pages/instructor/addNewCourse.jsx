import CourseCurriculum from "@/components/instructorView/courses/addNewCourse/courseCurriculum";
import CourseLanding from "@/components/instructorView/courses/addNewCourse/courseLanding";
import CourseSettings from "@/components/instructorView/courses/addNewCourse/courseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { useAuth } from "@/context/authContext";
import { useInstructor } from "@/context/instructorContext";
import { addNewCourseService } from "@/services";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNewCourse() {
  const [activeTab, setActiveTab] = useState("curriculum");
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
  } = useInstructor();
const {auth} = useAuth()
const navigate = useNavigate()


  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validFormData() {
    for (const key in courseLandingFormData) {
      if (Object.prototype.hasOwnProperty.call(courseLandingFormData, key)) {
        const element = courseLandingFormData[key];
        if (isEmpty(element)) {
          return false;
        }
      }
    }
    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  }

  

  async function handleCourseSubmit() {
    const finalCourseFormData = {
      instructorId: auth.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      isPublished: true,
      curriculum: [...courseCurriculumFormData],
    };
    const response = await addNewCourseService(finalCourseFormData)

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData)
      setCourseCurriculumFormData(courseCurriculumInitialFormData)
      navigate("/instructor");
    }
    
  }

  return (
    <div className="w-full flex flex-col">
      <div className=" w-full px-5 my-5 flex justify-between">
        <span className="text-2xl font-bold">Add New Course</span>
        <Button onClick={handleCourseSubmit} disabled={!validFormData()} className={"font-bold text-lg p-5"}>
          Sumbit
        </Button>
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
            <TabsContent value="curriculum">
              {" "}
              <CourseCurriculum />
            </TabsContent>
            <TabsContent value="courseLandingPage">
              <CourseLanding
                formData={courseLandingFormData}
                setFormData={setCourseLandingFormData}
              />
            </TabsContent>
            <TabsContent value="settings">
              {" "}
              <CourseSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCourse;
