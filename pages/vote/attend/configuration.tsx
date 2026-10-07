import { Box } from "@chakra-ui/react";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import PageIntro from "@/components/atoms/PageIntro";
import SectionTitle from "@/components/atoms/SectionTitle";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import BottomNav from "@/components/layouts/BottomNav";
import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import ImageUploadInput from "@/components/molecules/ImageUploadInput";
import { STUDY_ATTEND_AT } from "@/constants/keys/queryKeys";
import { useStudyAttendCheckMutation } from "@/features/study/hooks/mutations";
import { useStudySetQuery } from "@/features/study/hooks/queries";
import { useResetStudyQuery } from "@/features/study/hooks/useResetStudyQuery";
import { useToast } from "@/hooks/custom/CustomToast";
import { useRealTimeAttendMutation } from "@/hooks/realtime/mutations";
import { transferStudyRewardState } from "@/recoils/transferRecoils";
import {
  StudyConfirmedSetProps,
  StudyType,
} from "@/types/models/studyTypes/study-set.types";
import { convertTimeStringToDayjs } from "@/utils/convertUtils/convertTypes";
import { dayjsToFormat, getTodayStr } from "@/utils/dateTimeUtils";
import { setLocalStorageObj } from "@/utils/storageUtils";

/** 예상 종료 시간으로 고를 수 있는 범위(출석 시점 기준, 시간). */
const END_TIME_RANGE_HOURS = 12;

/** 출석 메시지(자리·인상착의) 최소 길이. */
const MIN_ATTEND_MESSAGE_LENGTH = 5;

