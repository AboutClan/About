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
        height={400}
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
  const startItemArr = createTimeArr(STUDY_VOTE_HOUR_ARR[0], STUDY_VOTE_HOUR_ARR[11]);

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
    return dayjs(time).format("HH:mm");
  };

  useEffect(() => {
    if (defaultVoteTime) {
     
      const startIndex = startItemArr.findIndex(
        (time) =>
          dayjsToTimeString(parseTimeToDayjs(time)) === dayjsToTimeString(defaultVoteTime.start),
      );
      const endIndex = endTimeArr.findIndex(
        (time) =>
          dayjsToTimeString(parseTimeToDayjs(time)) === dayjsToTimeString(defaultVoteTime.end),
      );

      if (startIndex !== -1 && endIndex !== -1) {
        setRulletIndex({
          left: startIndex,
          right: endIndex,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (rulletIndex.left + 4 > rulletIndex.right && rulletIndex.left + 4 < endTimeArr.length - 1) {
      setRulletIndex((old) => ({ ...old, right: old.left + 4 }));
    }
  }, [rulletIndex.left]);

  useEffect(() => {
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
