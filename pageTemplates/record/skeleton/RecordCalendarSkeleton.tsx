import dayjs from "dayjs";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

interface IRecordCalendarSkeleton {
  month: number;
}

function RecordCalendarSkeleton({ month }: IRecordCalendarSkeleton) {
  const blankDate = Array.from(
    {
      length: dayjs().month(month).date(1).day(),
    },
    (_, i) => i + 1,
  );

  const totalDate = Array.from(
    {
      length: dayjs().month(month).daysInMonth(),
    },
    (_, i) => i + 1,
  );

  return (
    <Layout>
      <DayOfWeek />
      <CallenderDays>
        {blankDate?.map((item) => <DayItem key={item + "temp"}></DayItem>)}
        {totalDate?.map((item) => {
          return (
            <DayItem key={item}>
              <Today>{item}</Today>
              <OpenStatus>
                <Skeleton>temp</Skeleton>
              </OpenStatus>
            </DayItem>
          );
        })}
      </CallenderDays>
    </Layout>
  );
}
function DayOfWeek() {
  return (
    <DayLine>
      <span>일</span>
      <span>월</span>
      <span>화</span>
      <span>수</span>
      <span>목</span>
      <span>금</span>
      <span>토</span>
    </DayLine>
  );
}
const Layout = styled.div``;
const DayLine = styled.div`
  margin: 8px 22px;
  display: flex;
  justify-content: space-between;
  color: var(--gray-600);
  font-size: 12px;
  padding: 2px;
  padding-top: var(--gap-3);
  margin-bottom: var(--gap-3);
`;

const CallenderDays = styled.div`
  margin: 0px var(--gap-1);
  font-size: 14px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 56px;
`;
const DayItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 28px;
`;

const Today = styled.div`
  font-size: 15px;
`;

const OpenStatus = styled.div`
  font-size: 10px;
`;

export default RecordCalendarSkeleton;
