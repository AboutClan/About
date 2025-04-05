import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { CalendarCheckIcon } from "../../components/Icons/SolidIcons";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../components/organisms/drawer/BottomFlexDrawer";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getMyStudyInfo } from "../../libs/study/getMyStudyMethods";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import { IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import { VoteDrawerPlace } from "../vote/voteDrawer/VoteDrawerPlace";

interface StudyControlButtonProps {
  date: string;
  setIsVoteDrawer: DispatchBoolean;
  isVoting: boolean;
}

function StudyControlButton({ date, setIsVoteDrawer, isVoting }: StudyControlButtonProps) {
  const resetStudy = useResetStudyQuery();
  const toast = useTypeToast();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastStudyHours = dayjs(date).hour(9).startOf("hour").diff(dayjs(), "m");

  const [isStudyDrawer, setIsStudyDrawer] = useState(false);
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeRullet, setIsTimeRullet] = useState(false);
  const [isRightDrawer, setIsRightDrawer] = useState(false);

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);
  const myStudyInfo = getMyStudyInfo(myStudyParticipation, session?.user.uid);
  const isArrived = myStudyInfo?.attendanceInfo.arrived;

  const isOpenStudy = myStudyParticipation?.status === "open";

  const { data: userInfo } = useUserInfoQuery();

  const myStudyStatus =
    lastStudyHours > 0
      ? isVoting
        ? "voting"
        : "notVoting"
      : isArrived
      ? "arrived"
      : isVoting
      ? "participating"
      : "todayPending";

  const { mutate: handleCancel } = useStudyParticipationMutation(dayjs(date), "delete", {
    onSuccess() {
      resetStudy();
    },
  });
  const { mutate: voteStudy, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      toast("vote");
      resetStudy();
    },
  });


  const handleVote = () => {
    const { lat: latitude, lon: longitude } = { ...userInfo?.locationDetail };

    voteStudy({
      latitude,
      longitude,
      start: voteTime.start.toISOString(),
      end: voteTime.end.toISOString(),
    });
   
    // if (!myVote?.main || !voteTime?.start || !voteTime?.end) {
    //   // typeToast("omission");
    //   return;
    // }
    // patchAttend({ place: myVote.main, subPlace: myVote?.sub, ...voteTime });
  };

  const onClickButton = () => {
    switch (myStudyStatus) {
      case "notVoting":
        setIsStudyDrawer(true);
        return;
      case "participating":
        router.push(
          isOpenStudy
            ? `/vote/attend/configuration?${searchParams.toString()}`
            : `/vote/attend/certification?${searchParams.toString()}`,
        );
        return;
      case "voting":
        handleCancel();
        return;
      case "todayPending":
        setIsRightDrawer(true);
        return;
    }
  };

  const handleStudyVoteButton = () => {
    setIsStudyDrawer(false);
    if (setIsVoteDrawer) {
      setIsVoteDrawer(true);
      return;
    }
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
      // loading: isLoading,
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
          color="white"
          px={4}
          borderRadius="20px"
          lineHeight="24px"
          iconSpacing={1}
          colorScheme={
            myStudyStatus === "voting"
              ? ""
              : myStudyStatus === "notVoting"
              ? "mint"
              : myStudyStatus === "todayPending"
              ? "blue"
              : ""
          }
          rightIcon={
            myStudyStatus === "voting" ? (
              <StudyUserIcon />
            ) : myStudyStatus === "notVoting" ? (
              <StudyUserIcon />
            ) : myStudyStatus === "todayPending" ? (
              <StudySoloIcon />
            ) : (
              <></>
            )
          }
          onClick={onClickButton}
          isDisabled={!!isArrived}
          _hover={{
            background: undefined,
          }}
        >
          {myStudyStatus === "voting"
            ? ""
            : myStudyStatus === "notVoting"
            ? "참여 신청"
            : myStudyStatus === "todayPending"
            ? "개인 스터디 신청"
            : ""}
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
              <CheckIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              원클릭 스터디 신청
            </Box>
          </Button>
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            onClick={() => setIsRightDrawer(true)}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <SelectIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              스터디 위치 직접 입력
            </Box>
          </Button>
          {myStudyStatus === "participating" && (
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
          )}
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
      {isRightDrawer && (
        <VoteDrawerPlace
          setIsVoteDrawer={setIsVoteDrawer}
          date={date}
          setIsRightDrawer={setIsRightDrawer}
        />
      )}
    </>
  );
}

function StudyUserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g opacity="0.8">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.75 5.82324C3.99623 5.82324 4.24005 5.77474 4.46753 5.68052C4.69502 5.58629 4.90172 5.44818 5.07583 5.27407C5.24994 5.09996 5.38805 4.89326 5.48227 4.66577C5.5765 4.43829 5.625 4.19447 5.625 3.94824C5.625 3.70201 5.5765 3.4582 5.48227 3.23071C5.38805 3.00323 5.24994 2.79653 5.07583 2.62242C4.90172 2.44831 4.69502 2.3102 4.46753 2.21597C4.24005 2.12174 3.99623 2.07324 3.75 2.07324C3.25272 2.07324 2.77581 2.27079 2.42417 2.62242C2.07254 2.97405 1.875 3.45096 1.875 3.94824C1.875 4.44552 2.07254 4.92244 2.42417 5.27407C2.77581 5.6257 3.25272 5.82324 3.75 5.82324ZM4 8.91374C4 8.28174 4.3855 7.34624 5.24 6.63774C4.8185 6.48924 4.326 6.39624 3.75 6.39624C1.23 6.39624 0.25 8.11524 0.25 8.91374C0.25 9.71374 2.3365 9.92574 3.75 9.92574C3.9855 9.92574 4.24 9.91924 4.5005 9.90574C4.17 9.64224 4 9.31224 4 8.91374Z"
          fill="white"
          fill-opacity="0.72"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.25 6.39674C5.73 6.39674 4.75 8.11524 4.75 8.91424C4.75 9.71324 6.8365 9.92624 8.25 9.92624C9.6635 9.92624 11.75 9.71324 11.75 8.91424C11.75 8.11524 10.77 6.39674 8.25 6.39674ZM8.25 5.82324C8.49623 5.82324 8.74005 5.77474 8.96753 5.68052C9.19502 5.58629 9.40172 5.44818 9.57583 5.27407C9.74994 5.09996 9.88805 4.89326 9.98227 4.66577C10.0765 4.43829 10.125 4.19447 10.125 3.94824C10.125 3.70201 10.0765 3.4582 9.98227 3.23071C9.88805 3.00323 9.74994 2.79653 9.57583 2.62242C9.40172 2.44831 9.19502 2.3102 8.96753 2.21597C8.74005 2.12174 8.49623 2.07324 8.25 2.07324C7.75272 2.07324 7.27581 2.27079 6.92417 2.62242C6.57254 2.97405 6.375 3.45096 6.375 3.94824C6.375 4.44552 6.57254 4.92244 6.92417 5.27407C7.27581 5.6257 7.75272 5.82324 8.25 5.82324Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

function StudySoloIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g opacity="0.8">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.5 5.05002H10.45V4.00002C10.4461 3.88334 10.397 3.77273 10.3131 3.69156C10.2292 3.6104 10.117 3.56502 10.0002 3.56502C9.88347 3.56502 9.77129 3.6104 9.68737 3.69156C9.60345 3.77273 9.55436 3.88334 9.55047 4.00002V5.05002H8.49997C8.38063 5.05002 8.26617 5.09743 8.18177 5.18183C8.09738 5.26622 8.04997 5.38068 8.04997 5.50002C8.04997 5.61937 8.09738 5.73383 8.18177 5.81822C8.26617 5.90261 8.38063 5.95002 8.49997 5.95002H9.55047V7.00002C9.54846 7.06035 9.55861 7.12046 9.5803 7.17678C9.602 7.23311 9.6348 7.28449 9.67677 7.32787C9.71873 7.37126 9.76899 7.40576 9.82456 7.42932C9.88013 7.45288 9.93987 7.46502 10.0002 7.46502C10.0606 7.46502 10.1203 7.45288 10.1759 7.42932C10.2315 7.40576 10.2817 7.37126 10.3237 7.32787C10.3656 7.28449 10.3984 7.23311 10.4201 7.17678C10.4418 7.12046 10.452 7.06035 10.45 7.00002V5.95002H11.5C11.6193 5.95002 11.7338 5.90261 11.8182 5.81822C11.9026 5.73383 11.95 5.61937 11.95 5.50002C11.95 5.38068 11.9026 5.26622 11.8182 5.18183C11.7338 5.09743 11.6193 5.05002 11.5 5.05002ZM4.99997 5.72802C5.57735 5.72802 6.13108 5.49866 6.53934 5.09039C6.94761 4.68213 7.17697 4.1284 7.17697 3.55102C7.17697 2.97365 6.94761 2.41992 6.53934 2.01165C6.13108 1.60339 5.57735 1.37402 4.99997 1.37402C4.4226 1.37402 3.86887 1.60339 3.4606 2.01165C3.05233 2.41992 2.82297 2.97365 2.82297 3.55102C2.82297 4.1284 3.05233 4.68213 3.4606 5.09039C3.86887 5.49866 4.4226 5.72802 4.99997 5.72802ZM4.99997 6.39402C1.86547 6.39402 0.646973 8.38852 0.646973 9.31652C0.646973 10.244 3.24147 10.491 4.99997 10.491C6.75847 10.491 9.35297 10.244 9.35297 9.31602C9.35297 8.38852 8.13447 6.39402 4.99997 6.39402Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#424242"
    >
      <path d="m429-438-60-59q-11-11-25-11t-25 11q-11 11-11 25.5t11 25.5l85 85q11 11 25 11t25-11l187-187q11-11 11-25.5T641-599q-11-11-25-11t-25 11L429-438Zm51 342q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Z" />
    </svg>
  );
}

function SelectIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="#424242"
    >
      <path d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM345-297l128-59q3.95-2 7.5-2t7.5 2l128 59q14 6 24-3t5-21L502-668q-6.33-15-22.17-15Q464-683 458-668L315-321q-5 12 5.69 21 10.7 9 24.31 3Z" />
    </svg>
  );
}

export default StudyControlButton;
