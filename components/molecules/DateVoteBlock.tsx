import { Box, Button, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

import { DateVoteButtonProps } from "../../pageTemplates/home/study/studyController/StudyControllerVoteButton";
import { myStudyState } from "../../recoils/studyRecoils";

interface DateVoteBlockProps {
  buttonProps: DateVoteButtonProps;
  func: () => void;
  cnt: number;
}

function DateVoteBlock({ buttonProps, func, cnt }: DateVoteBlockProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const locationEn = searchParams.get("location");

  const myStudy = useRecoilValue(myStudyState);

  return (
    <Flex w="100%" justify="space-between" align="center">
      <Box fontSize="16px" fontWeight={500}>
        <Box as="span" mr="4px">
          현재 신청 인원:
        </Box>

        <Box display="inline-block" color="var(--color-mint)">
          {cnt !== undefined ? (
            <button onClick={() => router.push(`/study/waiting/${locationEn}/${date}`)}>
              <u>{cnt}명</u>
            </button>
          ) : (
            <Box w="22px" textAlign="center">
              -
            </Box>
          )}
        </Box>
      </Box>

      <Button
        className="main_vote_btn"
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
