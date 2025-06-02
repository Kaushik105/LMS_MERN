export function formValidator(formControlsData) {
  for (const key in formControlsData) {
    if (Object.prototype.hasOwnProperty.call(formControlsData, key)) {
      let element = formControlsData[key];
      if (element.trim() === "") {
        return true;
      }
    }
  }
  return false;
}

