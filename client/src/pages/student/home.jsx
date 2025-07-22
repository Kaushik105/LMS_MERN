import HeroSectionSvg from "@/components/studentView/heroSectionSvg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCategories } from "@/config";
import { useAuth } from "@/context/authContext";
import { useStudent } from "@/context/studentContext";
import {
  fetchStudentViewCourseListService,
  getIfCourseIsPurchasedService,
} from "@/services";
import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCourseList, setStudentViewCourseList } = useStudent();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const categorySectionRef = useRef(null);

  async function handleNavigateToCourseDetails(courseId) {
    const response = await getIfCourseIsPurchasedService(
      auth?.user?._id,
      courseId
    );
    response?.data?.isPurchased
      ? navigate(`/student/course-progress/${courseId}`)
      : navigate(`/student/course-details/${courseId}`);
  }

  function handleNavigateToListing(category) {
    sessionStorage.removeItem("filters");
    const filters = {
      category: [category],
    };
    sessionStorage.setItem("filters", JSON.stringify(filters));
    navigate("/student/courses")
  }

  async function getStudentViewCourseList() {
    const response = await fetchStudentViewCourseListService("");

    if (response?.success) {
      setStudentViewCourseList(response?.data);
    }
  }

  useEffect(() => {
    getStudentViewCourseList();
  }, []);

  return (
    <div>
      <section className="bg-white h-screen">
        <div className="mx-auto w-full h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-10 lg:py-32">
          <div className="max-w-prose text-left">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Learn What Matters
              <strong className="text-indigo-600"> Upskill </strong>
              Yourself
            </h1>

            <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
              Level up your career by learning the essential skills from the
              bests in the field on the Worlds No. 1 online learning platform.
            </p>

            <div className="mt-4 flex gap-4 sm:mt-6">
              <button
                onClick={() => {
                  categorySectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors cursor-pointer hover:bg-indigo-700"
              >
                Get Started
              </button>

              <NavLink
                className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
                to="/student/courses"
              >
                Browse Courses
              </NavLink>
            </div>
          </div>
          <HeroSectionSvg />
        </div>
      </section>
      <section className="w-full shadow-lg mb-5 pt-8 pb-16 bg-gray-100 ">
        <div>
          <h1 className="text-3xl font-semibold text-center p-4 ">
            Categories
          </h1>
        </div>
        <div
          ref={categorySectionRef}
          className="grid p-4 sm:grid-cols-1 md:grid-cols-3 lg:gap-5 gap-4 lg:grid-cols-5"
        >
          {courseCategories.map((item) => (
            <Card
              onClick={() => {
                handleNavigateToListing(item.id);
              }}
              className={" cursor-pointer"}
              key={item.id}
            >
              <CardHeader className={"gap-0 text-center"}>
                <CardTitle className={"text-xl"}>{item.label}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <section className="w-full">
        <div>
          <h1 className="text-3xl font-semibold text-center p-4 ">Courses</h1>
        </div>
        <div className="grid p-4 sm:grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-5">
          {studentViewCourseList && studentViewCourseList?.length > 0
            ? studentViewCourseList.map((courseItem) => (
                <Card
                  key={courseItem._id}
                  className={"py-1 gap-1 md:py-2 lg:py-2.5"}
                  onClick={() => {
                    handleNavigateToCourseDetails(courseItem._id);
                  }}
                >
                  <CardHeader className={"gap-0 px-1 md:px-2 lg:px-2.5"}>
                    <img
                      className="h-[170px] w-full object-cover"
                      src={courseItem?.image}
                    />
                  </CardHeader>
                  <CardContent
                    className={"gap-0 flex flex-col px-1 md:px-2 lg:px-2.5"}
                  >
                    <span className=" tracking-tighter font-semibold text-lg">
                      {courseItem?.title}
                    </span>
                    <div className="flex gap-1">
                      <span className="text-indigo-700">
                        {courseItem?.instructorName}
                      </span>
                      ·
                      <span className="text-gray-600">
                        {courseItem?.category}
                      </span>
                    </div>
                    <span className="text-gray-700 text-lg">
                      {courseItem?.curriculum?.length} Lectures
                    </span>
                  </CardContent>
                </Card>
              ))
            : "no courses found"}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
