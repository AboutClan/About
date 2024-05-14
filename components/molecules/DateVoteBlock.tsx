import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { DateVoteButtonProps } from "../../pageTemplates/home/studyController/StudyControllerVoteButton";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface DateVoteBlockProps {
  buttonProps: DateVoteButtonProps;
  func: () => void;
}

function DateVoteBlock({ buttonProps, func }: DateVoteBlockProps) {
  return (
    <Flex w="100%" className="main_vote_btn" h="77px" justify="space-between" align="center">
      <Box fontSize="16px" fontWeight={500}>
        <Box as="span" mr="4px">
          오늘
        </Box>
        <Box as="span" color="var(--color-mint)">
          {dayjsToFormat(dayjs(), "D일")}
        </Box>
      </Box>
      <Button
        bgColor={buttonProps.color}
        color={buttonProps.color === "var(--gray-400)" ? "black" : "white"}
        onClick={func}
      >
        {buttonProps.text}
      </Button>
    </Flex>
  );
}

export default DateVoteBlock;
