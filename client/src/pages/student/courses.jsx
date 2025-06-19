import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import { useStudent } from "@/context/studentContext";
import { fetchStudentViewCourseListService } from "@/services";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function createSearchParamHelper(filters){
  
  const queryParams = []
  if (filters) {
    
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",")
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
    }
    return queryParams.join("&")
  }
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const { studentViewCourseList, setStudentViewCourseList } = useStudent();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => {
    return JSON.parse(sessionStorage.getItem('filters')) || {}
  });

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
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters))
  }

async function getFilteredCourses(){
  let queryString = createSearchParamHelper(filters)
  setSearchParams(new URLSearchParams(queryString))
  const response = await fetchStudentViewCourseListService(`?${queryString}&sortBy=${sort}`)
  setStudentViewCourseList(response.data)

}

useEffect(() => {
  getFilteredCourses()

}, [filters])

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
                      checked={
                        filters &&
                        filters[item]?.length > -1 &&
                        filters[item].indexOf(optionItem.id) > -1
                      }
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
        <div className="flex-1 p-1">
          {studentViewCourseList && studentViewCourseList.length > -1
            ? studentViewCourseList.map((item) => (
                <Card key={item._id} className={"p-0"}>
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
                        •
                        <p className="text-gray-600 text-lg">{item.category}</p>
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
            : (<h3>No courses found</h3>)}
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
