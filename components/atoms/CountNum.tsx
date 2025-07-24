import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { useToast } from "../../hooks/custom/CustomToast";

interface ICountNum {
  value: number;
  setValue: (newValue: number) => void;
  unit?: "명" | "원";
  min?: number;
  isSmall?: boolean;
  maxValue?: number;
  stepValue?: number;
  size?: "lg" | "md";
}

function CountNum({
  value,
  setValue,
  unit,
  min = 1,
  isSmall,
  maxValue,
  stepValue = 1,
  size = "md",
}: ICountNum) {
  const toast = useToast();

  const onClickUpValue = () => {
    if (value >= maxValue) {
      toast("warning", "최대 개수입니다.");
      return;
    }
    setValue(value + stepValue);
  };

  return (
    <Flex align="center">
      <IconWrapper
        isMinus={true}
        isVisible={value > min}
        disabled={value <= min}
        isSmall={isSmall}
        onClick={() => setValue(value - stepValue)}
      >
        <MinusIcon />
      </IconWrapper>
      <Box as="span" fontSize={isSmall ? "14px" : size === "md" ? "20px" : "24px"} mx={1}>
        {value}
        {unit}
      </Box>
      <IconWrapper isMinus={false} isVisible={true} isSmall={isSmall} onClick={onClickUpValue}>
        <PlusIcon />
      </IconWrapper>
    </Flex>
  );
}

const IconWrapper = styled.button<{
  isMinus: boolean;
  isVisible: boolean;
  isSmall: boolean;
}>`
  color: ${(props) => (props.isVisible ? "var(--gray-800)" : "var(--gray-300)")};
  width: 20px;
  height: 20px;
  margin-right: ${(props) =>
    props.isMinus ? (props.isSmall ? "var(--gap-2)" : "var(--gap-4)") : 0};
  margin-left: ${(props) =>
    !props.isMinus ? (props.isSmall ? "var(--gap-2)" : "var(--gap-4)") : 0};
  cursor: pointer;
`;

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-800)"
    >
      <path d="M240-440q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h480q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H240Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-800)"
    >
      <path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z" />
    </svg>
  );
}

export default CountNum;
