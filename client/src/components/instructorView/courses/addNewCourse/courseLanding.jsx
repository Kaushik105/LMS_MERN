import FormControls from "@/components/commonForm/FormControls";
import { courseLandingPageFormControls } from "@/config";
import React from "react";

function CourseLanding({ formData, setFormData }) {
    
  return (
    <div className="w-full">
      <FormControls
        formControls={courseLandingPageFormControls}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}

export default CourseLanding;
