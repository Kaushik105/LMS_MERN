import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { CourseSkeleton, SVGSkeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { useAuth } from "@/context/authContext";
import { useStudent } from "@/context/studentContext";
import {
  fetchStudentViewCourseListService,
  getIfCourseIsPurchasedService,
} from "@/services";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

//loading Skeleton
const LoadingSkeleton = () => (
  <>
    <div className="p-2 flex gap-4">
      <div className="w-80 h-52">
        <SVGSkeleton className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-col gap-1">
        <h1>
          <CourseSkeleton className="w-[232px] max-w-full" />
        </h1>
        <span className="flex items-center gap-2">
          <CourseSkeleton className="w-[264px] max-w-full" />
          <div>
            <CourseSkeleton className="w-[136px] max-w-full" />
          </div>
          <div>
            <CourseSkeleton className="w-[120px] max-w-full" />
          </div>
        </span>
        <div className="mt-1.5">
          <CourseSkeleton className="w-[80px] max-w-full" />
        </div>
        <div>
          <CourseSkeleton className="w-[64px] max-w-full" />
        </div>
        <div className="mt-2.5">
          <CourseSkeleton className="w-[40px] max-w-full" />
        </div>
      </div>
    </div>
  </>
);

function createSearchParamHelper(filters) {
  const queryParams = [];
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      } else if (typeof value === "string") {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }
    }
    return queryParams.join("&");
  }
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const { studentViewCourseList, setStudentViewCourseList } = useStudent();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    if (searchParams.size > 0) {
      let filters = {};
      for (const [key, value] of searchParams.entries()) {
        let index = Object.entries(filterOptions).findIndex(
          (item) => item[0] == key
        );
        if (index < 0) {
          return JSON.parse(sessionStorage.getItem("filters")) || {};
        }
      }
      for (const [key, value] of searchParams.entries()) {
        filters[key] = [...value.split(",")];
        sessionStorage.setItem("filters", JSON.stringify(filters));
      }
    }
    return JSON.parse(sessionStorage.getItem("filters")) || {};
  });

  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  function handleCheckedChange(sectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    let getCurrentSectionIndex = Object.keys(cpyFilters).indexOf(sectionId);

    if (getCurrentSectionIndex > -1) {
      if (cpyFilters[sectionId].indexOf(getCurrentOption) > -1) {
        cpyFilters[sectionId] = cpyFilters[sectionId].filter(
          (item) => item !== getCurrentOption
        );
      } else {
        cpyFilters = {
          ...cpyFilters,
          [sectionId]: [...cpyFilters[sectionId], getCurrentOption],
        };
      }
    } else {
      cpyFilters = {
        ...cpyFilters,
        [sectionId]: [getCurrentOption],
      };
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function getFilteredCourses() {
    let queryString = createSearchParamHelper(filters);
    setSearchParams(new URLSearchParams(queryString));
    const response = await fetchStudentViewCourseListService(
      `?${queryString}&sortBy=${sort}`
    );
    setStudentViewCourseList(response.data);
    setLoading(false);
  }

  async function handleNavigateToCourseDetails(courseId) {
    const response = await getIfCourseIsPurchasedService(
      auth?.user?._id,
      courseId
    );
    response?.data?.isPurchased
      ? navigate(`/student/course-progress/${courseId}`)
      : navigate(`/student/course-details/${courseId}`);
  }

  useEffect(() => {
    setLoading(true);
    const debounce = setTimeout(() => {
      getFilteredCourses();
    }, 300); // Debounce 300ms

    return () => clearTimeout(debounce);
  }, [filters, sort]);

  return (
    <div className="mx-auto w-full p-4">
      <div className="p-4 pt-0 border-b flex items-center justify-between">
        <h1 className="text-4xl font-bold"> All Courses</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className={"p-5"}>
              <ArrowUpDown />
              Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5} align="end">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) => {
                setSort(value);
              }}
            >
              {sortOptions.map((sortItem) => (
                <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                  {sortItem.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col md:flex-row ">
        <aside className="w-64 h-screen border-r">
          <div className="grid gap-6 p-2">
            {Object.keys(filterOptions).map((item) => (
              <div className="flex flex-col gap-2" key={item}>
                <h3 className="text-[16px] font-medium">
                  {item.toUpperCase()}
                </h3>
                {filterOptions[item].map((optionItem) => (
                  <span key={optionItem.id} className="flex gap-2 items-center">
                    <Checkbox
                      id={optionItem.id}
                      checked={filters[item]?.includes(optionItem?.id) || false}
                      onCheckedChange={(value) => {
                        handleCheckedChange(item, optionItem.id);
                      }}
                    />
                    <Label className={"text-[15px]"} htmlFor={optionItem.id}>
                      {optionItem.label}
                    </Label>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </aside>
        <div className="flex-1 flex flex-col gap-3 p-1">
          {!loading &&
          studentViewCourseList &&
          studentViewCourseList.length > 0 ? (
            studentViewCourseList.map((item) => (
              <Card
                onClick={() => {
                  handleNavigateToCourseDetails(item._id);
                }}
                key={item._id}
                className={"p-0"}
              >
                <CardContent className={"p-2 flex gap-4"}>
                  <div className="w-80 h-52">
                    <img
                      className="w-full h-full object-cover"
                      src={item.image}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold">{item.title}</h1>
                    <span className="flex text-gray-600 items-center gap-2">
                      <p className="text-gray-600 text-lg">
                        {item.instructorName}
                      </p>
                      •<p className="text-gray-600 text-lg">{item.category}</p>
                    </span>
                    <p className="text-gray-600 mt-1.5 text-[16px]">
                      {item.curriculum?.length} Lectures
                    </p>
                    <p className="text-gray-600 text-[15px]">
                      {item.level.toUpperCase()}
                    </p>
                    <p className="font-bold mt-2.5 text-[18px]">
                      $ {item.pricing}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : loading ? (
            <div className="flex w-full h-full">
              <LoadingSkeleton />
            </div>
          ) : (
            <h3 className="text-xl text-center font-semibold">
              No courses found
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
