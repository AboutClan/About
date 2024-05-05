import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { useUserAttendRateQueries } from "../../../hooks/user/sub/studyRecord/queries";
import { DispatchBoolean } from "../../../types/hooks/reactTypes";
import { IDayjsStartToEnd } from "../../../types/utils/timeAndDate";
import { getWeekNumber } from "../../../utils/dateTimeUtils";

const WEEKS_CNT = 4;

interface IRecordAnalysisSummary {
  setIsLoading: DispatchBoolean;
}

function RecordAnalysisSummary({ setIsLoading }: IRecordAnalysisSummary) {
  const [weeksDate, setWeeksDate] = useState<IDayjsStartToEnd[]>([]);

  const [myAttend, setMyAttend] = useState([]);

  useEffect(() => {
    const weeksArr = [];
    for (let i = 0; i < WEEKS_CNT; i++) {
      weeksArr.push({
        start: dayjs().subtract(i, "week").day(0).startOf("date"),
        end: dayjs().subtract(i, "week").day(6).startOf("date"),
      });
    }
    if (weeksArr?.length === WEEKS_CNT) setWeeksDate(weeksArr);
  }, []);

  const { data } = useUserAttendRateQueries(weeksDate, true, {
    enabled: weeksDate.length !== 0,
  });

  useEffect(() => {
    if (data && weeksDate.length) {
      setMyAttend(data);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, weeksDate]);

  return (
    <Box bgColor="white" m="16px" mb="8px" rounded="lg" p="8px 16px" border="var(--border-mint)">
      {myAttend?.map((item, idx) => {
        const date = weeksDate[idx];
        return (
          <SummaryItem key={idx}>
            <WeekText>
              <span>
                {date.start.format("M월")} {getWeekNumber(date.start)}주
              </span>
              <span>
                ({date.start.format("MM.DD")} - {date.end.format("MM.DD")})
              </span>
            </WeekText>
            <WeekAttend>{item || 0}회</WeekAttend>
          </SummaryItem>
        );
      })}
    </Box>
  );
}

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px;
`;

const WeekText = styled.span`
  > span:last-child {
    margin-left: var(--gap-1);
    color: var(--gray-3);
  }
`;

const WeekAttend = styled.span`
  font-weight: 600;
`;

export default RecordAnalysisSummary;
