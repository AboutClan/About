import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

import { ALL_스터디인증 } from "@/constants/serviceConstants/studyConstants/studyPlaceConstants";
import { useStudyAttendRecordQuery } from "@/features/study/hooks/queries";
import { useErrorToast } from "@/hooks/custom/CustomToast";
import { DispatchBoolean, DispatchType } from "@/types/hooks/reactTypes";
import { IArrivedData } from "@/types/models/studyTypes/studyRecords";

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

    // studyRecords가 undefined일 수 있다 — `GET /vote/arrived`는 백엔드에 컨트롤러가 없어
    // 요청이 실패하고, react-query는 그때 isLoading을 내리고 data를 비운 채로 둔다.
    // 방어가 없으면 여기서 TypeError가 나 캘린더 화면이 깨졌다.
    (studyRecords ?? [])
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
