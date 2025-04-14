import { Box } from "@chakra-ui/react";

import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { formatMinutesToTime } from "../../utils/dateTimeUtils";

interface StudyPageRecordBlockProps {
  userInfo: IUser;
}

function StudyPageRecordBlock({ userInfo }: StudyPageRecordBlockProps) {
  const record = userInfo?.studyRecord;
  return (
    <Box my={5} p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
      <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
        내 스터디 참여 기록
      </Box>
      <InfoBoxCol
        infoBoxPropsArr={[
          { category: "이번 달 참여 횟수", text: !record ? "기록 없음" : record.monthCnt + " 회" },
          {
            category: "이번 달 참여 시간",
            text: !record ? "기록 없음" : formatMinutesToTime(record.monthMinutes),
          },
          {
            category: "누적 참여 횟수",
            text: !record ? "기록 없음" : record.accumulationCnt + "회",
          },
          {
            category: "누적 참여 시간",
            text: !record ? "기록 없음" : formatMinutesToTime(record.accumulationMinutes),
          },
        ]}
        size="md"
      />
    </Box>
  );
}

export default StudyPageRecordBlock;
