"use client";

import { Select } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";

import BottomArrowIcon from "../../assets/icons/BottomArrowIcon";
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
        icon={<BottomArrowIcon />}
        w="95px"
        h="40px"
        borderRadius="6px"
        backgroundColor="white"
        focusBorderColor="#00c2b3"
        size="sm"
        fontSize="16px"
        fontWeight={500}
        value={value}
        onChange={onChange}
        border={!isBorder ? "none" : undefined}
      >
        {options.map((option, idx) => (
          <option key={idx}>{option}</option>
        ))}
      </Select>
    </div>
  );
}
