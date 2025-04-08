import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarCheckIcon } from "../../../components/Icons/SolidIcons";
import {
  StudyCheckIcon,
  StudySelectIcon,
  StudyUserCheckIcon,
} from "../../../components/Icons/StudyIcons";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../../components/organisms/drawer/BottomFlexDrawer";
import StudyPlacePickerDrawer from "../../../components/services/studyVote/StudyPlacePickerDrawer";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../../hooks/realtime/mutations";
import { useStudyParticipationMutation } from "../../../hooks/study/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { CoordinatesProps } from "../../../types/common";
import { IModal } from "../../../types/components/modalTypes";
import {
  MyVoteStatus,
  RealTimeBasicVoteProps,
  StudyMergeResultProps,
} from "../../../types/models/studyTypes/studyDetails";
import { IStudyVoteTime, StudyVoteProps } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyPlaceDrawer from "../../vote/voteDrawer/StudyPlaceDrawer";

interface StudyControlDrawerProps extends IModal {
  myVoteStatus: MyVoteStatus;
  date: string;
  studyResults: StudyMergeResultProps[];
  currentLocation: CoordinatesProps;
  isModal: boolean;
}

function StudyControlDrawer({
  date,
  myVoteStatus,
  studyResults,
  currentLocation,
  isModal,
  setIsModal,
}: StudyControlDrawerProps) {
  const router = useRouter();
  const resetStudy = useResetStudyQuery();
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: participateRealTime } = useRealtimeVoteMutation({
    onSuccess() {
      toast("success", "참여가 완료되었습니다. 출석 인증도 잊지 마세요!");
      resetStudy();
    },
  });

  const { mutate: voteStudy, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      toast("success", "신청이 완료되었습니다. 결과 매칭을 기다려주세요!");
      resetStudy();
    },
  });

  const handleOneClickVote = () => {
    const { lat: latitude, lon: longitude } = { ...userInfo?.locationDetail };
    const voteData = {
      latitude,
      longitude,
      start: voteTime.start.toISOString(),
      end: voteTime.end.toISOString(),
    };
    handleVote(voteData, "vote");
  };

  const handleVote = (
    voteData: StudyVoteProps | RealTimeBasicVoteProps,
    type: "vote" | "realTime",
  ) => {
    console.log(type, voteData);
    if (type === "vote") voteStudy(voteData as StudyVoteProps);
    else if (type === "realTime") participateRealTime(voteData as RealTimeBasicVoteProps);
    setIsTimeRullet(false);
    setIsRightDrawer(false);
  };

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();

  const [isPlaceDrawer, setIsPlaceDrawer] = useState(false);
  const [isTimeRullet, setIsTimeRullet] = useState(false);
  const [isRightDrawer, setIsRightDrawer] = useState(false);

  const handleStudyVoteBtn = (type: "oneClick" | "direct" | "placePick" | "directAttend") => {
    if (type === "placePick") {
      if (!studyResults.length) {
        toast("warning", "진행중인 스터디가 없습니다.");
        return;
      }
      setIsPlaceDrawer(true);
    } else if (type === "oneClick") setIsTimeRullet(true);
    else if (type === "directAttend") router.push("/vote/attend/certification");
    else if (type === "direct") setIsRightDrawer(true);
    setIsModal(false);
    setIsPlaceDrawer(false);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text: myVoteStatus === "todayPending" ? "참여 확정" : "신청 완료",
      func: myVoteStatus === "todayPending" ? () => {} : handleOneClickVote,
      // loading: isLoading,
    },
  };

  return (
    <>
      {isModal && (
        <BottomFlexDrawer
          isOverlay
          isDrawerUp
          setIsModal={setIsModal}
          isHideBottom
          drawerOptions={{ footer: { text: "취소", func: () => setIsModal(false) } }}
          height={myVoteStatus === "todayPending" ? 249 : 197}
          zIndex={800}
        >
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            onClick={() =>
              handleStudyVoteBtn(myVoteStatus === "todayPending" ? "placePick" : "oneClick")
            }
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <StudyCheckIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              {myVoteStatus === "todayPending" ? "진행중인 스터디 참여" : "원클릭 스터디 신청"}
            </Box>
          </Button>
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            onClick={() => handleStudyVoteBtn("direct")}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <StudySelectIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              {myVoteStatus === "todayPending" ? "스터디 장소 직접 입력" : "출발 위치 직접 입력"}
            </Box>
          </Button>
          {myVoteStatus === "todayPending" && (
            <Button
              h="52px"
              justifyContent="flex-start"
              display="flex"
              variant="unstyled"
              py={4}
              w="100%"
              onClick={() => handleStudyVoteBtn("directAttend")}
            >
              <Box w="20px" h="20px" mr={4} opacity={0.28}>
                <StudyUserCheckIcon />
              </Box>
              <Box fontSize="13px" color="var(--gray-600)">
                실시간 개인 스터디 출석
              </Box>
            </Button>
          )}
          {myVoteStatus === "open" && (
            <Link href={`/vote/attend/certification`} style={{ width: "100%" }}>
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
          )}
        </BottomFlexDrawer>
      )}
      {isPlaceDrawer && (
        <StudyPlacePickerDrawer
          date={date}
          studyResults={studyResults}
          currentLocation={currentLocation}
          handlePickPlace={() => handleStudyVoteBtn("oneClick")}
          setIsModal={setIsPlaceDrawer}
        />
      )}
      {isTimeRullet && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeRullet}
          zIndex={800}
        />
      )}
      {isRightDrawer && (
        <StudyPlaceDrawer
          type={myVoteStatus === "todayPending" ? "realTime" : "vote"}
          date={date}
          handleStudyVote={(voteData) =>
            handleVote(voteData, myVoteStatus === "todayPending" ? "realTime" : "vote")
          }
          onClose={() => setIsRightDrawer(false)}
        />
      )}
    </>
  );
}

export default StudyControlDrawer;
