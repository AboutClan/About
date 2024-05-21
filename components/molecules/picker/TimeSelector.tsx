import styled from "styled-components";

import { TIME_SELECTOR_END, TIME_SELECTOR_START } from "../../../constants/util/util";
import { ITimeSelector } from "../../../types/utils/timeAndDate";
import TimeSelectorDual from "../../atoms/TimeSelectorDual";

function TimeSelector({ times, setTimes }: ITimeSelector) {
  const onChangeTimeStart = (startTime) => {
    setTimes({ start: startTime, end: null });
  };
  const onChangeTimeEnd = (endTime) => {
    setTimes({ start: null, end: endTime });
  };

  return (
    <>
      <Layout>
        <Container>
          <Name>시작 시간: </Name>
          <TimeSelectorDual
            time={times.start}
            setTime={onChangeTimeStart}
            timeArr={TIME_SELECTOR_START}
          />
        </Container>
        <Container>
          <Name>종료 시간: </Name>
          <TimeSelectorDual
            time={times.end}
            setTime={onChangeTimeEnd}
            timeArr={TIME_SELECTOR_END}
          />
        </Container>
      </Layout>
    </>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Layout = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > div:first-child {
    margin-bottom: var(--gap-3);
  }
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-200);
  display: inline-block;
  margin-right: var(--gap-3);
`;

export default TimeSelector;
