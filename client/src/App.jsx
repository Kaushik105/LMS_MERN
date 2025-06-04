import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useAuth } from "@authContext";
import CommonStudentLayout from "./components/studentView/commonLayout";
import InstructorDashboardPage from "./pages/instructor/dashboard";
import StudentHomePage from "./pages/student/home";
import RouteGuard from "./components/routeGuard";

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
        </Route>
      </Routes>
    </>
  );
}

export default App;
