import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useAuth } from "./context/authContext";
import CommonStudentLayout from "./components/studentView/commonLayout";
import InstructorDashboardPage from "./pages/instructor/dashboard";
import StudentHomePage from "./pages/student/home";
import RouteGuard from "./components/routeGuard";
import AddNewCourse from "./pages/instructor/addNewCourse";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetails from "./pages/student/courseDetails";

function App() {
  const { auth } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              element={<AuthPage />}
              user={auth.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              element={<InstructorDashboardPage />}
              user={auth.user}
            />
          }
        />
        <Route
          path="/instructor/add-new-course"
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              element={<AddNewCourse />}
              user={auth.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:id"
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              element={<AddNewCourse />}
              user={auth.user}
            />
          }
        />
        <Route
          path="/student"
          element={
            <RouteGuard
              authenticated={auth.authenticated}
              element={<CommonStudentLayout />}
              user={auth.user}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route
            path="course-details/:id"
            element={<StudentViewCourseDetails />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
