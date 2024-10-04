import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import PageIntro from "../../../components/atoms/PageIntro";
import SectionTitle from "../../../components/atoms/SectionTitle";
import Selector from "../../../components/atoms/Selector";
import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";

function Configuration() {
  const [endTime, setEndTime] = useState(
    dayjsToFormat(dayjs().startOf("hour").add(3, "hour"), "HH:mm"),
  );
  const [otherPermission, setOtherPermission] = useState<"허용" | "비허용">("허용");

  let currentDayjs = dayjs().startOf("hour");

  const timeOptions = [];

  while (1) {
    timeOptions.push(dayjsToFormat(currentDayjs, "HH:mm"));
    currentDayjs = currentDayjs.add(30, "m");
    if (currentDayjs.date() !== dayjs().date()) break;
  }


  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro main={{ first: "출석 인증하기" }} sub="스터디 출석을 인증해 보세요" />
          <SectionTitle text="나의 인상착의" />
          <Textarea placeholder="나를 유추할 수 있는 정보를 기입해 보세요" />
          <SectionTitle text="다른 인원 참어 허용" />
          <Selector
            options={["허용", "비허용"]}
            defaultValue={otherPermission}
            setValue={setOtherPermission}
          />
          <SectionTitle text="나의 인상착의" />
          <Selector options={timeOptions} defaultValue={endTime} setValue={setEndTime} />
        </Slide>
      </Box>
      <BottomNav />
    </>
  );
}

export default Configuration;
