import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { PlusIcon } from "../../components/Icons/MathIcons";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  date: string;
  memberCnt: number;
  isParticipationPage: boolean;
}
function StudyDateBar({ date, memberCnt, isParticipationPage }: IStudyDateBar) {
  const typeToast = useTypeToast();

  return (
    <>
      <Box mt={5} mb={2}>
        <Flex justify="space-between" align="center">
          <Box fontWeight="bold" fontSize="18px">
            {isParticipationPage
              ? "스터디 신청 멤버"
              : dayjsToFormat(dayjs(date), `M월 D일  참여 멤버`)}
          </Box>
          <Button variant="unstyled" onClick={() => typeToast("not-yet")}>
            <PlusIcon color="mint" size="sm" />
          </Button>
        </Flex>
        <Box mt={1} fontSize="12px" color="gray.500">
          현재 <b>{memberCnt}명의 멤버</b>가{" "}
          {isParticipationPage ? "스터디를 기다리고 있어요 !" : "참여중이에요 !"}
        </Box>
      </Box>
    </>
  );
}

export default StudyDateBar;
