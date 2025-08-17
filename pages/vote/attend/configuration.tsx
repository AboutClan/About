import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import PageIntro from "../../../components/atoms/PageIntro";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import SectionTitle from "../../../components/atoms/SectionTitle";
import Select from "../../../components/atoms/Select";
import Spinner from "../../../components/atoms/Spinner";
import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../../hooks/custom/StudyHooks";
import { useImageUploadMutation } from "../../../hooks/image/mutations";
import { useRealTimeAttendMutation } from "../../../hooks/realtime/mutations";
import { useStudyAttendCheckMutation } from "../../../hooks/study/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { ModalLayout } from "../../../modals/Modals";
import {
  transferCollectionState,
  transferStudyAttendanceState,
} from "../../../recoils/transferRecoils";
import { CollectionProps } from "../../../types/models/collections";
import {
  StudyOpenRealTimesSet,
  StudyResultsSet,
  StudySoloRealTimesSet,
  StudyStatus,
} from "../../../types/models/studyTypes/derivedTypes";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

import { StudySetItem } from "../../../pages/study/[id]/[date]/index";
import { convertTimeStringToDayjs } from "../../../utils/convertUtils/convertTypes";

function Configuration() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const date = searchParams.get("date");
  const id = searchParams.get("id");
  const type = searchParams.get("type") as Exclude<StudyStatus, "participations">;
  const isSoloRealTimesPage = type === "soloRealTimes";

  const resetStudy = useResetStudyQuery();

  const { data: userInfo } = useUserInfoQuery();

  const { studySet } = useStudySetQuery(date, !!date && isSoloRealTimesPage);

  const studyData: StudySetItem[] = studySet && studySet[type];

  const findStudyArr = studyData?.filter((study) => study.date === date) as (
    | StudyOpenRealTimesSet
    | StudyResultsSet
    | StudySoloRealTimesSet
  )[];

  const findStudy = findStudyArr?.find((study) => study?.study?.place._id === id)?.study;

  const [endTime, setEndTime] = useState(
    dayjs().hour() < 21 ? dayjsToFormat(dayjs().startOf("hour").add(3, "hour"), "HH:mm") : "23:30",
  );

  const textareaRef = useRef(null);
  const [otherPermission, setOtherPermission] = useState<"허용" | "비허용">("허용");
  const [attendMessage, setAttendMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [stampCnt, setStampCnt] = useState<number>();

  const [transferStudyAttendance, setTransferStudyAttendance] = useRecoilState(
    transferStudyAttendanceState,
  );
  // const studyType = myStudyResult?.status;

  const setTransferCollection = useSetRecoilState(transferCollectionState);

  const { mutate: handleArrived, isLoading: isLoading1 } = useStudyAttendCheckMutation({
    onSuccess(data) {
      handleAttendSuccess(data);
    },
  });

  const { mutate: attendRealTimeStudy, isLoading: isLoading2 } = useRealTimeAttendMutation(date, {
    onSuccess(data) {
      handleAttendSuccess(data);
    },
  });

  const { mutate: imageUpload, isLoading: isLoading3 } = useImageUploadMutation({
    onSuccess() {
      resetStudy();
    },
    onError(err) {
      console.error(err);
      toast("error", "이미지 업로드에 실패했습니다.");
    },
  });

  let currentDayjs = dayjs().startOf("hour");
  const timeOptions = [];

  while (currentDayjs.date() === dayjs().date()) {
    timeOptions.push(dayjsToFormat(currentDayjs, "HH:mm"));
    currentDayjs = currentDayjs.add(30, "m");
  }

  // useEffect(() => {
  //   if (!transferStudyAttendance) return;
  //   if (isSoloPage) {
  //     setOtherPermission("비허용");
  //   }
  // }, [transferStudyAttendance]);

  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 500);
    }
  }, []);

  const handleAttendSuccess = (collection: CollectionProps) => {
    setTransferCollection({ alphabet: collection.alphabet, stamps: collection.stamps });

    resetStudy();
    setTransferStudyAttendance(null);

    if (id) {
      router.push(`/study/${id}/${date}?type=${type}`);
      toast("success", `출석 완료!`);
    } else {
      router.push(`/study/realTimes/${date}?type=${type}`);
      toast("success", `인증 완료!`);
    }
  };

  const formData = new FormData();

  const handleSubmit = () => {
    if (attendMessage?.length < 1) {
      if (isSoloRealTimesPage) toast("warning", "오늘의 한마디를 남겨주세요!");
      else toast("warning", "출석 메세지를 남겨주세요");
      return;
    }
    if (!isSoloRealTimesPage && !findStudy) {
      toast("warning", "참여중인 스터디를 찾을 수 없습니다.");
      return;
    }

    if (isSoloRealTimesPage) {
      if (!transferStudyAttendance?.image) {
        toast("warning", "인증 사진이 누락되었습니다.");
        return;
      } else if (!transferStudyAttendance?.place) {
        toast("warning", "스터디 장소가 입력되지 않았습니다.");
        return;
      }
      formData.append("memo", attendMessage);
      formData.append("status", otherPermission === "허용" ? "free" : "solo");
      formData.append("images", transferStudyAttendance?.image as Blob);
      formData.append("place", JSON.stringify(transferStudyAttendance?.place));
      formData.append(
        "time",
        JSON.stringify({
          start: dayjs().toISOString(),
          end: convertTimeStringToDayjs(endTime).toISOString(),
        }),
      );

      attendRealTimeStudy(formData);
    } else if (type === "openRealTimes") {
      formData.append("memo", attendMessage);
      formData.append("status", "open");

      formData.append("place", JSON.stringify(findStudy.place));

      formData.append(
        "time",
        JSON.stringify({
          start: dayjs().toISOString(),
          end: convertTimeStringToDayjs(endTime).toISOString(),
        }),
      );
      attendRealTimeStudy(formData);
    } else {
      setIsChecking(true);
      handleArrived({
        memo: attendMessage,
        end: convertTimeStringToDayjs(endTime).toISOString(),
      });
    }
  };

  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro
            main={{ first: isSoloRealTimesPage ? "개인 스터디 인증" : "출석 인증하기" }}
            sub={`${isSoloRealTimesPage ? "인증" : "출석"}에 필요한 정보를 입력해 주세요`}
          />
          <Box mb={5}>
            <Box mb={3}>
              <SectionTitle text="예상 종료 시간" />
            </Box>
            <Select
              size="lg"
              isFullSize
              options={timeOptions}
              defaultValue={endTime}
              setValue={setEndTime}
            />
          </Box>
          <Box mb={3}>
            <SectionTitle
              text={
                isSoloRealTimesPage || transferStudyAttendance
                  ? "오늘의 공부 한마디"
                  : "나의 인상착의"
              }
            />
          </Box>
          <Textarea
            value={attendMessage}
            onChange={(e) => setAttendMessage(e.target.value)}
            ref={textareaRef}
            placeholder={
              isSoloRealTimesPage || transferStudyAttendance
                ? "자유롭게 하고 싶은 말을 작성해 주세요"
                : "나를 유추할 수 있는 정보를 기입해 주세요"
            }
          />
          {/* <Box my={5}>
            <Box mb={3}>
              <SectionTitle text="다른 인원 참여 허용" isActive={false} />
            </Box>
            <Select
              options={["허용", "비허용"]}
              defaultValue={otherPermission}
              setValue={setOtherPermission}
              size="lg"
              isActive={false}
              isFullSize
            />
          </Box> */}
        </Slide>
      </Box>
      <BottomNav
        text={isSoloRealTimesPage ? "인증 완료" : "출석 완료"}
        onClick={handleSubmit}
        isLoading={isLoading1 || isLoading2 || isLoading3}
      />
      {isChecking && (
        <>
          <Spinner text="위치를 확인중입니다..." />
          <ScreenOverlay zIndex={2000} />
        </>
      )}
      {stampCnt && <ModalLayout setIsModal={() => setStampCnt(null)}>{stampCnt}</ModalLayout>}
    </>
  );
}

export default Configuration;
