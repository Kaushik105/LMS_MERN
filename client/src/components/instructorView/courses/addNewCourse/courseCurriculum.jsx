import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { courseCurriculumInitialFormData } from "@/config";
import { useInstructor } from "@/context/instructorContext";
import { mediaUploadService } from "@/services";
import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";

function CourseCurriculum() {
  const { courseCurriculumFormData, setCourseCurriculumFormData } =
    useInstructor();

  function handleAddNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }
  function handleChangeFormData(key, value, index) {
    let cpyFormData = [...courseCurriculumFormData];
    cpyFormData[index] = { ...cpyFormData[index], [key]: value };
    setCourseCurriculumFormData(cpyFormData);
  }

  async function handleLectureFileChange(value, index) {

    if (value) {
      try {
        const videoFormdata = new FormData();
        videoFormdata.append("file", value);
        const result = await mediaUploadService(videoFormdata);
        if (result?.success) {
          let cpyFormData = [...courseCurriculumFormData];
          cpyFormData[index] = {
            ...cpyFormData[index],
            public_id: result?.data?.public_id,
            videoUrl: result?.data?.url,
          };
          setCourseCurriculumFormData(cpyFormData);
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  console.log(courseCurriculumFormData);
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"text-xl"}>Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 w-full">
          <Button className={"w-30 h-10"} onClick={handleAddNewLecture}>
            Add Lecture
          </Button>
          {courseCurriculumFormData?.map((formItem, index) => (
            <div
              key={index}
              className="w-full border p-3 flex gap-3 flex-col rounded-md"
            >
              <div className=" flex gap-5 items-center">
                <h1 className="text-lg font-semibold">Lecture {index + 1}</h1>
                <Input
                  name={`title-${index}`}
                  placeholder={"Enter lecture title"}
                  className={"flex-1 max-w-lg"}
                  value={formItem.title}
                  onChange={(e) => {
                    handleChangeFormData("title", e.target.value, index);
                  }}
                />
                <div className="flex gap-2 items-center">
                  <Switch
                    id={`freePreview-${index}`}
                    checked={formItem.freePreview}
                    onCheckedChange={(value) => {
                      handleChangeFormData("freePreview", value, index);
                    }}
                  />
                  <Label
                    className="font-semibold"
                    htmlFor={`freePreview-${index}`}
                  >
                    Free preview
                  </Label>
                </div>
              </div>
              <Input
                accept="video/*"
                type={"file"}
                onChange={(e) => {
                  handleLectureFileChange(e?.target?.files?.[0], index);
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
