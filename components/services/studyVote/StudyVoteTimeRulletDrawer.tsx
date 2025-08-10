import dayjs, { Dayjs } from "dayjs";
import { Dispatch, useEffect, useState } from "react";

import { STUDY_VOTE_HOUR_ARR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { IModal } from "../../../types/components/modalTypes";
import { createTimeArr, parseTimeToDayjs } from "../../../utils/dateTimeUtils";
import RulletPickerTwo from "../../molecules/picker/RulletPickerTwo";
import BottomFlexDrawer, { BottomFlexDrawerOptions } from "../../organisms/drawer/BottomFlexDrawer";

interface IStudyVoteTimeRulletDrawer extends IModal {
  defaultVoteTime?: { start: Dayjs; end: Dayjs };
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
  drawerOptions: BottomFlexDrawerOptions;
  zIndex?: number;
}

export default function StudyVoteTimeRulletDrawer({
  setVoteTime,
  drawerOptions,
  setIsModal,
  zIndex,
  defaultVoteTime,
}: IStudyVoteTimeRulletDrawer) {
  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={zIndex || 5000}
        height={402}
        setIsModal={setIsModal}
        drawerOptions={drawerOptions}
      >
        <StudyVoteTimeRullets defaultVoteTime={defaultVoteTime} setVoteTime={setVoteTime} />
      </BottomFlexDrawer>
    </>
  );
}

interface StudyVoteTimeRulletsProps {
  defaultVoteTime: { start: Dayjs; end: Dayjs };
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
}

export function StudyVoteTimeRullets({ defaultVoteTime, setVoteTime }: StudyVoteTimeRulletsProps) {
  const startItemArr = createTimeArr(
    STUDY_VOTE_HOUR_ARR[0],
    STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 3],
  );

  const endTimeArr = createTimeArr(
    STUDY_VOTE_HOUR_ARR[2],
    STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 1],
  );

  const [rulletIndex, setRulletIndex] = useState<{
    left: number;
    right: number;
  }>({
    left: 8,
    right: 12,
  });

  const dayjsToTimeString = (time: Dayjs): string => {
    const hour = time.hour();
    const minute = time.minute();

    // 30분 단위로 반올림
    const roundedMinutes = Math.round(minute / 30) * 30;
    const adjustedTime = dayjs(time)
      .hour(roundedMinutes === 60 ? hour + 1 : hour)
      .minute(roundedMinutes === 60 ? 0 : roundedMinutes)
      .second(0); // 필요하다면 초도 제거

    return adjustedTime.format("HH:mm");
  };
  useEffect(() => {
    if (defaultVoteTime) {
      console.log("NO");
      const startIndex = startItemArr.findIndex((time) => {
        return (
          dayjsToTimeString(parseTimeToDayjs(time)) === dayjsToTimeString(defaultVoteTime.start)
        );
      });
      const endIndex = endTimeArr.findIndex((time) => {
        return dayjsToTimeString(parseTimeToDayjs(time)) === dayjsToTimeString(defaultVoteTime.end);
      });

      if (startIndex !== -1 && endIndex !== -1) {
        const end = startIndex + 4 <= endIndex ? endIndex : startIndex + 4;
        setRulletIndex({
          left: startIndex,
          right: end,
        });
      }
    }
  }, []);

  useEffect(() => {
    let newLeft = rulletIndex.left;
    let newRight = rulletIndex.right;
    let changed = false;

    // 시작 시간 변경 시 종료 시간 최소 4칸 뒤로
    if (newLeft + 4 > newRight) {
      newRight = Math.min(newLeft + 4, endTimeArr.length - 1);
      changed = true;
    }

    // 종료 시간 변경 시 시작 시간보다 앞서지 않게
    if (newRight - 4 < newLeft) {
      newLeft = Math.max(newRight - 4, 0);
      changed = true;
    }

    if (changed) {
      console.log(newLeft, newRight);

      setRulletIndex({ left: newLeft, right: newRight });
    }
  }, [rulletIndex.left, rulletIndex.right]);

  useEffect(() => {
    console.log("rulletIndex", rulletIndex);

    setVoteTime({
      start: parseTimeToDayjs(startItemArr[rulletIndex.left]),
      end: parseTimeToDayjs(endTimeArr[rulletIndex.right]),
    });
  }, [rulletIndex]);

  return (
    <RulletPickerTwo
      leftRulletArr={startItemArr}
      rightRulletArr={endTimeArr}
      rulletIndex={rulletIndex}
      setRulletIndex={setRulletIndex}
    />
  );
}
