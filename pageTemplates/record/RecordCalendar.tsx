/* eslint-disable */

import { Box } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import styled from "styled-components";

import Calendar from "../../components/organisms/Calendar";
import { CalendarContentProps } from "../../constants/contents/calendarSchedule";
import { LOCATION_OPEN_DATE, LOCATION_TO_COLOR } from "../../constants/location";
import { PLACE_TO_LOCATION } from "../../constants/serviceConstants/studyConstants/studyLocationConstants";
import { IArrivedData } from "../../types/models/studyTypes/studyRecords";
import { Location } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

interface IRecordCalendar {
  filterData: IArrivedData[];
  monthFirstDate: Dayjs;
}
function RecordCalendar({ filterData, monthFirstDate }: IRecordCalendar) {
  const calendarContents: CalendarContentProps[] = filterData.flatMap((data) => {
    const arrivedInfo = data?.arrivedInfoList;
    const date = data?.date;
    const dayjsDate = date && dayjsToStr(monthFirstDate.date(date));
    let openLocation = null;
    for (const key in LOCATION_OPEN_DATE) {
      if (LOCATION_OPEN_DATE[key] === dayjsDate) openLocation = key;
    }
    const openStudyLocation: Set<{
      location: string;
      cnt: number;
    }> = new Set();
    arrivedInfo?.forEach((place) => {
      openStudyLocation.add({
        location: PLACE_TO_LOCATION[place.placeId],
        cnt: place.arrivedInfo.length,
      });
    });

    let tempCnt = 0;
  
    const resData = Array.from(openStudyLocation)
      .map((location, idx) => {
        if (idx > 2 || location.cnt < 2) return null;
        tempCnt++;

        return {
          content: "스터디",
          start: date,
          end: date,
          color: LOCATION_TO_COLOR[location.location],
          blockIdx: tempCnt - 1,
        };
      })
      .filter((place) => place !== null);
    return resData;
    // {
    //   Array.from(openStudyLocation).map((location, idx) => {
    //     if (idx > 2 || location.cnt < 2) return null;
    //     tempCnt++;
    //     return (
    //       <Open key={idx} location={location.location as Location}>
    //         {tempCnt < 4 || openStudyLocation.size <= 3 ? (
    //           "스터디 오픈"
    //         ) : (
    //           <i className="fa-regular fa-ellipsis-stroke fa-xl" />
    //         )}
    //       </Open>
    //     );
    //   });
    // }
  });
 
  return (
    <Box mt={3} borderRadius={1}>
      <Calendar
        monthFirstDate={monthFirstDate.startOf("month")}
        calendarContents={calendarContents}
      />
    </Box>
    // <Layout>
    //   <DayOfWeek />
    //   <CallenderDays>
    //     {filterData?.map((data, idx) => {
    //
    //       return (
    //         <DayItem key={idx}>
    //           {!openLocation ? (
    //             <DayItemDate isToday={date === dayjs().date()}>{date}</DayItemDate>
    //           ) : (
    //             <LocationOpen location={openLocation}>{date}</LocationOpen>
    //           )}
    //           {Array.from(openStudyLocation).map((location, idx) => {
    //             if (idx > 2 || location.cnt < 2) return null;
    //             tempCnt++;
    //             return (
    //               <Open key={idx} location={location.location as Location}>
    //                 {tempCnt < 4 || openStudyLocation.size <= 3 ? (
    //                   "스터디 오픈"
    //                 ) : (
    //                   <i className="fa-regular fa-ellipsis-stroke fa-xl" />
    //                 )}
    //               </Open>
    //             );
    //           })}
    //         </DayItem>
    //       );
    //     })}
    //   </CallenderDays>
    // </Layout>
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

const CallenderDays = styled.div`
  display: grid;
  grid-auto-rows: 72px;
  grid-template-columns: repeat(7, 1fr);
  margin: 0 var(--gap-1);
  font-size: 14px;
`;
const DayItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--gray-200);
`;

const DayItemDate = styled.span<{ isToday: boolean }>`
  color: ${(props) => (props.isToday ? "var(--color-mint)" : null)};
  font-weight: ${(props) => (props.isToday ? "600" : null)};
  font-size: ${(props) => (props.isToday ? "15px" : null)};
`;

const LocationOpen = styled.div<{ location: Location }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(props) => `2px solid ${LOCATION_TO_COLOR[props.location]}`};
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const Open = styled.div<{ location: Location }>`
  font-size: 10px;
  color: ${(props) => LOCATION_TO_COLOR[props.location]};
`;

const DayLine = styled.div`
  margin: var(--gap-2) 24px;
  display: flex;
  justify-content: space-between;
  color: var(--gray-600);
  font-size: 12px;
`;

export default RecordCalendar;
