import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import StudyChallengeModal from "../../modals/pop-up/StudyChallengeModal";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { formatMinutesToTime } from "../../utils/dateTimeUtils";

interface StudyPageRecordBlockProps {
  userInfo: IUser;
}

function StudyPageRecordBlock({ userInfo }: StudyPageRecordBlockProps) {
  const [isModal, setIsModal] = useState(false);
  const record = userInfo?.studyRecord;

  return (
    <>
      <Box my={5} p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
        <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
          내 스터디 참여 기록
        </Box>
        <InfoBoxCol
          infoBoxPropsArr={[
            {
              category: "월간 목표 공부 시간",
              text: !record
                ? "기록 없음"
                : userInfo?.monthStudyTarget
                ? formatMinutesToTime(userInfo.monthStudyTarget)
                : "설정 안함",
            },
            {
              category: "월간 참여 시간",
              text: !record
                ? "기록 없음"
                : `${formatMinutesToTime(record.monthMinutes)} (${record.monthCnt}회)`,
            },

            {
              category: "누적 참여 시간",
              text: !record
                ? "기록 없음"
                : `${formatMinutesToTime(record.accumulationMinutes)} (${
                    record.accumulationCnt
                  }회)`,
            },
          ]}
          size="md"
        />
        <Flex
          as="button"
          w="full"
          justify="center"
          align="center"
          fontSize="12px"
          fontWeight="semibold"
          mt={4}
          borderRadius="12px"
          bg="gray.800"
          color="white"
          h="44px"
          onClick={() => setIsModal(true)}
        >
          월간 스터디 챌린지 신청하기
        </Flex>
      </Box>
      {isModal && <StudyChallengeModal setIsModal={setIsModal} />}
    </>
  );
}

export default StudyPageRecordBlock;
