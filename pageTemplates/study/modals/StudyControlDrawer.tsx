import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  StudyCheckIcon,
  StudySelectIcon,
  StudyUserCheckIcon,
} from "../../../components/Icons/ControlButtonIcon";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../../hooks/custom/StudyHooks";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyApplyDrawer from "../../vote/voteDrawer/StudyApplyDrawer";
import StudyOpenDrawer from "../../vote/voteDrawer/StudyOpenDrawer";

type DrawerType = "apply" | "open";

interface StudyControlDrawerProps {
  onClose: () => void;
}

function StudyControlDrawer({ onClose }: StudyControlDrawerProps) {
  const router = useRouter();
  const toast = useToast();


  const { data: userInfo } = useUserInfoQuery();

  // const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  // const [voteTime, setVoteTime] = useState<IStudyVoteTime>();

  // const [timeRulletType, setTimeRulletType] = useState<"vote" | "participate" | "realTime">();
  // const [isPlacePickDrawer, setIsPlacePickDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);

  // const handleStudyVoteBtn = (
  //   type: "selectTime" | "pickPlace" | "directInputPlace" | "directAttend",
  // ) => {
  //   switch (type) {
  //     case "selectTime":
  //       setTimeRulletType("vote");
  //       break;
  //     // case "pickPlace":
  //     //   if (!studyResults.length) {
  //     //     toast("warning", "진행중인 스터디가 없습니다.", 1000);
  //     //     return;
  //     //   }
  //     //   setIsPlacePickDrawer(true);
  //     //   break;
  //     case "directInputPlace":
  //       setDrawerType("realTime");
  //       break;
  //     case "directAttend":
  //       router.push(`/vote/attend/certification?date=${date}`);
  //       break;
  //   }

  //   // onClose();
  // };

  // const handleStudyVote = (
  //   voteData: StudyVoteProps | RealTimeVoteProps,
  //   type: "vote" | "realTime",
  // ) => {
  //   if (type === "vote") voteStudy(voteData as StudyVoteProps);
  //   else participateRealTime(voteData as RealTimeVoteProps);
  //   setTimeRulletType(null);
  //   setDrawerType(null);
  // };

  // const timeRulletDrawerOptions: BottomFlexDrawerOptions = {
  //   header: {
  //     title: "스터디 참여 시간 선택",
  //     subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
  //   },
  //   footer: {
  //     text: timeRulletType === "participate" ? "참여 확정" : "신청 완료",
  //     func:
  //       timeRulletType === "participate"
  //         ? () => {
  //             participateStudyOne({
  //               placeId: selectedPlaceId,
  //               start: voteTime.start,
  //               end: voteTime.end,
  //             });
  //             setTimeRulletType(null);
  //           }
  //         : () => {
  //             if (!userInfo?.locationDetail) {
  //               toast("error", "스터디 기준 위치를 설정해 주세요!");
  //               return;
  //             }
  //             const { lat: latitude, lon: longitude } = { ...userInfo?.locationDetail };
  //             console.log("WE", latitude, longitude, voteTime);
  //             const voteData = {
  //               latitude,
  //               longitude,
  //               start: voteTime.start,
  //               end: voteTime.end,
  //             };
  //             handleStudyVote(voteData, "vote");
  //           },
  //   },
  // };

  // const locationDetatilText = userInfo?.locationDetail?.text;
  // console.log(timeRulletType, "WOW", drawerType, isPlacePickDrawer);

  const buttonProps: {
    text: string;
    icon: JSX.Element;
    func: () => void;
    isDisabled?: boolean;
  }[] = [
    {
      text: "스터디 신청",
      icon: <StudyCheckIcon />,
      func: () => {
        setDrawerType("apply");
      },
    },
    {
      text: "스터디 개설",
      icon: <StudySelectIcon />,
      func: () => {
        setDrawerType("open");
      },
    },
    {
      text: " 실시간 공부 인증",
      icon: <StudyUserCheckIcon color="gray" />,
      func: () => {
        router.push(`/vote/attend/certification?date=${dayjsToStr(dayjs())}`);
      },
    },
  ];

  const defaultDates = [];

  // studySet.participations.filter((par) => par.user._id === userInfo?._id).forEach((study) => {

  // })

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
        {buttonProps.map((props) => (
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            lineHeight="20px"
            onClick={props.func}
            isDisabled={props?.isDisabled}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              {props.icon}
            </Box>
            <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
              {props.text}
            </Box>
          </Button>
        ))}

        {/* <Link href={`/vote/attend/certification?date=${date}`} style={{ width: "100%" }}>
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
        </Link> */}
      </BottomFlexDrawer>

      {drawerType === "apply" && (
        <StudyApplyDrawer
         
          onClose={() => setDrawerType(null)}
        />
      )}
      {drawerType === "open" && <StudyOpenDrawer onClose={() => setDrawerType(null)} />}
      {/* {timeRulletType && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={timeRulletDrawerOptions}
          setIsModal={() => setTimeRulletType(null)}
          zIndex={800}
        />
      )} */}
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
    </>
  );
}

export default StudyControlDrawer;
