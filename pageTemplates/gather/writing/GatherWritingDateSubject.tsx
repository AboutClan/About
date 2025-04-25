import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { Input } from "../../../components/atoms/Input";
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
    <Box mt={20}>
      <Box as="label" fontSize="13px">
        1차 모임
      </Box>
      <Flex align="center" mt={2} mb={4}>
        <Box flex={1} mr={4}>
          <Input
            placeholder="ex) 보드게임"
            value={firstGather?.text}
            onChange={(e) => onChangeInput(e, "first")}
            size="md"
          />
        </Box>

        <TimeSelectorUnit
          time={firstGather.time}
          setTime={(time) => setFirstGather((old) => ({ ...old, time }))}
          timeArr={TIME_SELECTOR_UNIT}
        />
      </Flex>

      <Box as="label" fontSize="13px">
        2차 모임
      </Box>
      <Flex align="center" mt={2} mb={4}>
        <Box flex={1} mr={4}>
          <Input
            placeholder="ex) 뒤풀이"
            value={secondGather?.text}
            onChange={(e) => onChangeInput(e, "second")}
            size="md"
          />
        </Box>
        <TimeSelectorUnit
          time={secondGather?.time}
          setTime={(time) => setSecondGather((old) => ({ ...old, time }))}
          timeArr={TIME_SELECTOR_UNIT}
        />
      </Flex>

      <Message>2차 모임이 없는 경우 &lsquo;늦참&rsquo;으로 설정해주세요!</Message>
    </Box>
  );
}

const Message = styled.div`
  margin-top: var(--gap-5);
  font-size: 12px;
  color: var(--gray-500);
`;

export default GatherWritingDateSubject;
