import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import RecordMonthNav from "../../components/atoms/MonthNav";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import RecordDetail from "../../pageTemplates/record/detail/RecordDetail";
import RecordCalendar from "../../pageTemplates/record/RecordCalendar";
import RecordCalendarSetting from "../../pageTemplates/record/RecordCalendarSetting";
import RecordLocationCategory from "../../pageTemplates/record/RecordLocationCategory";
import RecordNavigation from "../../pageTemplates/record/RecordNavigation";
import RecordOverview from "../../pageTemplates/record/RecordOverview";
import { IArrivedData } from "../../types/models/studyTypes/studyRecords";

export interface IDateRange {
  startDate: Dayjs;
  endDate: Dayjs;
}

export interface INavMonth {
  year: number;
  month: number;
}

function Record() {
  //매달 1일을 기준으로 함
  const [navMonth, setNavMonth] = useState(dayjs().startOf("month"));
  const [arrivedCalendar, setArrivedCalendar] = useState<IArrivedData[]>();
  const [filterData, setFilterData] = useState<IArrivedData[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalendar, setIsCalendar] = useState(true);

  useEffect(() => {
    if (!arrivedCalendar) return;
    setFilterData(arrivedCalendar);
    setIsLoading(false);
  }, [arrivedCalendar]);

  return (
    <>
      <Header title="스터디 기록" />
      <Slide>
        <RecordCalendarSetting
          navMonth={navMonth}
          setArrivedCalendar={setArrivedCalendar}
          setIsRecordLoading={setIsLoading}
        />
        <Box mx="16px" ml="8px" mt="12px">
          <RecordMonthNav monthNum={navMonth.month()} changeMonth={setNavMonth} />
        </Box>
        {!isLoading ? (
          <>
            <RecordOverview arrivedCalendar={arrivedCalendar} />
            <RecordLocationCategory initialData={arrivedCalendar} setFilterData={setFilterData} />
            {isCalendar ? (
              <RecordCalendar filterData={filterData} monthFirstDate={navMonth} />
            ) : (
              <RecordDetail filterData={filterData} navMonth={navMonth} />
            )}
          </>
        ) : (
          <MainLoading />
        )}
      </Slide>
      <RecordNavigation isCalendar={isCalendar} setIsCalendar={setIsCalendar} />
    </>
  );
}

export default Record;
