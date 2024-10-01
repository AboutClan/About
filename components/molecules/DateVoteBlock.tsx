import { Box, Button, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

import { LOCATION_OPEN } from "../../constants/location";
import { DateVoteButtonProps } from "../../pageTemplates/home/study/studyController/StudyControllerVoteButton";
import { myStudyInfoState } from "../../recoils/studyRecoils";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";

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
  const location = convertLocationLangTo(locationEn as LocationEn, "kr");

  const myStudy = useRecoilValue(myStudyInfoState);

  const isOpen = LOCATION_OPEN.includes(location as ActiveLocation);

  return (
    <Flex w="100%" justify="space-between" align="center">
      <Box fontSize="16px" fontWeight={500}>
        <Box as="span" mr="4px">
          현재 인원:
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
        isLoading={myStudy === undefined && isOpen}
        bgColor={
          !isOpen
            ? "var(--gray-300)"
            : myStudy === undefined
              ? "var(--color-mint)"
              : buttonProps.color
        }
        opacity={buttonProps.type === "active" ? 1 : 0.4}
        color={
          myStudy === undefined
            ? "white"
            : buttonProps.color === "var(--gray-400)"
              ? "black"
              : "white"
        }
        onClick={isOpen ? func : undefined}
      >
        {isOpen ? buttonProps.text : "준비중 ..."}
      </Button>
    </Flex>
  );
}

export default DateVoteBlock;
