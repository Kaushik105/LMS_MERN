import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to={"/auth"} />;
  }
  if (authenticated) {
    if (location.pathname.includes("/auth")) {
      if (user.role === "user") {
        return <Navigate to={"/student"} />;
      } else {
        return <Navigate to={"/instructor"} />;
      }
    }
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
