import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MONTH_LIST } from "../../../constants/util/util";
import { useErrorToast } from "../../../hooks/custom/CustomToast";
import { useUserAttendRateQueries } from "../../../hooks/user/sub/studyRecord/queries";
import { IVoteRate } from "../../../types/models/studyTypes/studyRecords";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { getMonth } from "../../../utils/dateTimeUtils";
import { ChartStudyOptions } from "./ChartOptions";

interface IChart {
  type: "study";
  user?: IUser;
}

function Chart({ type, user }: IChart) {
  const { data: session } = useSession();
  const errorToast = useErrorToast();
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

  const [attendRateArr, setAttendRateArr] = useState([]);
  const [attendAverageArr, setAttendAverageArr] = useState([]);
  const [attendMax, setAttendMax] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const Uid = user?.uid || session?.user?.uid;

  const monthXaxis: string[] = [];
  for (let i = getMonth() - 2; i <= getMonth() + 1; i++) {
    const idx = i >= 0 ? i : 12 + i;
    monthXaxis.push(MONTH_LIST[idx]);
  }

  const monthArr = [
    {
      start: dayjs().subtract(2, "month").startOf("month").startOf("date"),
      end: dayjs().subtract(2, "month").endOf("month").startOf("date"),
    },
    {
      start: dayjs().subtract(1, "month").startOf("month").startOf("date"),
      end: dayjs().subtract(1, "month").endOf("month").startOf("date"),
    },
    {
      start: dayjs().startOf("month").startOf("date"),
      end: dayjs().endOf("month").startOf("date"),
    },
  ];

  const setAttendRate = (data: IVoteRate[]) => {
    let userCnt: number;
    let averageValue = 0;
    let averageCnt = 0;
    let maxCnt = 5;
    data.forEach((who) => {
      if (who.uid === Uid) userCnt = who.cnt;
      if (who.cnt > 0) {
        averageValue += who.cnt;
        averageCnt++;
      }
    });
    if (userCnt > maxCnt) {
      if (userCnt > 24) maxCnt = 30;
      else if (userCnt > 21) maxCnt = 24;
      else if (userCnt > 18) maxCnt = 21;
      else if (userCnt > 15) maxCnt = 18;
      else if (userCnt > 12) maxCnt = 15;
      else if (userCnt > 8) maxCnt = 12;
      else if (userCnt > 5) maxCnt = 8;
    }
    return {
      maxCnt,
      userCnt,
      average: parseFloat((averageValue / averageCnt).toFixed(1)),
    };
  };

  const { data: userAttendRateAll } = useUserAttendRateQueries(monthArr, false, {
    onError: errorToast,
  });

  useEffect(() => {
    if (!userAttendRateAll) return;
    const rateTemp = [];
    const averageTemp = [];
    let max = 5;
    userAttendRateAll.forEach((element) => {
      const { userCnt, average, maxCnt } = setAttendRate(element);
      rateTemp.push(userCnt);
      averageTemp.push(average);
      if (max < maxCnt) max = maxCnt;
    });

    setAttendRateArr(rateTemp.map((cnt) => cnt || 0));
    setAttendAverageArr(averageTemp);
    setAttendMax(max);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAttendRateAll]);

  return (
    <>
      {type === "study" && !isLoading && (
        <ChartWrapper>
          <ApexCharts
            series={[
              { name: "평균 참여 횟수", data: attendAverageArr },
              { name: "유저 참여 횟수", data: attendRateArr },
            ]}
            options={ChartStudyOptions(monthXaxis, attendMax)}
          />
        </ChartWrapper>
      )}
    </>
  );
}

const ChartWrapper = styled.div`
  margin-right: var(--gap-3);
`;

export default Chart;
