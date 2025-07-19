import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useAuth } from "@/context/authContext";
import { getIfCourseIsPurchasedService } from "@/services";
import { ChevronLeftIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StudentCourseProgressPage() {
  const [lockCourse, setlockCourse] = useState(false);
  const navigate = useNavigate();
  const {auth} = useAuth()
  const {id} = useParams()
  

  async function getCurrentCoursePurchaseStatus() {
    const response = await getIfCourseIsPurchasedService(auth?.user?._id, id);
    if (!response?.data?.isPurchased) {
      setlockCourse(prev => true)
    }
    
  }

  useEffect(() => {
    getCurrentCoursePurchaseStatus()
  }, [])
  

  return (
    <div className="w-full bg-[#1c1d1f] flex flex-col min-h-screen">
      <div className="bg-black w-full p-4">
        <Button
          onClick={() => {
            navigate("/student/my-courses");
          }}
          className={
            "bg-white text-black hover:bg-accent-foreground hover:text-accent cursor-pointer text-lg p-6"
          }
        >
          <ChevronLeftIcon style={{ width: 30, height: 30 }} /> Go back to My
          Courses
        </Button>
      </div>
      //show non-closable dialog if the course is not purchased
      <Dialog open={lockCourse}>
        <DialogContent>
          <DialogHeader className={"font-semibold text-2xl"}>Acess Denied !</DialogHeader>
          <p>
            You don't have access to this course, buy this course to get
            complete access
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentCourseProgressPage;
