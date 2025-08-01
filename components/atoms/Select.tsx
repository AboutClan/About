import { Box, Flex, Select as ChakraSelect } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { LOCATION_TO_FULLNAME } from "../../constants/location";
import { DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation, Location } from "../../types/services/locationTypes";
import { isLocationType } from "../../utils/validationUtils";
import { ShortArrowIcon } from "../Icons/ArrowIcons";

interface ISelect {
  defaultValue: string;
  options: string[];
  setValue: DispatchType<string> | DispatchType<Location>;
  isBorder?: boolean;
  type?: "location";
  size: "xs" | "sm" | "md" | "lg";
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
  size,
  isFullSize,
  isEllipse = true,
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
      const addSize =
        size === "xs" ? 44 : size === "sm" ? 48 : size === "md" ? 60 : size === "lg" ? 72 : 0;
      selectRef.current.style.width = `${textLength * 6.5 + addSize}px`;
    }
  };

  return (
    <ChakraSelect
      icon={
        <Flex
          justify="center"
          pr={size === "lg" && 4}
          ml="auto"
          align="center"
          fontSize={size === "lg" ? "15px" : size === "sm" ? "11px" : "12px"}
          pointerEvents="none"
        >
          <Box>
            <ShortArrowIcon dir="bottom" size="md" color="black" />
          </Box>
        </Flex>
      }
      ref={selectRef}
      focusBorderColor="#00c2b3"
      size={size}
      color="primary"
      value={value}
      onChange={onChange}
      borderRadius={
        !isEllipse
          ? undefined
          : size === "xs"
          ? "9999px"
          : size === "sm"
          ? "8px"
          : size === "md"
          ? "20px"
          : "12px"
      }
      border={!isBorder ? "none" : undefined}
      borderColor="var(--gray-200)"
      bgColor="white"
      fontSize={
        size === "lg"
          ? "14px"
          : size === "sm"
          ? "11px"
          : size === "xs" && !isBorder
          ? "12px"
          : size === "xs" || size === "md"
          ? "11px"
          : "13px"
      }
      outline={size === "md" ? "1px solid var(--gray-100)" : undefined}
      fontWeight={isThick ? 600 : 500}
      isDisabled={!isActive}
      height={
        size === "xs"
          ? isBorder
            ? "24px"
            : "16px"
          : size === "sm"
          ? "28px"
          : size === "md"
          ? "32px"
          : "52px"
      }
      width={!isFullSize ? "max-content" : "100%"}
      mr={size === "xs" && !isBorder && "-6px"}
      sx={{
        paddingInlineStart: !isEllipse
          ? "12px"
          : size === "xs"
          ? "8px"
          : size === "sm"
          ? "12px"
          : size === "md"
          ? "16px"
          : "20px",
        paddingInlineEnd: size === "sm" ? "4px" : !isEllipse ? "16px" : "20px",
        paddingBottom: 0,
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
