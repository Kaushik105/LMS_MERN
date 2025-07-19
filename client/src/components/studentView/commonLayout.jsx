
import React from 'react'
import {  Outlet, useLocation } from 'react-router-dom'
import Header from './header';

function CommonStudentLayout() {
  const location = useLocation()


  return (
    <div className="w-full min-h-screen flex flex-col">
      {location.pathname.includes("/course-progress") ? null : <Header />}

      <Outlet />
    </div>
  );
}

export default CommonStudentLayout;
