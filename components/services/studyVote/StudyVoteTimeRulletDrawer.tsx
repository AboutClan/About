import { Dayjs } from "dayjs";
import { Dispatch, useEffect, useState } from "react";
import { STUDY_VOTE_HOUR_ARR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { IModal } from "../../../types/hooks/reactTypes";
import { createTimeArr, parseTimeToDayjs } from "../../../utils/dateTimeUtils";
import RulletPickerTwo from "../../molecules/picker/RulletPickerTwo";
import BottomDrawerLg, {
  IBottomDrawerLgOptions,
} from "../../organisms/drawer/BottomDrawerLg";

interface IStudyVoteTimeRulletDrawer extends IModal {
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
  drawerOptions: IBottomDrawerLgOptions;
}

export default function StudyVoteTimeRulletDrawer({
  setVoteTime,
  drawerOptions,
  setIsModal,
}: IStudyVoteTimeRulletDrawer) {
  const leftDefaultIdx = 8;
  const rightDefaultIdx = 10;

  const startItemArr = createTimeArr(
    STUDY_VOTE_HOUR_ARR[0],
    STUDY_VOTE_HOUR_ARR[11]
  );

  const endTimeArr = createTimeArr(
    STUDY_VOTE_HOUR_ARR[3],
    STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 1]
  );

  const [rulletValue, setRulletValue] = useState<{
    left: string;
    right: string;
  }>({
    left: startItemArr[leftDefaultIdx],
    right: endTimeArr[rightDefaultIdx],
  });

  useEffect(() => {
    setVoteTime({
      start: parseTimeToDayjs(rulletValue.left),
      end: parseTimeToDayjs(rulletValue.right),
    });
  }, [rulletValue]);

  return (
    <>
      <BottomDrawerLg options={drawerOptions} setIsModal={setIsModal}>
        <RulletPickerTwo
          leftDefaultIdx={leftDefaultIdx}
          rightDefaultIdx={rightDefaultIdx}
          leftRulletArr={startItemArr}
          rightRulletArr={endTimeArr}
          setRulletValue={setRulletValue}
        />
      </BottomDrawerLg>
    </>
  );
}
