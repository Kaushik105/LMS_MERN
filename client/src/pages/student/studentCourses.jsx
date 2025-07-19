import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/authContext'
import { getPurchasedCoursesService } from '@/services'
import { WatchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StudentCoursesPage() {
  const [boughtCourses, setBoughtCourses] = useState([])
  const {auth} = useAuth()
  const navigate = useNavigate()

  async function getMyCourses() {
    const response = await getPurchasedCoursesService(auth?.user?._id)
    setBoughtCourses(prev => [...response.data])
    
  } 
console.log(boughtCourses);

  useEffect(() => { 
    getMyCourses()
   },[])
  return (
    <div className="w-full min-h-screen">
      <h1 className='font-bold w-full p-4 pb-0 text-3xl'>Your Courses</h1>
      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {boughtCourses && boughtCourses.length >= 0
          ? boughtCourses.map((course) => (
              <div>
                {" "}
                <Card  key={course.courseId}>
                  <CardContent>
                    <div className='w-full'>

                    <img src={course.courseImage} className='w-full h-full object-cover' alt={course.title}></img>
                    </div>
                    <h1 className="font-bold text-lg">{course.title}</h1>
                    <p>{course.instructorName}</p>
                    <Button onClick={() => { 
                      navigate(`/student/course-progress/${course.courseId}`)
                     }} className={"cursor-pointer w-full mt-3"}><WatchIcon/> Start</Button>
                  </CardContent>
                </Card>
              </div>
            ))
          : "No Courses Found"}
      </div>
    </div>
  );
}

export default StudentCoursesPage
