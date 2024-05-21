import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { getToday } from "../../utils/dateTimeUtils";
import PointCircle from "../atoms/PointCircle";

export interface DatePointButtonProps {
  date: number;
  value: number;
  func: () => void;
  isSelected?: boolean;
  pointType?: "mint";
}

function DatePointButton({ date, value, func, isSelected }: DatePointButtonProps) {
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

  return (
    <Button onClick={func}>
      <Flex
        justify="center"
        color={today.date() === date && "var(--color-mint)"}
        align="center"
        w="30px"
        h="30px"
        position="relative"
        zIndex={2}
      >
        {!date ? null : !isSelected ? date : <TodayCircle date={date} />}
      </Flex>
      <Flex justify="center" w="16px" h="16px" whiteSpace="nowrap" textAlign="center">
        {date === today.date() ? (
          <Box fontSize="10px" mt="4px" color="var(--color-mint)"></Box>
        ) : (
          value >= 1 && <PointCircle color={value >= 3 ? "mint" : "gray"} />
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
