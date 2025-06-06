import { Flex, Select } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { LOCATION_TO_FULLNAME } from "../../constants/location";
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
      selectRef.current.style.width = `${textLength * 6.5 + 44}px`;
    }
  };

  return (
    <div>
      <Select
        icon={
          <Flex justify="center" align="center" fontSize="12px">
            <i className="fa-solid fa-chevron-down fa-xs" style={{ color: "var(--color-mint)" }} />
          </Flex>
        }
        ref={selectRef}
        focusBorderColor="#00c2b3"
        size="xs"
        color="primary"
        value={value}
        onChange={onChange}
        borderRadius="9999px"
        border={!isBorder ? "none" : undefined}
        borderColor="var(--gray-200)"
        bgColor="white"
        fontSize="11px"
        fontWeight={500}
        height="24px"
        width="mon-content"
        sx={{
          paddingInlineStart: "8px", // padding-left
          paddingInlineEnd: "20px", // padding-right (아이콘 오른쪽에 여유 공간)
        }}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {LOCATION_TO_FULLNAME[option]}
          </option>
        ))}
      </Select>
    </div>
  );
}
