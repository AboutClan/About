import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Input from "../../../components/atoms/Input";
import TimeSelectorUnit from "../../../components/atoms/TimeSelectorUnit";
import { TIME_SELECTOR_UNIT } from "../../../constants/util/util";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IGatherListItem, IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";
import { ITime } from "../../../types/utils/timeAndDate";

interface IGatherWritingDateSubject {
  gatherWriting: IGatherWriting;
  setGatherList: DispatchType<IGatherListItem[]>;
  date: Date;
}
interface IGatherSubject {
  text: string;
  time: ITime;
}

function GatherWritingDateSubject({
  gatherWriting,
  setGatherList,
  date,
}: IGatherWritingDateSubject) {
  const [firstGather, setFirstGather] = useState<IGatherSubject>({
    text: gatherWriting?.gatherList?.[0]?.text || "",
    time: { hours: 14, minutes: 0 },
  });
  const [secondGather, setSecondGather] = useState<IGatherSubject>({
    text: gatherWriting?.gatherList?.[1]?.text || "늦참",
    time: { hours: 18, minutes: 0 },
  });

  useEffect(() => {
    const [{ time: firstTime }, { time: secondTime }] = gatherWriting?.gatherList || [
      { time: null },
      { time: null },
    ];

    if (firstTime || date) {
      setFirstGather((old) => ({
        ...old,
        time: {
          hours: firstTime ? firstTime.hours : dayjs(date).hour(),
          minutes: firstTime ? firstTime.minutes : dayjs(date).minute(),
        },
      }));
    }
    if (secondTime) {
      setSecondGather((old) => ({
        ...old,
        time: {
          hours: secondTime.hours,
          minutes: secondTime.minutes,
        },
      }));
    }
  }, [date]);

  useEffect(() => {
    const gatherList = [{ text: firstGather.text, time: firstGather.time }];
    if (secondGather?.text?.length)
      gatherList.push({ text: secondGather.text, time: secondGather.time });
    setGatherList(gatherList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstGather.text, firstGather.time, secondGather.text, secondGather.time]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>, type: "first" | "second") => {
    const value = e.target.value;
    if (type === "first") setFirstGather((old) => ({ ...old, text: value }));
    if (type === "second") setSecondGather((old) => ({ ...old, text: value }));
  };

  return (
    <Layout>
      <TimeContent>
        <span>1차 모임</span>

        <Box flex={1}>
          <Input
            placeholder="ex) 보드게임"
            value={firstGather?.text}
            onChange={(e) => onChangeInput(e, "first")}
          />
        </Box>
        <Box h="40px" />
        <TimeSelectorUnit
          time={firstGather.time}
          setTime={(time) => setFirstGather((old) => ({ ...old, time }))}
          timeArr={TIME_SELECTOR_UNIT}
        />
      </TimeContent>
      <TimeContent>
        <span>2차 모임</span>
        <Box flex={1}>
          <Input
            placeholder="ex) 뒤풀이"
            value={secondGather?.text}
            onChange={(e) => onChangeInput(e, "second")}
          />
        </Box>
        <Box h="40px" />
        <TimeSelectorUnit
          time={secondGather?.time}
          setTime={(time) => setSecondGather((old) => ({ ...old, time }))}
          timeArr={TIME_SELECTOR_UNIT}
          disabled={secondGather?.text === ""}
        />
      </TimeContent>
      <Message>2차 모임이 없는 경우 &lsquo;늦참&rsquo;으로 설정해주세요!</Message>
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: 60px;
`;

const Message = styled.div`
  margin-top: var(--gap-5);
  font-size: 13px;
  color: var(--gray-500);
`;
const TimeContent = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--gap-4);
  > span:first-child {
    color: var(--gray-2);
    font-size: 14px;
    font-weight: 600;
    margin-right: var(--gap-3);
  }
`;

export default GatherWritingDateSubject;
