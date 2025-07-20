import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/videoPlayer";
import { useAuth } from "@/context/authContext";
import { useStudent } from "@/context/studentContext";
import {
  fetchStudentViewCourseDetailsByIdService,
  getCurrentCourseProgressService,
  getIfCourseIsPurchasedService,
  markCurrentLectureService,
} from "@/services";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useAnimationFrame } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StudentCourseProgressPage() {
  const [lockCourse, setlockCourse] = useState(false);
  const [currentCourseDetails, setCurrentCourseDetails] = useState(null);
  const [currentCourseCurriculum, setCurrentCourseCurriculum] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { id } = useParams();
  const [openSideBar, setOpenSideBar] = useState(false);
  const [currentLecture, setCurrentLecture] = useState("");
  const [progressData, setprogressData] = useState({});
  const [showCourseCompeletedDialog, setShowCourseCompeletedDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  //checking if the current course is purchased by the student and controlling the access
  async function getCurrentCoursePurchaseStatus() {
    const response = await getIfCourseIsPurchasedService(auth?.user?._id, id);
    if (!response?.data?.isPurchased) {
      setlockCourse((prev) => true);
    }
  }

  async function getCurrentCourseProgress() {
    if (!lockCourse) {
      const response = await getCurrentCourseProgressService(
        auth?.user?._id,
        id
      );
      setCurrentCourseDetails(response?.data?.courseDetails);
      setCurrentCourseCurriculum(
        (prev) => response?.data?.courseDetails?.curriculum
      );
      // if all the lectures are viewed
      console.log(response?.data?.progress?.completed, "completed");

      if (response?.data?.progress?.completed) {
        setShowCourseCompeletedDialog(true);
      }
      if (response?.data?.progress?.lecturesProgress.length === 0) {
        setCurrentLecture(
          response?.data?.courseDetails?.curriculum[0]?.videoUrl
        );
        setprogressData(response?.data?.courseDetails?.curriculum[0]);
      } else {
        const getLastIndexOfViewedLecture =
          response?.data?.progress?.lecturesProgress?.reduceRight(
            (acc, obj, index) => {
              return (acc === -1) & obj.viewed ? index : acc;
            },
            -1
          );

        setCurrentLecture(
          response?.data?.courseDetails?.curriculum[getLastIndexOfViewedLecture]
            ?.videoUrl
        );
        setprogressData(
          response?.data?.courseDetails?.curriculum[getLastIndexOfViewedLecture]
        );
      }
    }
  }

  async function markCurrentLecture() {
    const response = await markCurrentLectureService({
      userId: auth?.user?._id,
      courseId: currentCourseDetails?._id,
      completedLecture: { ...progressData },
    });

    if (response.data.completed) {
      showCourseCompeletedDialog(true);
    }
  }

  useEffect(() => {
    if (progressData?.progress == 1) {
      let currentCourseIndex = currentCourseCurriculum.findIndex(
        (courseItem) => courseItem._id == progressData._id
      );

      if (currentCourseIndex + 1 < currentCourseCurriculum.length) {
        setprogressData(currentCourseCurriculum[currentCourseIndex + 1]);
        setCurrentLecture(
          currentCourseCurriculum[currentCourseIndex + 1].videoUrl
        );
      } else {
        setprogressData(currentCourseCurriculum[0]);
        setCurrentLecture(currentCourseCurriculum[0].videoUrl);
      }
      markCurrentLecture();
    }
  }, [progressData]);

  useEffect(() => {
    getCurrentCoursePurchaseStatus();
    getCurrentCourseProgress();
    return () => {
      setCurrentCourseDetails(null);
    };
  }, []);

  return (
    <div className="w-full bg-[#1c1d1f] h-screen overflow-hidden">
      {/* ----------Navbar--------- */}
      <div className="bg-black flex items-center justify-between w-full p-4">
        <Button
          onClick={() => {
            navigate("/student/my-courses");
          }}
          className={"bg-zinc-800 cursor-pointer text-lg p-6"}
        >
          <ChevronLeftIcon style={{ width: 30, height: 30 }} /> Go back to My
          Courses
        </Button>
        <Button
          onClick={() => {
            setOpenSideBar(!openSideBar);
          }}
          className={"p-6 bg-zinc-800 cursor-pointer"}
        >
          {openSideBar ? (
            <ChevronLeftIcon style={{ width: 25, height: 25 }} />
          ) : (
            <ChevronRightIcon style={{ width: 25, height: 25 }} />
          )}
        </Button>
      </div>
      {/* Video player and side bar */}
      <div
        className={`flex ${
          openSideBar ? " gap-3 " : " gap-0 "
        }h-full w-full transition-all delay-100 ease-in-out duration-300`}
      >
        <div className="text-white rounded-md w-full h-full flex-1 max-h-[600px] border-white border-2">
          <VideoPlayer
            url={currentLecture}
            onProgressUpdate={setprogressData}
            progressData={progressData}
          />
        </div>
        <div
          className={`${
            openSideBar ? " w-md " : " w-0 translate-x-full"
          }  text-white transition-all delay-150 ease-in-out max-h-[600px] duration-300`}
        >
          <Tabs defaultValue="content" className={""}>
            <TabsList className={"w-full rounded-sm"}>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <div className="w-full flex flex-col gap-6">
                {currentCourseCurriculum?.map((lecture) => (
                  <div key={lecture._id}>{lecture.title}</div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="overview">
              <div className="w-full flex flex-col gap-4">
                <div className="text-xl font-semibold">
                  {currentCourseDetails?.title}
                </div>
                <div className="text-lg text-gray-200">
                  {currentCourseDetails?.description}
                </div>
                <div className="text-lg text-gray-200">
                  {" "}
                  by{" "}
                  <span className="text-blue-500">
                    {currentCourseDetails?.instructorName}
                  </span>
                </div>
                <div className="text-lg flex gap-2 text-gray-200">
                  {" "}
                  <span className="text-orange-500">
                    {currentCourseDetails?.category}
                  </span>
                  ●
                  <span className="text-orange-500">
                    {currentCourseDetails?.level.charAt(0).toUpperCase() +
                      currentCourseDetails?.level.slice(1)}
                  </span>
                  ●
                  <span className="text-orange-500">
                    {currentCourseDetails?.primaryLanguage
                      .charAt(0)
                      .toUpperCase() +
                      currentCourseDetails?.primaryLanguage.slice(1)}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* show non-closable dialog if the course is not purchased */}
      <Dialog open={lockCourse}>
        <DialogContent>
          <DialogHeader className={"font-semibold text-2xl"}>
            Acess Denied !
          </DialogHeader>
          <p>
            You don't have access to this course, buy this course to get
            complete access
          </p>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompeletedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {" "}
              Congratulations 🎉🎊🎉
            </DialogTitle>
            <DialogDescription>
              You have completed the course !!!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center gap-6 ">
            <Button
              onClick={() => {
                navigate("/student/my-courses");
              }}
              className={"cursor-pointer"}
            >
              Go to My Courses
            </Button>
            <Button className={"cursor-pointer"}>Rewatch Course</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentCourseProgressPage;
