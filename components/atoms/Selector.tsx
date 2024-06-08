import { Select } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";

import { DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { isLocationType } from "../../utils/validationUtils";

interface ISelector {
  defaultValue: string;
  options: string[];
  setValue: DispatchType<string> | DispatchType<ActiveLocation>;
  isBorder?: boolean;
}

export default function Selector({
  defaultValue,
  options,
  setValue: setParentValue,
  isBorder = true,
}: ISelector) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const targetValue = e.currentTarget.value;
    if (isLocationType(targetValue)) setParentValue(targetValue as ActiveLocation);
    else (setParentValue as DispatchType<string>)(targetValue);
  };

  return (
    <div className="max-w-md">
      <Select
        focusBorderColor="#00c2b3"
        size="sm"
        color="primary"
        value={value}
        onChange={onChange}
        border={!isBorder ? "none" : undefined}
        bgColor={!isBorder ? "inherit" : "white"}
      >
        {options.map((option, idx) => (
          <option key={idx}>{option}</option>
        ))}
      </Select>
    </div>
  );
}
