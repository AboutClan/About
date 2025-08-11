import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  StudyCheckIcon,
  StudySelectIcon,
  StudyUserCheckIcon,
} from "../../../components/Icons/ControlButtonIcon";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../../components/organisms/drawer/BottomFlexDrawer";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../../hooks/realtime/mutations";
import { useStudyParticipateMutation, useStudyVoteMutation } from "../../../hooks/study/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { RealTimeVoteProps } from "../../../types/models/studyTypes/requestTypes";
import { IStudyVoteTime, StudyVoteProps } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyPlaceDrawer from "../../vote/voteDrawer/StudyPlaceDrawer";

interface StudyControlDrawerProps {
  date: string;

  onClose: () => void;
}

function StudyControlDrawer({
  date,

  onClose,
}: StudyControlDrawerProps) {
  const router = useRouter();
  const resetStudy = useResetStudyQuery();
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: voteStudy } = useStudyVoteMutation(dayjs(date), "post", {
    onSuccess() {
      resetStudy();
      onClose();
    },
  });
  const { mutate: participateStudyOne } = useStudyParticipateMutation(dayjs(date), {
    onSuccess() {
      toast("success", "참여가 완료되었습니다. 출석 인증도 잊지 마세요!");
      resetStudy();
      onClose();
    },
  });
  const { mutate: participateRealTime } = useRealtimeVoteMutation(date, {
    onSuccess() {
      // toast("success", "참여가 완료되었습니다. 출석 인증도 잊지 마세요!");
      toast("success", "스터디가 개설되었습니다.");
      resetStudy();
      onClose();
    },
  });

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();

  const [timeRulletType, setTimeRulletType] = useState<"vote" | "participate" | "realTime">();
  const [isPlacePickDrawer, setIsPlacePickDrawer] = useState(false);
  const [rightDrawerType, setRightDrawerType] = useState<"realTime" | "vote">(null);

  const handleStudyVoteBtn = (
    type: "selectTime" | "pickPlace" | "directInputPlace" | "directAttend",
  ) => {
    switch (type) {
      case "selectTime":
        setTimeRulletType("vote");
        break;
      // case "pickPlace":
      //   if (!studyResults.length) {
      //     toast("warning", "진행중인 스터디가 없습니다.", 1000);
      //     return;
      //   }
      //   setIsPlacePickDrawer(true);
      //   break;
      case "directInputPlace":
        setRightDrawerType("realTime");
        break;
      case "directAttend":
        router.push(`/vote/attend/certification?date=${date}`);
        break;
    }

    // onClose();
  };

  const handleStudyVote = (
    voteData: StudyVoteProps | RealTimeVoteProps,
    type: "vote" | "realTime",
  ) => {
    if (type === "vote") voteStudy(voteData as StudyVoteProps);
    else participateRealTime(voteData as RealTimeVoteProps);
    setTimeRulletType(null);
    setRightDrawerType(null);
  };

  const timeRulletDrawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text: timeRulletType === "participate" ? "참여 확정" : "신청 완료",
      func:
        timeRulletType === "participate"
          ? () => {
              participateStudyOne({
                placeId: selectedPlaceId,
                start: voteTime.start,
                end: voteTime.end,
              });
              setTimeRulletType(null);
            }
          : () => {
              if (!userInfo?.locationDetail) {
                toast("error", "스터디 기준 위치를 설정해 주세요!");
                return;
              }
              const { lat: latitude, lon: longitude } = { ...userInfo?.locationDetail };
              console.log("WE", latitude, longitude, voteTime);
              const voteData = {
                latitude,
                longitude,
                start: voteTime.start,
                end: voteTime.end,
              };
              handleStudyVote(voteData, "vote");
            },
    },
  };

  const locationDetatilText = userInfo?.locationDetail?.text;
  console.log(timeRulletType, "WOW", rightDrawerType, isPlacePickDrawer);
  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isDrawerUp
        setIsModal={onClose}
        isHideBottom
        drawerOptions={{ footer: { text: "취소", func: onClose } }}
        height={249}
        zIndex={800}
      >
        <Button
          h="52px"
          justifyContent="flex-start"
          display="flex"
          variant="unstyled"
          py={4}
          w="100%"
          lineHeight="20px"
          onClick={() => handleStudyVoteBtn("selectTime")}
        >
          <Box w="20px" h="20px" mr={4} opacity={0.28}>
            <StudyCheckIcon />
          </Box>
          <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
            스터디 신청
          </Box>
        </Button>
        <Button
          h="52px"
          justifyContent="flex-start"
          display="flex"
          variant="unstyled"
          py={4}
          w="100%"
          onClick={() => handleStudyVoteBtn("directInputPlace")}
          lineHeight="20px"
        >
          <Box w="20px" h="20px" mr={4} opacity={0.28}>
            <StudySelectIcon />
          </Box>
          <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
            스터디 개설
          </Box>
        </Button>

        <Link href={`/vote/attend/certification?date=${date}`} style={{ width: "100%" }}>
          <Button
            h="52px"
            display="flex"
            justifyContent="flex-start"
            variant="unstyled"
            py={4}
            w="100%"
            isDisabled={date !== dayjsToStr(dayjs())}
            lineHeight="20px"
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <StudyUserCheckIcon color="gray" />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)" fontWeight={500}>
              실시간 공부 인증
            </Box>
          </Button>
        </Link>
      </BottomFlexDrawer>

      {/* {isPlacePickDrawer && (
        <StudyPlacePickerDrawer
          date={date}
          studyResults={studyResults}
          currentLocation={currentLocation}
          handlePickPlace={(placeId: string) => {
            setSelectedPlaceId(placeId);
            setTimeRulletType("participate");
            setIsPlacePickDrawer(false);
          }}
          setIsModal={setIsPlacePickDrawer}
        />
      )} */}
      {timeRulletType && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={timeRulletDrawerOptions}
          setIsModal={() => setTimeRulletType(null)}
          zIndex={800}
        />
      )}
      {rightDrawerType && (
        <StudyPlaceDrawer
          date={date}
          handleStudyVote={(voteData) => handleStudyVote(voteData, rightDrawerType)}
          onClose={() => setRightDrawerType(null)}
        />
      )}
    </>
  );
}

export default StudyControlDrawer;
