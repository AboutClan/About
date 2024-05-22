import "dayjs/locale/ko";

import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import TimeRullet from "../../../components/molecules/picker/TimeRullet";
import { STUDY_START_VOTETIME_HOUR } from "../../../constants/settingValue/study/study";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IStudyVote } from "../../../types/models/studyTypes/studyInterActions";
import { IDayjsStartToEnd } from "../../../types/utils/timeAndDate";

interface IStudyVoteSubModalTime {
  setMyVote: DispatchType<IStudyVote>;
}

function StudyVoteSubModalTime({ setMyVote }: IStudyVoteSubModalTime) {
  const [selectTime, setSelectTime] = useState<IDayjsStartToEnd>({
    start: null,
    end: null,
  });

  useEffect(() => {
    const start = selectTime?.start;
    const end = selectTime?.end;
    setMyVote((old) => ({ ...old, start, end }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectTime]);

  const createTimeArr = (startHour: number, endHour: number, offset = 0) => {
    const timeArr = [];
    for (let i = startHour; i <= endHour; i++) {
      timeArr.push({ hour: i + offset, minutes: "00" });
      if (i !== endHour) timeArr.push({ hour: i + offset, minutes: "30" });
    }
    return timeArr;
  };

  const startTimeArr = createTimeArr(STUDY_START_VOTETIME_HOUR, STUDY_START_VOTETIME_HOUR + 10);
  const endTimeArr = createTimeArr(STUDY_START_VOTETIME_HOUR, STUDY_START_VOTETIME_HOUR + 10, 2);

  return (
    <Layout>
      <TimeChoiceLayout>
        <TimeWrapper>
          <span>시작 시간</span>
          <TimeRullet
            timeArr={startTimeArr}
            setTime={(time: Dayjs) => setSelectTime((old) => ({ ...old, start: time }))}
          />
        </TimeWrapper>
        <Spacer />
        <TimeWrapper>
          <span>종료 시간</span>
          <TimeRullet
            startTime={selectTime?.start}
            startTimeArr={startTimeArr}
            timeArr={endTimeArr}
            setTime={(time) => setSelectTime((old) => ({ ...old, end: time }))}
            isEndTime={true}
          />
        </TimeWrapper>
      </TimeChoiceLayout>{" "}
    </Layout>
  );
}

const Layout = styled.div`
  width: 100%;
`;

const TimeChoiceLayout = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const TimeWrapper = styled.div`
  flex: 1;

  > span {
    font-weight: 600;

    font-size: 13px;
  }
`;

const Spacer = styled.div`
  width: var(--gap-4);
`;

export default StudyVoteSubModalTime;
