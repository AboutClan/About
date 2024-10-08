import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

import HighlightedTextButton from "../../../components/atoms/buttons/HighlightedTextButton";
import SectionBar from "../../../components/molecules/bars/SectionBar";
import { ChartStudyOptions } from "../../../components/organisms/chart/ChartOptions";
import { VoteCntProps } from "../../../types/models/studyTypes/studyRecords";

interface HomeStudyChartProps {
  voteCntArr: VoteCntProps[];
}

function HomeStudyChart({ voteCntArr }: HomeStudyChartProps) {
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

  const filtered: VoteCntProps[] = voteCntArr?.reduce((acc, cur) => {
    if (
      dayjs(cur.date).isAfter(dayjs().subtract(4, "days")) &&
      dayjs(cur.date).isBefore(dayjs().add(1, "days"))
    ) {
      return [...acc, cur];
    }
    return acc;
  }, []);

  const totalArr = [];
  const locationArr = [];
  const xArr = [];
  filtered?.forEach((obj) => {
    totalArr.push(obj.totalValue);
    locationArr.push(obj.value);
    xArr.push(dayjs(obj.date).date() + "");
  });

  return (
    <>
      <SectionBar
        title="스터디 전체 통계"
        rightComponent={<HighlightedTextButton text="더보기" url="/studyCalendar" />}
      />
      <Box pt="16px" pr="16px">
        <ApexCharts
          series={[
            { name: "전체 지역 참여자", data: totalArr },
            { name: "우리 지역 참여자", data: locationArr },
          ]}
          options={ChartStudyOptions(xArr, Math.max(...totalArr))}
        />
      </Box>
    </>
  );
}

export default HomeStudyChart;
