import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

import { ALL_스터디인증 } from "../../constants/serviceConstants/studyConstants/studyPlaceConstants";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useStudyAttendRecordQuery } from "../../hooks/study/queries";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { IArrivedData } from "../../types/models/studyTypes/studyRecords";

interface IRecordSetting {
  navMonth: Dayjs;
  setArrivedCalendar: DispatchType<IArrivedData[]>;
  setIsRecordLoading: DispatchBoolean;
}

function RecordCalendarSetting({
  navMonth,
  setArrivedCalendar,
  setIsRecordLoading,
}: IRecordSetting) {
  const errorToast = useErrorToast();

  const { data: studyRecords, isLoading } = useStudyAttendRecordQuery(
    navMonth,
    navMonth.endOf("month"),
    {
      onError: errorToast,
    },
  );

  useEffect(() => {
    setIsRecordLoading(true);
    if (isLoading) return;
    const daysInMonth = navMonth.daysInMonth();
    const frontBlankDate = navMonth.day();
    const totalDate = daysInMonth + frontBlankDate;
    const rowsInMonth = totalDate <= 35 ? 5 : 6;

    const filledDates: IArrivedData[] = Array.from({ length: 7 * rowsInMonth }, (_, idx) =>
      idx < frontBlankDate || idx >= totalDate
        ? null
        : { date: idx - frontBlankDate + 1, arrivedInfoList: [] },
    );

    studyRecords
      .map((study) => ({
        arrivedInfoList: study.arrivedInfoList.filter((item) => item.placeId !== ALL_스터디인증),
        date: study.date,
      }))
      .forEach((item) => {
        const filledIdx = dayjs(item.date).date() + frontBlankDate - 1;
        const data = filledDates[filledIdx];
        if (data) data.arrivedInfoList = item.arrivedInfoList;
      });
    setArrivedCalendar(filledDates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, navMonth, studyRecords]);

  return null;
}

export default RecordCalendarSetting;
