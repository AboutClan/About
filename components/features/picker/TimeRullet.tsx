import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/dist/client/router";

const ITEM_HEIGHT = 34;
interface ITimeRullet {
  timeArr: { hour: number; minutes: string }[];
  setTime: (time: Dayjs) => void;
  startTime?: Dayjs;
  isEndTime?: boolean;
}

function TimeRullet({ timeArr, startTime, isEndTime, setTime }: ITimeRullet) {
  const router = useRouter();
  const voteDate = dayjs(router.query.date as string);

  const [index, setIndex] = useState<number>();
  const [endTimeStartLimit, setEndTimeStartLimit] = useState<number>();
  const isDragging = useMotionValue(false);

  useEffect(() => {
    if (isEndTime && startTime && !isDragging.get()) {
      let findIdx = timeArr.findIndex(
        (item) =>
          item.hour === startTime.hour() &&
          (item.minutes === "00"
            ? startTime.minute() === 0
            : startTime.minute() === 30)
      );
      if (findIdx < 4) findIdx = 0;
      if (findIdx > 20) findIdx = 16;
      setIndex(findIdx + 4);
      setEndTimeStartLimit(findIdx);
      y.set(-(findIdx + 3) * ITEM_HEIGHT + 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, isEndTime, timeArr]);

  useEffect(() => {
    if (index === undefined) {
      setIndex(4);
      y.set(-3 * ITEM_HEIGHT + 30);
      return;
    }

    const selectTime = timeArr[index];
    setTime(
      voteDate?.hour(Number(selectTime.hour)).minute(Number(selectTime.minutes))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const y = useMotionValue(0);

  const handleDrag = () => {
    const Y = y.get();

    let moveValue = -(Y + 30) / ITEM_HEIGHT;

    if (moveValue > 0) Math.ceil(moveValue);
    else if (moveValue < -500) Math.floor(moveValue);
    else Math.round(moveValue);

    let move =
      (moveValue > 0
        ? Math.ceil(moveValue)
        : moveValue < -500
        ? Math.floor(moveValue)
        : Math.round(moveValue)) + 3;

    if (move < endTimeStartLimit) {
      y.set(-(endTimeStartLimit - 2) * ITEM_HEIGHT + 30);
      return;
    }
    if (move > 20) move = 20;
    if (move < 0) move = 0;
    setIndex(move);
  };

  return (
    <Layout>
      <TimeLayout
        style={{ y }}
        drag="y"
        dragConstraints={{ top: -560, bottom: 10 }}
        dragElastic={0.2}
        dragMomentum={false}
        onDrag={() => handleDrag()}
        onDragStart={() => isDragging.set(true)}
        onDragEnd={() => isDragging.set(false)}
      >
        {timeArr.map((item, idx) =>
          idx === index ? (
            <ChoiceBlock key={idx}>
              <BlockIcon>
                {item.hour} : {item.minutes}
              </BlockIcon>
            </ChoiceBlock>
          ) : (
            <ChoiceBlock
              key={idx}
              isDisabled={isEndTime && idx < endTimeStartLimit}
            >
              {item.hour} : {item.minutes}
            </ChoiceBlock>
          )
        )}
      </TimeLayout>{" "}
    </Layout>
  );
}

const Layout = styled.div`
  height: 187px;
  margin-top: var(--margin-md);
  width: 161px;
  border-radius: 13px;
  background-color: var(--font-h8);
  color: var(--font-h2);
  overflow: hidden;
`;

const TimeLayout = styled(motion.div)`
  height: ${ITEM_HEIGHT * 21 + 30}px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BlockIcon = styled.div`
  background-color: var(--font-h1);
  color: white;
  width: 121px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
`;

const ChoiceBlock = styled.div<{ isDisabled?: boolean }>`
  height: ${ITEM_HEIGHT}px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  background-color: var(--font-h8);
  color: ${(props) => (props.isDisabled ? "var(--font-h4)" : "var(--font-h1)")};
`;

export default TimeRullet;
