import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/videoPlayer";
import { useAuth } from "@/context/authContext";
import {
  getCurrentCourseProgressService,
  getIfCourseIsPurchasedService,
  resetCourseProgressService,
  updateCurrentLectureProgressService,
} from "@/services";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";

function StudentCourseProgressPage() {
  const [lockCourse, setlockCourse] = useState(false);
  const [currentCourseDetails, setCurrentCourseDetails] = useState(null);
  const [currentCourseCurriculum, setCurrentCourseCurriculum] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { id } = useParams();
  const [openSideBar, setOpenSideBar] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [progressData, setprogressData] = useState(null);
  const [currentCourseProgress, setCurrentCourseProgress] = useState(null);
  const [showCourseCompeletedDialog, setShowCourseCompeletedDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showedCourseCompletionDialog, setShowedCourseCompletionDialog] =
    useState(false);

  //checking if the current course is purchased by the student and controlling the access
  async function getCurrentCoursePurchaseStatus() {
    const response = await getIfCourseIsPurchasedService(auth?.user?._id, id);
    if (!response?.data?.isPurchased) {
      setlockCourse((prev) => true);
    }
  }

  //fetching the current course progress
  async function getCurrentCourseProgress() {
    console.log("first api call getcurrentcourseprogress");

    if (!lockCourse) {
      const response = await getCurrentCourseProgressService(
        auth?.user?._id,
        id
      );
      setCurrentCourseDetails(response?.data?.courseDetails);
      setCurrentCourseCurriculum(
        (prev) => response?.data?.courseDetails?.curriculum
      );
      setCurrentCourseProgress(response?.data?.progress?.lecturesProgress);

      // showing greetings dialog if all the lectures are viewed
      if (response?.data?.progress?.completed & !showedCourseCompletionDialog) {
        setShowCourseCompeletedDialog(true);
        setShowConfetti(true);
      }

      if (response?.data?.progress?.lecturesProgress.length === 0) {
        setCurrentLecture(
          response?.data?.courseDetails?.curriculum[0]?.videoUrl
        );
        console.log("course progress set in getcurrent course prgress");

        setprogressData(response?.data?.courseDetails?.curriculum[0]);
      } else {
        //setting the video url to the last viewed lecture
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
        console.log("course progress set in getcurrent course prgress");
        setprogressData(
          response?.data?.courseDetails?.curriculum[getLastIndexOfViewedLecture]
        );
      }
    }
  }

  //update the course progress after each lecture
  async function updateCurrentLectureProgress() {
    const response = await updateCurrentLectureProgressService({
      userId: auth?.user?._id,
      courseId: currentCourseDetails?._id,
      completedLecture: { ...progressData },
    });

    setCurrentCourseProgress(response?.data?.lecturesProgress);

    if (response.data.completed && !showedCourseCompletionDialog) {
      setShowCourseCompeletedDialog(true);
      setShowConfetti(true);
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService({
      userId: auth?.user?._id,
      courseId: currentCourseDetails._id,
    });
    if (response.success) {
      setShowCourseCompeletedDialog(false);
      setShowConfetti(false);
      setCurrentLecture(null);
      getCurrentCourseProgress();
      setShowedCourseCompletionDialog(false);
    }
  }

  // console.log(currentCourseProgress, "current course progress");
  // console.log(currentLecture, "current lecture");
  // console.log(progressData, "progress data");
  console.log(showCourseCompeletedDialog);

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
      }
      updateCurrentLectureProgress();
    }
  }, [progressData]);

  useEffect(() => {
    getCurrentCoursePurchaseStatus();
    //fetching current course progress on initial render
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
        {/* -----------sidebar--------- */}
        <div
          className={`${
            openSideBar
              ? " w-md opacity-100 translate-x-0"
              : " w-0 translate-x-full opacity-0 overflow-hidden pointer-events-none"
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
                  <div className="flex gap-3  items-center" key={lecture._id}>
                    {currentCourseProgress.find(
                      (item) => item.lectureId === lecture._id
                    ) ? (
                      <CheckIcon
                        className="text-green-500"
                        style={{ width: 25, height: 25 }}
                      />
                    ) : (
                      <PlayIcon style={{ width: 25, height: 25 }} />
                    )}
                    {lecture.title}
                  </div>
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

      {/* Course completion dialog */}
      <Dialog
        open={showCourseCompeletedDialog}
        onOpenChange={() => {
          setShowedCourseCompletionDialog(true);
          setShowCourseCompeletedDialog();
          setShowConfetti(false);
        }}
      >
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
                setShowCourseCompeletedDialog(false);
                setShowConfetti(false);
              }}
              className={"cursor-pointer"}
            >
              Go to My Courses
            </Button>
            <Button onClick={handleRewatchCourse} className={"cursor-pointer"}>
              Rewatch Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {showConfetti && <Confetti />}
    </div>
  );
}

export default StudentCourseProgressPage;
