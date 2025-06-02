import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

function FormControls({ formControls, formData, setFormData }) {
  function renderElementsByComponentType(controlItem) {
    let element = null;
    let value = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case "input":
        element = (
          <Input
            id={controlItem.name}
            type={controlItem.type}
            placeholder={controlItem.placeholder}
            name={controlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
          ></Input>
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [controlItem.name]: value })
            }
          >
            <SelectTrigger>
              <SelectValue value={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0
                ? controlItem.options.map((optionItem) => (
                    <SelectItem value={optionItem.name}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            id={controlItem.name}
            type={controlItem.type}
            placeholder={controlItem.placeholder}
            name={controlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
          ></Textarea>
        );
        break;

      default:
        element = (
          <Input
            id={controlItem.name}
            type={controlItem.type}
            placeholder={controlItem.placeholder}
            name={controlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
          ></Input>
        );
        break;
    }
    return element;
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {formControls && formControls.length > 0
        ? formControls.map((controlItem) => (
            <div key={controlItem.name} className="w-full flex flex-col gap-2">
              <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
              {renderElementsByComponentType(controlItem)}
            </div>
          ))
        : null}
    </div>
  );
}

export default FormControls;
