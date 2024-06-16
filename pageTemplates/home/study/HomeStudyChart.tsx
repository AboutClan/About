import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import HighlightedTextButton from "../../../components/atoms/buttons/HighlightedTextButton";
import SectionBar from "../../../components/molecules/bars/SectionBar";
import { ChartStudyOptions } from "../../../components/organisms/chart/ChartOptions";

function HomeStudyChart() {
  const router = useRouter();
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
  return (
    <>
      <SectionBar
        title="스터디 전체 통계"
        rightComponent={
          <HighlightedTextButton text="더보기" onClick={() => router.push("/calendar")} />
        }
      />
      <Box pt="16px" pr="16px">
        <ApexCharts
          series={[
            { name: "전체 지역", data: [1, 2, 3, 4] },
            { name: "우리 지역", data: [5, 6, 7, 8] },
          ]}
          options={ChartStudyOptions(["10", "11", "12", "13"], 14)}
        />
      </Box>
    </>
  );
}

export default HomeStudyChart;
