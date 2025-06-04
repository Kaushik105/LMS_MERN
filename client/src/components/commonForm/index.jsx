import React from "react";
import FormControls from "./FormControls";
import { Button } from "../ui/button";

function CommonForm({
  formControls = [],
  formData,
  setFormData,
  btnText = "Submit",
  isBtnDisabled,
  handleSubmit
}) {
  function handleFormSubmit(e) {
    e.preventDefault();
    handleSubmit()
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
