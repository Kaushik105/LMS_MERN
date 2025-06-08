import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { createContext, useContext, useState } from "react"



const instructorContext = createContext(null)


export function InstructorProvider({children}){
    const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData)
    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData)

    return (
      <instructorContext.Provider
        value={{
          courseLandingFormData,
          setCourseLandingFormData,
          courseCurriculumFormData,
          setCourseCurriculumFormData,
        }}
      >
        {children}
      </instructorContext.Provider>
    );

}

export function useInstructor(){
    return useContext(instructorContext)
}