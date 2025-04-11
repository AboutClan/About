import { Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";

import { DispatchType } from "../../types/hooks/reactTypes";
import { StudyParticipationProps } from "../../types/models/studyTypes/baseTypes";

interface IPlaceSelector {
  defaultValue: string;
  options: StudyParticipationProps[];
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
        {options.map((option, idx) =>
          idx === 0 ? (
            <option key={idx}>선택 없음</option>
          ) : (
            <option value={option.place._id} key={idx}>
              {option.place.branch}({option.place.brand})
            </option>
          ),
        )}
      </Select>
    </div>
  );
}
