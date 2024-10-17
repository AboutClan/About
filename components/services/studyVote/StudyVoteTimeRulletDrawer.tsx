import { Dayjs } from "dayjs";
import { Dispatch, useEffect, useState } from "react";

import { STUDY_VOTE_HOUR_ARR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { IModal } from "../../../types/components/modalTypes";
import { createTimeArr, parseTimeToDayjs } from "../../../utils/dateTimeUtils";
import RulletPickerTwo from "../../molecules/picker/RulletPickerTwo";
import BottomFlexDrawer, { BottomFlexDrawerOptions } from "../../organisms/drawer/BottomFlexDrawer";

interface IStudyVoteTimeRulletDrawer extends IModal {
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
  drawerOptions: BottomFlexDrawerOptions;
  zIndex?: number;
}

export default function StudyVoteTimeRulletDrawer({
  setVoteTime,
  drawerOptions,
  setIsModal,
  zIndex,
}: IStudyVoteTimeRulletDrawer) {
  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={zIndex || 5000}
        height={382}
        setIsModal={setIsModal}
        drawerOptions={drawerOptions}
      >
        <StudyVoteTimeRullets setVoteTime={setVoteTime} />
      </BottomFlexDrawer>
    </>
  );
}

interface StudyVoteTimeRulletsProps {
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
}

export function StudyVoteTimeRullets({ setVoteTime }: StudyVoteTimeRulletsProps) {
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
