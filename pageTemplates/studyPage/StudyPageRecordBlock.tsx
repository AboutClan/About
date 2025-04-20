import { Box, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import StudyChallengeModal from "../../modals/pop-up/StudyChallengeModal";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { formatMinutesToTime } from "../../utils/dateTimeUtils";

interface StudyPageRecordBlockProps {
  userInfo: IUser;
}

function StudyPageRecordBlock({ userInfo }: StudyPageRecordBlockProps) {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
  const [isModal, setIsModal] = useState(false);
  const typeToast = useTypeToast();
  const record = userInfo?.studyRecord;

  return (
    <>
      <Box my={5} p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
        <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
          스터디 챌린지
        </Box>
        <InfoBoxCol
          infoBoxPropsArr={[
            {
              category: "월간 목표 공부 시간",
              text: userInfo?.monthStudyTarget
                ? formatMinutesToTime(userInfo.monthStudyTarget)
                : "--",
              color: userInfo?.monthStudyTarget ? "mint" : null,
            },
            {
              category: "월간 참여 시간",
              text: !record
                ? "기록 없음"
                : `${formatMinutesToTime(record.monthMinutes)} (${record.monthCnt}회)`,
            },

            {
              category: "함께 도전중인 멤버",
              text: "--",
            },
          ]}
          size="md"
        />
        <Button
          w="full"
          fontSize="12px"
          fontWeight="semibold"
          mt={4}
          borderRadius="12px"
          colorScheme="black"
          h="44px"
          onClick={
            isGuest
              ? () => {
                  typeToast("guest");
                  return;
                }
              : () => (userInfo?.monthStudyTarget ? typeToast("not-yet") : setIsModal(true))
          }
        >
          {userInfo?.monthStudyTarget
            ? "도전중인 멤버 한 눈에 보기"
            : "월간 스터디 챌린지 신청하기"}
        </Button>
      </Box>
      {isModal && <StudyChallengeModal setIsModal={setIsModal} />}
    </>
  );
}

export default StudyPageRecordBlock;
