import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToStr, getToday } from "../../utils/dateTimeUtils";

export interface DatePointButtonProps {
  date: string;

  func: () => void;
  size?: "sm" | "md";
  isSelected?: boolean;
  pointType?: "mint";
  weekend?: "sat" | "sun";
  isDisabled: boolean;
}

function DatePointButton({
  date,
  func,
  size = "md",
  isSelected,
  isDisabled,
}: DatePointButtonProps) {
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
        fontWeight={500}
      >
        {date}
      </Flex>
    );
  }

  const dateNum = dayjs(date).date();

  return (
    <Button
      variant="unstyled"
      display="flex"
      flexDir="column"
      alignItems="center"
      fontWeight={400}
      fontSize="13px"
      onClick={func}
      isDisabled={isDisabled}
    >
      <Flex
        justify="center"
        color={isSelected ? "white" : dayjsToStr(today) === date && "var(--color-mint)"}
        align="center"
        w={size === "md" ? "36px" : "26px"}
        h={size === "md" ? "36px" : "26px"}
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

export default DatePointButton;
