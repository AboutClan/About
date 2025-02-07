import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import { CalendarCheckIcon, ClockIcon } from "../../components/Icons/SolidIcons";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { getMyStudyInfo } from "../../libs/study/getMyStudyMethods";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface StudyControlButtonProps {
  date: string;
}

function StudyControlButton({ date }: StudyControlButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isStudyDrawer, setIsStudyDrawer] = useState(false);

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);
  const myStudyInfo = getMyStudyInfo(myStudyParticipation, session?.user.uid);
  const isArrived = myStudyInfo?.attendanceInfo.arrived;

  const isOpenStudy = myStudyParticipation?.status === "open";

  const handleStudyVoteButton = () => {
    setIsStudyDrawer(false);
  };

  return (
    <>
      <Flex
        position="fixed"
        zIndex="400"
        fontSize="12px"
        lineHeight="24px"
        fontWeight={700}
        bottom={`calc(var(--bottom-nav-height) + ${iPhoneNotchSize() + 12}px)`}
        right="20px"
      >
        <Button
          fontSize="12px"
          h="40px"
          bgColor="black"
          color="white"
          px={4}
          borderRadius="20px"
          lineHeight="24px"
          iconSpacing={1}
          leftIcon={<CheckCircleIcon size="sm" isFill={false} />}
          onClick={() => setIsStudyDrawer(true)}
          isDisabled={!!isArrived}
          _hover={{
            background: undefined,
          }}
        >
          {isArrived ? "출석 완료" : "스터디"}
        </Button>
      </Flex>
      {isStudyDrawer && (
        <BottomFlexDrawer
          isOverlay
          isDrawerUp
          setIsModal={() => setIsStudyDrawer(false)}
          isHideBottom
          drawerOptions={{ footer: { text: "취소", func: () => setIsStudyDrawer(false) } }}
          height={197}
          zIndex={800}
        >
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            onClick={handleStudyVoteButton}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <ClockIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              스터디 예약
            </Box>
          </Button>

          <Link
            href={
              isOpenStudy
                ? `/vote/attend/configuration?${searchParams.toString()}`
                : `/vote/attend/certification?${searchParams.toString()}`
            }
            style={{ width: "100%" }}
          >
            <Button
              h="52px"
              display="flex"
              justifyContent="flex-start"
              variant="unstyled"
              py={4}
              w="100%"
              isDisabled={date !== dayjsToStr(dayjs())}
            >
              <Box w="20px" h="20px" mr={4} opacity={0.28}>
                <CalendarCheckIcon />
              </Box>
              <Box fontSize="13px" color="var(--gray-600)">
                실시간 출석체크
              </Box>
            </Button>
          </Link>
        </BottomFlexDrawer>
      )}
    </>
  );
}

export default StudyControlButton;
