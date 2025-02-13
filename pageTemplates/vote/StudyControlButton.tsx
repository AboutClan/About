import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import { CalendarCheckIcon, ClockIcon } from "../../components/Icons/SolidIcons";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../components/organisms/drawer/BottomFlexDrawer";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { getMyStudyInfo } from "../../libs/study/getMyStudyMethods";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { IStudyVoteTime, MyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface StudyControlButtonProps {
  date: string;
  myVote: MyVoteProps;
}

function StudyControlButton({ myVote, date }: StudyControlButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isStudyDrawer, setIsStudyDrawer] = useState(false);
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeRullet, setIsTimeRullet] = useState(false);

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);
  const myStudyInfo = getMyStudyInfo(myStudyParticipation, session?.user.uid);
  const isArrived = myStudyInfo?.attendanceInfo.arrived;

  const isOpenStudy = myStudyParticipation?.status === "open";

  const { mutate: patchAttend, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      //  handleSuccess();
    },
  });

  const handleVote = () => {
    if (!myVote?.main || !voteTime?.start || !voteTime?.end) {
      // typeToast("omission");
      return;
    }
    patchAttend({ place: myVote.main, subPlace: myVote?.sub, ...voteTime });
  };

  const handleStudyVoteButton = () => {
    setIsStudyDrawer(false);
    setIsTimeRullet(true);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요!",
    },
    footer: {
      text: "신청 완료",
      func: handleVote,
      loading: isLoading,
    },
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
      {isTimeRullet && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeRullet}
          zIndex={800}
        />
      )}
    </>
  );
}

export default StudyControlButton;
