import { Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { PLACE_TO_NAME } from "../../constants/serviceConstants/studyConstants/studyCafeNameConstants";

import { DispatchType } from "../../types/hooks/reactTypes";

interface IPlaceSelector {
  defaultValue: string;
  options: string[];
  setValue: DispatchType<string>;
  isBorder?: boolean;
}

export default function PlaceSelector({
  defaultValue,
  options,
  setValue: setParentValue,
  isBorder = true,
}: IPlaceSelector) {
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const targetValue = e.currentTarget.value;
    setParentValue(targetValue === "선택 없음" ? null : targetValue);
  };

  return (
    <div className="max-w-md">
      <Select
        focusBorderColor="#00c2b3"
        size="sm"
        color="primary"
        value={defaultValue}
        onChange={onChange}
        border={!isBorder ? "none" : undefined}
      >
        {options.map((option, idx) => (
          <option value={option} key={idx}>
            {PLACE_TO_NAME[option] || "선택 없음"}
          </option>
        ))}
      </Select>
    </div>
  );
}