function Configuration() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const date = searchParams.get("date");
  const id = searchParams.get("id");
  const type = searchParams.get("type") as Exclude<StudyType, "participations">;
  const isSoloRealTimesPage = type === "soloRealTimes";

  const resetStudy = useResetStudyQuery();

  const { data: studySet } = useStudySetQuery(date, { enabled: !!date });

  const studyData = studySet && studySet[type];
  // const userInfo = useUserInfo();

  const confirmedSet = studyData as StudyConfirmedSetProps[];

  const findStudy = confirmedSet?.find((set) => set.study.place._id === id)?.study;

  const [image, setImage] = useState<Blob>();
  const [endTime, setEndTime] = useState(
    dayjsToFormat(dayjs().startOf("hour").add(3, "hour"), "HH:mm"),
  );

  // const setTransferStudyReward = useSetRecoilState(transferStudyRewardState);
  const textareaRef = useRef(null);

  const [attendMessage, setAttendMessage] = useState("");

  //  const keypadHeight = useKeypadHeight();

  //  useEffect(() => {
  //    if (isFocus && keypadHeight !== 0) {
  //      window.scrollBy({ top: 130, behavior: "smooth" });
  //    }
  //  }, [isFocus, keypadHeight]);

  // const studyType = myStudyResult?.status;

  // 서버가 400으로 거절하는 경우(확정 스터디 없음 / 이미 출석 처리됨)가 있어
  // onError가 없으면 버튼만 멈추고 아무 안내도 뜨지 않는다.
  const handleAttendError = (err: AxiosError) => {
    console.error(err);
    const message = (err?.response?.data as { message?: string })?.message;
    toast("error", message || "출석 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
  };

  const { mutate: handleArrived, isLoading: isLoading1 } = useStudyAttendCheckMutation({
    onSuccess(data) {
      handleAttendSuccess(data);
    },
    onError: handleAttendError,
  });

  const { mutate: attendRealTimeStudy, isLoading: isLoading2 } = useRealTimeAttendMutation(date, {
    onSuccess(data) {
      handleAttendSuccess(data);
    },
    onError: handleAttendError,
  });

  // const { mutate: imageUpload, isLoading: isLoading3 } = useImageUploadMutation({
  //   onSuccess() {
  //     resetStudy();
  //   },
  //   onError(err) {
  //     console.error(err);
  //     toast("error", "이미지 업로드에 실패했습니다.");
  //   },
  // });

  // 출석 시점 직후부터 30분 단위로 END_TIME_RANGE_HOURS 뒤까지 만든다.
  //
  // 예전에는 `while (currentDayjs.date() === dayjs().date())`로 오늘 자정까지만 만들어,
  // 23시에 출석하면 선택지가 23:00·23:30 둘뿐이었다(24시간 카페에서 새벽까지 공부하는
  // 경우를 고를 방법이 없었다). 시작도 startOf("hour")라 이미 지난 시각이 남아 있었다.
  const endTimeCandidates = useMemo(() => {
    const now = dayjs();
    const first = now
      .add(30 - (now.minute() % 30), "minute")
      .second(0)
      .millisecond(0);

    return Array.from({ length: END_TIME_RANGE_HOURS * 2 }, (_, i) =>
      first.add(i * 30, "minute"),
    );
  }, []);

  const timeOptions = useMemo(
    () => endTimeCandidates.map((candidate) => dayjsToFormat(candidate, "HH:mm")),
    [endTimeCandidates],
  );

  // "02:00" 같은 라벨만으로는 자정을 넘긴 시각인지 알 수 없으므로 후보에서 직접 찾는다.
  const getEndDayjs = (label: string) => {
    const idx = timeOptions.indexOf(label);
    return idx === -1 ? convertTimeStringToDayjs(label) : endTimeCandidates[idx];
  };

  const setTransferStudyReward = useSetRecoilState(transferStudyRewardState);

  const handleAttendSuccess = async (data) => {
    resetStudy();
    if (type === "results") {
      setLocalStorageObj(STUDY_ATTEND_AT, getTodayStr());
    }

    setTimeout(() => {
      setTransferStudyReward(data);
    }, 500);

    // 예전에는 results 타입일 때 같은 push를 두 번 호출해 히스토리에 같은 화면이
    // 두 번 쌓였고, 뒤로가기를 한 번 눌러도 화면이 바뀌지 않았다.
    if (id) {
      router.push(`/study/${id}/${date}?type=${type}`);
    } else {
      router.push(`/study/realTimes/${date}?type=${type}`);
    }
  };

  const formData = new FormData();

  const handleSubmit = () => {
    if (isSoloRealTimesPage && !image) {
      toast("warning", "이미지를 등록해 주세요");
      return;
    }

    // 1자 이상만 보던 검증이라 "ㅇ" 한 글자로 통과했다. 인상착의는 같은 조원이
    // 나를 찾는 데 쓰이므로 최소 길이를 두고, 왜 필요한지도 함께 알린다.
    // 직접 개설 스터디(openRealTimes)는 사진·메시지 없이도 출석할 수 있다.
    if (
      type !== "openRealTimes" &&
      (attendMessage?.trim()?.length ?? 0) < MIN_ATTEND_MESSAGE_LENGTH
    ) {
      if (isSoloRealTimesPage) toast("warning", "오늘의 한마디를 남겨주세요!");
      else toast("warning", "같은 조원이 찾을 수 있게 자리와 인상착의를 적어주세요");
      return;
    }
    if (!isSoloRealTimesPage && !findStudy) {
      toast("warning", "참여중인 스터디를 찾을 수 없습니다.");
      return;
    }

    if (isSoloRealTimesPage) {
      formData.append("memo", attendMessage);
      formData.append("status", "solo");
      formData.append("images", image as Blob);

      formData.append(
        "place",
        JSON.stringify({
          name: "temp",
          latitude: 0,
          longitude: 0,
          address: "temp",
        }),
      );
      formData.append(
        "time",
        JSON.stringify({
          start: dayjs().toISOString(),
          end: getEndDayjs(endTime).toISOString(),
        }),
      );
      attendRealTimeStudy(formData);
    } else if (type === "openRealTimes") {
      // 비어 있으면 보내지 않는다(빈 값을 append하면 "undefined" 문자열이 메모·파일 자리로 간다).
      if (attendMessage?.trim()) formData.append("memo", attendMessage);
      formData.append("place", JSON.stringify(findStudy.place.location));
      if (image) formData.append("images", image as Blob);
      formData.append(
        "time",
        JSON.stringify({
          start: dayjs().toISOString(),
          end: getEndDayjs(endTime).toISOString(),
        }),
      );

      attendRealTimeStudy(formData);
    } else {
      formData.append("memo", attendMessage);
      formData.append("end", getEndDayjs(endTime).toISOString());
      formData.append("image", image as Blob);

      handleArrived(formData);
    }
  };

  return (
    <>
      <Box minH="calc(100dvh)" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro
            main={{ first: isSoloRealTimesPage ? "개인 공부 인증" : "출석 인증하기" }}
            sub={
              isSoloRealTimesPage
                ? "인증에 필요한 정보를 입력해 주세요"
                : "출석에 필요한 정보를 입력해 주세요"
            }
          />

          <Box mb={5}>
            <Box mb={3}>
              <SectionTitle
                text={isSoloRealTimesPage ? "오늘의 공부 사진" : "현재 테이블 사진 (선택)"}
              />
            </Box>
            <ImageUploadInput setImageUrl={setImage} />
          </Box>
          <Box mb={3}>
            <SectionTitle
              text={
                isSoloRealTimesPage
                  ? "오늘의 공부 한마디"
                  : type === "openRealTimes"
                    ? "내 위치 및 인상착의 (선택)"
                    : "내 위치 및 인상착의"
              }
            />
          </Box>
          <Textarea
            value={attendMessage}
            onChange={(e) => setAttendMessage(e.target.value)}
            ref={textareaRef}
            minH="120px"
            placeholder={
              isSoloRealTimesPage
                ? "자유롭게 하고 싶은 말을 작성해 주세요!"
                : "ex) 2층 창가 자리 오른쪽 끝, 체크 셔츠 입고 있어요!"
            }
          />
          <Box mt={5}>
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
        isLoading={isLoading1 || isLoading2}
      />

      {/* {isChecking && (
        <>
          <Spinner text="위치를 확인중입니다..." />
          <ScreenOverlay zIndex={2000} />
        </>
      )} */}
    </>
  );
}

export default Configuration;
