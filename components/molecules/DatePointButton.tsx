import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

export interface DatePointButtonProps {
  date: number;
  func: () => void;
  isSelected?: boolean;
  pointType?: "mint";
}

function DatePointButton({ date, func, isSelected }: DatePointButtonProps) {
  function PointDot() {
    return (
      <Flex w="16px" h="16px" justify="center" align="center">
        <Box w="4px" h="4px" borderRadius="50%" bgColor="var(--color-mint)" />
      </Flex>
    );
  }

  function TodayCircle({ date }: { date: number }) {
    return (
      <Flex
        justify="center"
        align="center"
        w="100%"
        h="100%"
        position="absolute"
        borderRadius="50%"
        top={0}
        left={0}
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
      <Box w="30px" h="30px" position="relative" zIndex={2}>
        {!date ? null : !isSelected ? date : <TodayCircle date={date} />}
      </Box>
      <PointDot />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
  font-weight: 500;
  font-size: 15px;
  color: var(--gray-700);
`;

export default DatePointButton;
