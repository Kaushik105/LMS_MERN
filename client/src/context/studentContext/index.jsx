import { createContext, useContext, useState } from "react";

const studentContext = createContext(null);

export function StudentProvider({ children }) {
  const [studentViewCourseList, setStudentViewCourseList] = useState([]);

  return (
    <studentContext.Provider
      value={{ studentViewCourseList, setStudentViewCourseList }}
    >{children}</studentContext.Provider>
  );
}

export function useStudent() {
  return useContext(studentContext);
}
