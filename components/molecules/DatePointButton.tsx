import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { getTodayStr } from "../../utils/dateTimeUtils";

export interface DatePointButtonProps {
  date: string;
  func: () => void;
  size?: "sm" | "md";
  isSelected?: boolean;
  pointType?: "mint";
  weekend?: "sat" | "sun";
  isDisabled: boolean;
  isMint: boolean;
}

function DatePointButton({
  date,
  func,
  size = "md",
  isSelected,
  isDisabled,
  isMint,
}: DatePointButtonProps) {
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
        bgColor="mint"
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
      pos="relative"
      fontSize="15px"
      onClick={func}
      isDisabled={isDisabled}
      _disabled={{
        cursor: "not-allowed",
      }}
    >
      <Flex
        justify="center"
        color={
          isSelected ? "white" : isMint ? "var(--color-mint)" : isDisabled ? "gray.400" : "gray.800"
        }
        align="center"
        w={size === "md" ? "40px" : "26px"}
        h={size === "md" ? "40px" : "26px"}
        position="relative"
        zIndex={4}
      >
        {!date ? null : !isSelected ? dateNum : <TodayCircle date={dateNum} />}
        {date === getTodayStr() && (
          <Box bottom="4px" pos="absolute" w="3px" h="3px" borderRadius="full" bg="gray.800"></Box>
        )}
      </Flex>
    </Button>
  );
}

export default DatePointButton;
