import React from 'react'
import { Outlet } from 'react-router-dom'

function CommonStudentLayout() {
  return (
    <div>
        Common Layout
      <Outlet/>
    </div>
  )
}

export default CommonStudentLayout;
