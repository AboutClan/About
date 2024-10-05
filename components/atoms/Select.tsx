import { Flex, Select as ChakraSelect } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { LOCATION_TO_FULLNAME } from "../../constants/location";
import { DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { isLocationType } from "../../utils/validationUtils";

interface ISelect {
  defaultValue: string;
  options: string[];
  setValue: DispatchType<string> | DispatchType<ActiveLocation>;
  isBorder?: boolean;
  type?: "location";
  size: "sm" | "lg";
  isFullSize?: boolean;
}

export default function Select({
  defaultValue,
  options,
  setValue: setParentValue,
  isBorder = true,
  type,
  size = "sm",
  isFullSize,
}: ISelect) {
  const [value, setValue] = useState(defaultValue);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isFullSize) return;
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
    <ChakraSelect
      icon={
        <Flex
          justify="center"
          pr={size === "lg" && 4}
          align="center"
          fontSize={size === "sm" ? "12px" : "12px"}
        >
          <i
            className={`fa-solid fa-chevron-down fa-${size === "sm" ? "xs" : "lg"}`}
            style={{ color: "var(--color-mint)" }}
          />
        </Flex>
      }
      ref={selectRef}
      focusBorderColor="#00c2b3"
      size={size === "sm" ? "xs" : "lg"}
      color="primary"
      value={value}
      onChange={onChange}
      borderRadius={size === "sm" ? "9999px" : "12px"}
      border={!isBorder ? "none" : undefined}
      borderColor="var(--gray-200)"
      bgColor="white"
      fontSize={size === "sm" ? "11px" : "13px"}
      fontWeight={500}
      height={size === "sm" ? "24px" : "52px"}
      width={!isFullSize ? "max-content" : "100%"}
      sx={{
        paddingInlineStart: size === "sm" ? "8px" : "20px", // padding-left
        paddingInlineEnd: "20px", // padding-right (아이콘 오른쪽에 여유 공간)
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {type === "location" ? LOCATION_TO_FULLNAME[option] : option}
        </option>
      ))}
    </ChakraSelect>
  );
}
