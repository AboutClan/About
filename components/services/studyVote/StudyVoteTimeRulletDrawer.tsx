import { Dayjs } from "dayjs";
import { Dispatch, useEffect, useState } from "react";

import { STUDY_VOTE_HOUR_ARR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { IModal } from "../../../types/components/modalTypes";
import { createTimeArr, parseTimeToDayjs } from "../../../utils/dateTimeUtils";
import RulletPickerTwo from "../../molecules/picker/RulletPickerTwo";
import BottomDrawerLg, { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";

interface IStudyVoteTimeRulletDrawer extends IModal {
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
  drawerOptions: IBottomDrawerLgOptions;
}

export default function StudyVoteTimeRulletDrawer({
  setVoteTime,
  drawerOptions,
  setIsModal,
}: IStudyVoteTimeRulletDrawer) {
  return (
    <>
      <BottomDrawerLg options={drawerOptions} setIsModal={setIsModal}>
        <StudyVoteTimeRullets setVoteTime={setVoteTime} />
      </BottomDrawerLg>
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
    right: 10,
  });
  console.log("r", startItemArr[rulletIndex.left], endTimeArr[rulletIndex.right]);

  useEffect(() => {
    if (rulletIndex.left + 6 > rulletIndex.right && rulletIndex.left + 6 < endTimeArr.length - 1) {
      setRulletIndex((old) => ({ ...old, right: old.left + 6 }));
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
