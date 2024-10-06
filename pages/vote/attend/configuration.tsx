import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import PageIntro from "../../../components/atoms/PageIntro";
import SectionTitle from "../../../components/atoms/SectionTitle";
import Select from "../../../components/atoms/Select";
import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { studyAttendInfoState } from "../../../recoils/studyRecoils";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

function Configuration() {
  const [endTime, setEndTime] = useState(
    dayjsToFormat(dayjs().startOf("hour").add(3, "hour"), "HH:mm"),
  );
  const [otherPermission, setOtherPermission] = useState<"허용" | "비허용">("허용");
  const [attendMessage, setAttendMessage] = useState("");
  const [studyAttendInfo, setStudyAttendInfo] = useRecoilState(studyAttendInfoState);

  const textareaRef = useRef(null);

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
    </>
  );
}

export default Configuration;
