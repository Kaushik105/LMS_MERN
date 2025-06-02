import React from "react";
import { Label } from "../ui/label";
import FormControls from "./FormControls";
import { Button } from "../ui/button";

function CommonForm({
  formControls = [],
  formData,
  setFormData,
  btnText = "Submit",
  isBtnDisabled,
}) {
  function handleFormSubmit(e) {
    e.preventDefault();
  }

  return (
    <form className="w-full">
      <FormControls
        formControls={formControls}
        setFormData={setFormData}
        formData={formData}
      />
      <Button
        disabled={isBtnDisabled}
        className={"w-full mt-5"}
        onClick={handleFormSubmit}
      >
        {btnText}
      </Button>
    </form>
  );
}

export default CommonForm;
