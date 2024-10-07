import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import PageIntro from "../../../components/atoms/PageIntro";
import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import SectionTitle from "../../../components/atoms/SectionTitle";
import Select from "../../../components/atoms/Select";
import Spinner from "../../../components/atoms/Spinner";
import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { STUDY_RECORD_INFO } from "../../../constants/keys/localStorage";
import {
  POINT_SYSTEM_DEPOSIT,
  POINT_SYSTEM_PLUS,
} from "../../../constants/serviceConstants/pointSystemConstants";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useImageUploadMutation } from "../../../hooks/image/mutations";
import { useRealtimeAttendMutation } from "../../../hooks/realtime/mutations";
import { useStudyAttendCheckMutation } from "../../../hooks/study/mutations";
import {
  useAboutPointMutation,
  usePointSystemMutation,
  useScoreMutation,
} from "../../../hooks/user/mutations";
import { getMyStudyVoteInfo } from "../../../libs/study/getMyStudy";
import { ModalLayout } from "../../../modals/Modals";
import {
  myRealStudyInfoState,
  myStudyInfoState,
  studyAttendInfoState,
} from "../../../recoils/studyRecoils";
import { transferCollectionState } from "../../../recoils/transferRecoils";
import { CollectionProps } from "../../../types/models/collections";

import { convertTimeStringToDayjs } from "../../../utils/convertUtils/convertTypes";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

function Configuration() {
  const { data: session } = useSession();
  const toast = useToast();
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();
  const [endTime, setEndTime] = useState(
    dayjsToFormat(dayjs().startOf("hour").add(3, "hour"), "HH:mm"),
  );
  const textareaRef = useRef(null);
  const [otherPermission, setOtherPermission] = useState<"허용" | "비허용">("허용");
  const [attendMessage, setAttendMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [stampCnt, setStampCnt] = useState<number>();

  const [studyAttendInfo, setStudyAttendInfo] = useRecoilState(studyAttendInfoState);
  const setTransferCollection = useSetRecoilState(transferCollectionState);
  const myStudy = useRecoilValue(myStudyInfoState);
  const myRealStudy = useRecoilValue(myRealStudyInfoState);

  const { mutate: getAboutPoint } = useAboutPointMutation();
  const { mutate: getScore } = useScoreMutation();
  const { mutate: getDeposit } = usePointSystemMutation("deposit");
  const { mutate: handleArrived } = useStudyAttendCheckMutation(dayjsToStr(dayjs()), {
    onSuccess(data) {
      handleAttendSuccess(data.data);
    },
    onError: () => typeToast("error"),
  });

  const { mutate } = useRealtimeAttendMutation();
  const { mutate: imageUpload } = useImageUploadMutation({
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

  while (1) {
    timeOptions.push(dayjsToFormat(currentDayjs, "HH:mm"));
    currentDayjs = currentDayjs.add(30, "m");
    if (currentDayjs.date() !== dayjs().date()) break;
  }

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

    const pointObj = POINT_SYSTEM_PLUS.STUDY_ATTEND_CHECK;
    if (myStudy?.status === "open") {
      getAboutPoint(pointObj);
      const myStudyInfo = getMyStudyVoteInfo(myStudy, session?.user.uid);
      const isLate = dayjs().isAfter(dayjs(myStudyInfo?.end).add(1, "hour"));
      if (isLate) getDeposit(POINT_SYSTEM_DEPOSIT.STUDY_ATTEND_LATE);
      toast(
        "success",
        `출석 완료! ${pointObj.value} 포인트가 적립되었습니다. ${isLate ? "하지만 지각..." : ""}`,
      );
    } else {
      getScore(pointObj);
      toast("success", `출석 완료! ${pointObj.value}점을 획득했습니다`);
    }
  };

  const saveTogetherMembers = () => {
    const myStudyDetail = getMyStudyVoteInfo(myStudy, session?.user.uid);
    const record = {
      date: dayjsToStr(dayjs()),
      place: myStudyDetail?.fullname,
      arrived: myStudyDetail?.arrived,
      members: myStudy?.attendences
        .map((who) => who.user)
        .filter((who) => who.uid !== session?.user.uid),
      time: {
        start: myStudyDetail?.start,
        end: convertTimeStringToDayjs(endTime),
      },
    };
    localStorage.setItem(STUDY_RECORD_INFO, JSON.stringify(record));
  };

  const formData = new FormData();

  const handleSubmit = () => {
    // setStudyAttendInfo(null);

    if (true) {
      setIsChecking(true);
      handleArrived({ memo: attendMessage, endHour: convertTimeStringToDayjs(endTime) });
      setTimeout(() => {
        setIsChecking(false);
      }, 2000);
    } else {
      formData.append("memo", "test");
      formData.append("status", "solo");
      formData.append("image", studyAttendInfo?.image as Blob);
      mutate(formData);
    }
  };

  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro main={{ first: "출석 인증하기" }} sub="스터디 출석을 인증해 보세요" />
          <Box mb={3}>
            <SectionTitle text="나의 인상착의" />
          </Box>
          <Textarea
            value={attendMessage}
            onChange={(e) => setAttendMessage(e.target.value)}
            ref={textareaRef}
            placeholder="나를 유추할 수 있는 정보를 기입해 보세요"
          />
          <Box my={5}>
            <Box mb={3}>
              <SectionTitle text="다른 인원 참어 허용" isActive={false} />
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
      <BottomNav text="출 석" onClick={handleSubmit} />
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
