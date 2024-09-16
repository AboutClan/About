import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { dayjsToStr, getToday } from "../../utils/dateTimeUtils";

export interface DatePointButtonProps {
  date: string;
  value: number;
  func: () => void;
  size?: "sm" | "md";
  isSelected?: boolean;
  pointType?: "mint";
  weekend?: "sat" | "sun";
}

function DatePointButton({ date, value, func, size = "md", isSelected }: DatePointButtonProps) {
  const today = getToday();

  function TodayCircle({ date }: { date: number }) {
    return (
      <Flex
        justify="center"
        align="center"
        w="100%"
        h="100%"
        position="absolute"
        borderRadius="50%"
        top="50%"
        left="50%"
        transform="translate(-50%,-50%)"
        bgColor="var(--color-mint)"
        zIndex={1}
        color="white"
      >
        {date}
      </Flex>
    );
  }

  const dateNum = dayjs(date).date();

  return (
    <Button onClick={func}>
      <Flex
        justify="center"
        color={isSelected ? "white" : dayjsToStr(today) === date && "var(--color-mint)"}
        align="center"
        w={size === "md" ? "30px" : "26px"}
        h={size === "md" ? "30px" : "26px"}
        position="relative"
        zIndex={2}
      >
        {!date ? null : !isSelected ? dateNum : <TodayCircle date={dateNum} />}
      </Flex>
      <Flex justify="center">
        {date === dayjsToStr(today) && (
          <Box fontSize="10px" mt="4px" color="var(--color-mint)"></Box>
        )}
      </Flex>
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 42px;
  padding: 0 6px;
  font-weight: 500;
  font-size: 16px;
`;

export default DatePointButton;
