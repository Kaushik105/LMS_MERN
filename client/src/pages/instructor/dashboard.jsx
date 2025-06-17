import InstructorCourses from "@/components/instructorView/instructorCourses";
import InstructorDashboard from "@/components/instructorView/instructorDashboard";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";
import { useInstructor } from "@/context/instructorContext";
import { fetchInstructorCourseListService } from "@/services";
import { TabsContent } from "@radix-ui/react-tabs";
import { BookOpenText, ChartColumnDecreasing, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";


function InstructorDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useAuth();
  const { instructorCoursesList, setInstructorCoursesList } = useInstructor();
  const instructorMenuItems = [
    {
      icon: ChartColumnDecreasing,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard />,
    },
    {
      icon: BookOpenText,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  async function updateInstructorCoursesList(params) {
    const response = await fetchInstructorCourseListService();

    if (response?.success) {
      setInstructorCoursesList(response?.data);
    }

  }

  useEffect(() => {
    updateInstructorCoursesList();
  }, []);

  function handleTabChange(tab) {
    setActiveTab(tab);
  }

  function handleLogOut() {
    resetCredentials();
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <aside className="w-70 h-screen bg-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold w-full">Instructor Dashboard</h1>
        </div>
        <nav className="flex flex-col gap-3.5 p-4">
          {instructorMenuItems.map((menuItem) => (
            <Button
              variant={"outline"}
              className={"p-5 cursor-pointer justify-start "}
              key={menuItem.value}
              onClick={
                menuItem.component !== null
                  ? () => {
                      handleTabChange(menuItem.value);
                    }
                  : handleLogOut
              }
            >
              <menuItem.icon className="mr-4 size-6" />
              <span className="text-lg">{menuItem.label}</span>
            </Button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-3xl m-3 font-bold">Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {instructorMenuItems.map((menuItem) => (
            <TabsContent
              key={menuItem.value}
              className="m-3"
              value={menuItem.value}
            >
              {menuItem.component !== null ? menuItem.component : null}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
