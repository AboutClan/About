import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

interface DatePointButtonProps {
  date: number;
  func: () => void;
  isSelected?: boolean;
  pointType?: "mint";
}

function DatePointButton({ date, func, isSelected }: DatePointButtonProps) {
  const PointDot = () => (
    <Flex w="16px" h="16px" justify="center" align="center">
      <Box w="4px" h="4px" borderRadius="50%" bgColor="var(--color-mint)" />
    </Flex>
  );

  const TodayCircle = ({ date }: { date: number }) => (
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
  console.log(isSelected);
  return (
    <Button onClick={func}>
      <Box w="30px" h="30px" mb="2px" position="relative" zIndex={2}>
        {!isSelected ? date : <TodayCircle date={date} />}
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
  height: 48px;
  font-weight: 500;
  font-size: 15px;
  color: var(--gray-700);
`;

export default DatePointButton;
