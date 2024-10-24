import { Box, Flex, Select as ChakraSelect } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { LOCATION_TO_FULLNAME } from "../../constants/location";
import { DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { isLocationType } from "../../utils/validationUtils";
import { ShortArrowIcon } from "../Icons/ArrowIcons";

interface ISelect {
  defaultValue: string;
  options: string[];
  setValue: DispatchType<string> | DispatchType<ActiveLocation>;
  isBorder?: boolean;
  type?: "location";
  size: "sm" | "md" | "lg";
  isEllipse?: boolean;
  isFullSize?: boolean;
  isActive?: boolean;
  isThick?: boolean;
}

export default function Select({
  defaultValue,
  options,
  setValue: setParentValue,
  isBorder = true,
  type,
  size = "sm",
  isFullSize,

  isActive = true,
  isThick,
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

      const addSize = size === "sm" ? 44 : size === "md" ? 60 : 0;
      selectRef.current.style.width = `${textLength * 6.5 + addSize}px`;
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
          pointerEvents="none"
        >
          <Box>
            <ShortArrowIcon dir="bottom" />
          </Box>
        </Flex>
      }
      ref={selectRef}
      focusBorderColor="#00c2b3"
      size={size === "sm" ? "xs" : size === "md" ? "md" : "lg"}
      color="primary"
      value={value}
      onChange={onChange}
      borderRadius={size === "sm" ? "9999px" : size === "md" ? "20px" : "12px"}
      border={!isBorder ? "none" : undefined}
      borderColor="var(--gray-200)"
      bgColor="white"
      fontSize={
        size === "sm" && !isBorder ? "12px" : size === "sm" || size === "md" ? "11px" : "13px"
      }
      outline={size === "md" ? "1px solid var(--gray-100)" : undefined}
      fontWeight={size === "sm" ? 500 : isThick ? 600 : 500}
      isDisabled={!isActive}
      height={size === "sm" ? (isBorder ? "24px" : "16px") : size === "md" ? "32px" : "52px"}
      width={!isFullSize ? "max-content" : "100%"}
      mr={size === "sm" && !isBorder && "-6px"}
      sx={{
        paddingInlineStart: size === "sm" ? "8px" : size === "md" ? "16px" : "20px", // padding-left
        paddingInlineEnd: "20px", // padding-right (아이콘 오른쪽에 여유 공간)
      }}
      _focus={{
        outline: isBorder ? "var(--border)" : "none",
        border: isBorder ? "var(--border)" : "none",
        boxShadow: "none",
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
