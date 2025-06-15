import MediaProgressBar from "@/components/mediaProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useInstructor } from "@/context/instructorContext";
import { mediaUploadService } from "@/services";
import React from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    setMediaUploadProgressPercentage,
    setMediaUploadProgress,
    mediaUploadProgress,
    mediaUploadProgressPercentage,
  } = useInstructor();
  async function handleCourseImageChange(file) {
    if (file) {
      try {
        setMediaUploadProgress(true);
        let courseImageFormData = new FormData();
        courseImageFormData.append("file", file);
        const result = await mediaUploadService(
          courseImageFormData,
          setMediaUploadProgressPercentage
        );
        if (result?.success) {
          let cpyCourseLandingFormData = { ...courseLandingFormData };
          cpyCourseLandingFormData = {
            ...cpyCourseLandingFormData,
            image: result?.data?.url,
          };
          setCourseLandingFormData(cpyCourseLandingFormData);
        }
        setMediaUploadProgress(false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"text-xl"}>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : courseLandingFormData?.image !== '' ? <img src={courseLandingFormData?.image}/> : (
          <>
            <p className="text-shadow-md font-medium mb-3">Add Course Image</p>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-12 h-10 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleCourseImageChange(e?.target?.files?.[0]);
                  }}
                />
              </label>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
