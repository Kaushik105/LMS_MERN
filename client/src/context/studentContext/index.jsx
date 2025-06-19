import { createContext, useContext, useState } from "react";

const studentContext = createContext(null);

export function StudentProvider({ children }) {
  const [studentViewCourseList, setStudentViewCourseList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null)
  const [studentViewCourseDetailsId, setStudentViewCourseDetailsId] = useState(null)

  return (
    <studentContext.Provider
      value={{
        studentViewCourseList,
        setStudentViewCourseList,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        studentViewCourseDetailsId,
        setStudentViewCourseDetailsId,
      }}
    >
      {children}
    </studentContext.Provider>
  );
}

export function useStudent() {
  return useContext(studentContext);
}
