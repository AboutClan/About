import { Box, Button, Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { DateVoteButtonProps } from "../../pageTemplates/home/studyController/StudyControllerVoteButton";
import { myStudyState } from "../../recoils/studyRecoils";

interface DateVoteBlockProps {
  buttonProps: DateVoteButtonProps;
  func: () => void;
  cnt: number;
}

function DateVoteBlock({ buttonProps, func, cnt }: DateVoteBlockProps) {
  const myStudy = useRecoilValue(myStudyState);
  return (
    <Flex w="100%" className="main_vote_btn" justify="space-between" align="center">
      <Box fontSize="16px" fontWeight={500}>
        <Box as="span" mr="4px">
          현재 참여 인원:
        </Box>
        <Box display="inline-block" color="var(--color-mint)">
          <Box display="inline-block" w="16px" textAlign="center">
            {cnt === undefined ? "- " : cnt}
          </Box>
          명
        </Box>
      </Box>

      <Button
        isLoading={myStudy === undefined}
        bgColor={myStudy === undefined ? "var(--color-mint)" : buttonProps.color}
        opacity={buttonProps.type === "active" ? 1 : 0.4}
        color={
          myStudy === undefined
            ? "white"
            : buttonProps.color === "var(--gray-400)"
              ? "black"
              : "white"
        }
        onClick={func}
      >
        {buttonProps.text}
      </Button>
    </Flex>
  );
}

export default DateVoteBlock;
