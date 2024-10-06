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
import { STUDY_ATTEND_MEMBERS } from "../../../constants/keys/localStorage";
import {
  POINT_SYSTEM_DEPOSIT,
  POINT_SYSTEM_PLUS,
} from "../../../constants/serviceConstants/pointSystemConstants";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyAttendCheckMutation } from "../../../hooks/study/mutations";
import {
  useAboutPointMutation,
  usePointSystemMutation,
  useScoreMutation,
} from "../../../hooks/user/mutations";
import { useAlphabetMutation } from "../../../hooks/user/sub/collection/mutations";
import { getMyStudyVoteInfo } from "../../../libs/study/getMyStudy";
import { getRandomAlphabet } from "../../../libs/userEventLibs/collection";
import { myStudyInfoState, studyAttendInfoState } from "../../../recoils/studyRecoils";
import { transferAlphabetState } from "../../../recoils/transferRecoils";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";
import { isPWA } from "../../../utils/validationUtils";

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

  const [studyAttendInfo, setStudyAttendInfo] = useRecoilState(studyAttendInfoState);
  const setTransferAlphabet = useSetRecoilState(transferAlphabetState);
  const myStudy = useRecoilValue(myStudyInfoState);

  const { mutate: getAboutPoint } = useAboutPointMutation();
  const { mutate: getScore } = useScoreMutation();
  const { mutate: getAlphabet } = useAlphabetMutation("get");
  const { mutate: getDeposit } = usePointSystemMutation("deposit");

  const { mutate: handleArrived } = useStudyAttendCheckMutation(dayjsToStr(dayjs()), {
    onSuccess() {
      saveTogetherMembers();
      resetStudy();
      getRandomAlphabetOrNone();

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
    },
    onError: () => typeToast("error"),
  });

  const getRandomAlphabetOrNone = () => {
    const alphabet = getRandomAlphabet(20);
    if (alphabet) {
      getAlphabet({ alphabet });
      setTransferAlphabet(alphabet);
    }
  };
  const saveTogetherMembers = () => {
    const studyVotingTable = JSON.parse(localStorage.getItem(STUDY_ATTEND_MEMBERS)) || [];
    const newEntry = {
      date: dayjsToStr(dayjs()),
      members: myStudy?.attendences
        .map((who) => who.user)
        .filter((who) => who.uid !== session?.user.uid),
    };
    localStorage.setItem(STUDY_ATTEND_MEMBERS, JSON.stringify([...studyVotingTable, newEntry]));
  };

  let currentDayjs = dayjs().startOf("hour");

  const timeOptions = [];

  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 500);
    }
  }, []);

  while (1) {
    timeOptions.push(dayjsToFormat(currentDayjs, "HH:mm"));
    currentDayjs = currentDayjs.add(30, "m");
    if (currentDayjs.date() !== dayjs().date()) break;
  }

  const handleBottomNav = () => {
    setStudyAttendInfo(null);
  };

  const handleAttendCheck = () => {
    if (isPWA()) {
      toast("error", "어플상으로만 출석체크가 가능합니다.");
      return;
    }
    setIsChecking(true);
    handleArrived("" || "출석");
    setTimeout(() => {
      setIsChecking(false);
    }, 2000);

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
                <SectionTitle text="다른 인원 참어 허용" />
              </Box>
              <Select
                options={["허용", "비허용"]}
                defaultValue={otherPermission}
                setValue={setOtherPermission}
                size="lg"
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
        <BottomNav text="출 석" onClick={handleBottomNav} />
        {isChecking && (
          <>
            <Spinner text="위치를 확인중입니다..." />
            <ScreenOverlay zIndex={2000} />
          </>
        )}
      </>
    );
  };
}

export default Configuration;
