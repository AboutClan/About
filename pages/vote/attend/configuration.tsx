import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { STUDY_ATTEND_RECORD } from "../../../constants/keys/queryKeys";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useMyStudyResult } from "../../../hooks/custom/StudyHooks";
import { useImageUploadMutation } from "../../../hooks/image/mutations";
import { useRealTimeAttendMutation } from "../../../hooks/realtime/mutations";
import { useStudyAttendCheckMutation } from "../../../hooks/study/mutations";
import { ModalLayout } from "../../../modals/Modals";
import {
  transferCollectionState,
  transferStudyAttendanceState,
} from "../../../recoils/transferRecoils";
import { CollectionProps } from "../../../types/models/collections";
import { convertTimeStringToDayjs } from "../../../utils/convertUtils/convertTypes";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

function Configuration() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const date = searchParams.get("date");
  const id = searchParams.get("id");

  const resetStudy = useResetStudyQuery();
  const myStudyResult = useMyStudyResult(dayjsToStr(dayjs()));

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
  const studyType = myStudyResult?.status;

  const setTransferCollection = useSetRecoilState(transferCollectionState);

  const { mutate: handleArrived, isLoading: isLoading1 } = useStudyAttendCheckMutation({
    onSuccess(data) {
      handleAttendSuccess(data);
    },
  });

  const { mutate: attendRealTimeStudy, isLoading: isLoading2 } = useRealTimeAttendMutation({
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

  const isSoloPage = transferStudyAttendance?.status === "solo";
  useEffect(() => {
    if (!transferStudyAttendance) return;
    if (isSoloPage) {
      setOtherPermission("비허용");
    }
  }, [transferStudyAttendance]);

  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 500);
    }
  }, []);

  const handleAttendSuccess = (collection: CollectionProps) => {
    setTransferCollection({ alphabet: collection.alphabet, stamps: collection.stamps });
    saveTogetherMembers();
    resetStudy();
    setTransferStudyAttendance(null);
    toast("success", `출석이 완료되었습니다.`);

    if (id) {
      router.push(`/study/${id}/${date}`);
    } else {
      router.push(`/studyPage?date=${date}`);
    }
  };

  const saveTogetherMembers = () => {
    const place = myStudyResult?.place.name || transferStudyAttendance?.place.name;

    const members = myStudyResult
      ? myStudyResult.members
          .filter((who) => who.user._id !== session?.user.id)
          .map((member) => ({
            image: member.user.profileImage,
            avatar: member.user?.avatar,
          }))
      : [];

    const record = {
      date: dayjsToStr(dayjs()),
      place,
      members,
    };
    localStorage.setItem(STUDY_ATTEND_RECORD, JSON.stringify(record));
  };

  const formData = new FormData();

  const handleSubmit = () => {
    if (attendMessage?.length < 1) {
      toast("warning", "출석 메세지를 남겨주세요");
      return;
    }

    if (
      !transferStudyAttendance ||
      (studyType === "open" && myStudyResult.place.name === transferStudyAttendance?.place?.name)
    ) {
      setIsChecking(true);
      handleArrived({ memo: attendMessage, end: convertTimeStringToDayjs(endTime).toISOString() });
      if (!transferStudyAttendance) return;
      formData.append("image", transferStudyAttendance.image);
      formData.append("path", "studyAttend");
      imageUpload(formData);
    } else {
      formData.append("memo", attendMessage);
      formData.append("status", otherPermission === "허용" ? "free" : "solo");
      formData.append("images", transferStudyAttendance?.image as Blob);
      formData.append(
        "place",
        JSON.stringify(transferStudyAttendance?.place || myStudyResult?.place),
      );

      formData.append(
        "time",
        JSON.stringify({
          start: dayjs().toISOString(),
          end: convertTimeStringToDayjs(endTime).toISOString(),
        }),
      );

      attendRealTimeStudy(formData);
    }
  };
  console.log(53, isSoloPage);
  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro
            main={{ first: "출석 인증하기" }}
            sub="스터디 출석에 필요한 정보를 입력해 주세요"
          />
          <Box mb={3}>
            <SectionTitle
              text={isSoloPage || transferStudyAttendance ? "오늘의 공부 한마디" : "나의 인상착의"}
            />
          </Box>
          <Textarea
            value={attendMessage}
            onChange={(e) => setAttendMessage(e.target.value)}
            ref={textareaRef}
            placeholder={
              isSoloPage || transferStudyAttendance
                ? "자유롭게 하고 싶은 말을 작성해 주세요"
                : "나를 유추할 수 있는 정보를 기입해 주세요"
            }
          />
          <Box my={5}>
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
          </Box>
          <Box>
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
        </Slide>
      </Box>
      <BottomNav
        text="출 석"
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
