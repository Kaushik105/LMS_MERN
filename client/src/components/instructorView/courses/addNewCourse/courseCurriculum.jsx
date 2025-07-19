import MediaProgressBar from "@/components/mediaProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/videoPlayer";
import { courseCurriculumInitialFormData } from "@/config";
import { useInstructor } from "@/context/instructorContext";
import {
  bulkMediaUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Upload } from "lucide-react";
import React, { useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    setMediaUploadProgressPercentage,
    setMediaUploadProgress,
    mediaUploadProgress,
    mediaUploadProgressPercentage,
  } = useInstructor();

  const bulkInputRef = useRef(null);

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
        setMediaUploadProgress(true);
        setMediaUploadProgressPercentage(0);
        const videoFormdata = new FormData();
        videoFormdata.append("file", value);
        const result = await mediaUploadService(
          videoFormdata,
          setMediaUploadProgressPercentage
        );

        if (result?.success) {
          let cpyFormData = [...courseCurriculumFormData];
          cpyFormData[index] = {
            ...cpyFormData[index],
            public_id: result?.data?.public_id,
            videoUrl: result?.data?.secure_url,
          };
          setCourseCurriculumFormData(cpyFormData);
        }
        setMediaUploadProgress(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleDeleteLecture(index) {
    let cpyFormData = [...courseCurriculumFormData];

    const videoDeleted = await mediaDeleteService(cpyFormData[index].public_id);

    if (videoDeleted?.success) {
      cpyFormData = cpyFormData.filter(
        (item) => item.title !== cpyFormData[index].title
      );
    }

    setCourseCurriculumFormData(cpyFormData);
  }

  function addLectureFormValid() {
    return courseCurriculumFormData.every(
      (item) =>
        item &&
        typeof item == "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
    );
  }

  async function handleReplaceVideo(index) {
    let cpyFormData = [...courseCurriculumFormData];
    let getCurrentPublicId = cpyFormData[index].public_id;
    const response = await mediaDeleteService(getCurrentPublicId);
    if (response?.success) {
      cpyFormData[index] = {
        ...cpyFormData[index],
        public_id: "",
        videoUrl: "",
      };
      setCourseCurriculumFormData(cpyFormData);
    }
  }

  function areAllCourseCurriculumlFormDataIsEmpty(arr) {
    return arr.every((object) => {
      return Object.entries(object).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleBulkUpload(e) {
    let selectedFiles = e.target?.files;
    if (selectedFiles && selectedFiles.length > 10) {
      alert("maximum 10 files allowed at a time");
      return;
    }

    try {
      setMediaUploadProgress(true);
      setMediaUploadProgressPercentage(0);
      const videoFormData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        videoFormData.append("files", file);
      }
      const response = await bulkMediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );

      let cpyCourseCurriculumFormData = areAllCourseCurriculumlFormDataIsEmpty(
        courseCurriculumFormData
      )
        ? []
        : [...courseCurriculumFormData];
      cpyCourseCurriculumFormData = [
        ...cpyCourseCurriculumFormData,
        ...response?.data?.map((item, index) => ({
          title: `Lecture ${cpyCourseCurriculumFormData.length + index + 1}`,
          freePreview: false,
          videoUrl: item.url,
          public_id: item.public_id,
        })),
      ];

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);

      setMediaUploadProgress(false);
    } catch (error) {
      console.log(error);
    }
  }

  function handleBulkUploadClick() {
    bulkInputRef?.current.click();
  }

  return (
    <Card>
      <CardHeader className={"flex justify-between"}>
        <CardTitle className={"text-xl"}>Course Curriculum</CardTitle>
        <Button
          onClick={handleBulkUploadClick}
          variant={"outline"}
          className={"cursor-pointer"}
        >
          {" "}
          <Input
            name="files"
            type={"file"}
            accept="video/*"
            multiple
            max={5}
            ref={bulkInputRef}
            onChange={(e) => handleBulkUpload(e)}
            hidden
          />
          <Upload /> Bulk Upload
        </Button>
      </CardHeader>
      <CardContent>
        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}

        <div className="flex flex-col gap-2 w-full">
          <Button
            disabled={!addLectureFormValid() || mediaUploadProgress}
            className={"w-30 h-10 cursor-pointer"}
            onClick={handleAddNewLecture}
          >
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
              {courseCurriculumFormData[index]?.videoUrl ? (
                <div className="flex gap-3 items-center">
                  <VideoPlayer
                    url={courseCurriculumFormData[index]?.videoUrl}
                    width="450px"
                    height="220px"
                  />
                  <Button
                    onClick={() => {
                      handleReplaceVideo(index);
                    }}
                  >
                    Replace
                  </Button>
                  <Button onClick={() => handleDeleteLecture(index)}>
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
