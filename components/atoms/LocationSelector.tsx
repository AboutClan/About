import { Select } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { LOCATION_CONVERT } from "../../constants/location";
import { DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { isLocationType } from "../../utils/validationUtils";

interface ILocationSelector {
  defaultValue: string;
  options: string[];
  setValue: DispatchType<string> | DispatchType<ActiveLocation>;
  isBorder?: boolean;
}

export default function LocationSelector({
  defaultValue,
  options,
  setValue: setParentValue,
  isBorder = true,
}: ILocationSelector) {
  const [value, setValue] = useState(defaultValue);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    adjustWidth();
  }, [value]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const targetValue = e.currentTarget.value;
    if (isLocationType(targetValue)) setParentValue(targetValue as ActiveLocation);
    else (setParentValue as DispatchType<string>)(targetValue);
  };

  const adjustWidth = () => {
    if (selectRef.current) {
      const textLength = selectRef.current.selectedOptions[0].text.length;
      selectRef.current.style.width = `${textLength * 10 + 50}px`;
    }
  };

  return (
    <div>
      <Select
        ref={selectRef}
        focusBorderColor="#00c2b3"
        size="sm"
        color="primary"
        value={value}
        onChange={onChange}
        border={!isBorder ? "none" : undefined}
        style={{ width: "auto" }}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {LOCATION_CONVERT[option]}
          </option>
        ))}
      </Select>
    </div>
  );
}
