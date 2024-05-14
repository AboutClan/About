import "dayjs/locale/ko";

import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetRecoilState } from "recoil";

import { Flex } from "@chakra-ui/react";
import DatePointButton from "../../../components/molecules/DatePointButton";
import { studyDateStatusState } from "../../../recoils/studyRecoils";
import { getCalendarDates } from "../../../utils/dateTimeUtils";
import { handleChangeDate } from "./StudyController";

dayjs.locale("ko");

interface IStudyControllerDates {
  selectedDateDayjs: Dayjs;
}

function StudyControllerDates({ selectedDateDayjs }: IStudyControllerDates) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const setStudyDateStatus = useSetRecoilState(studyDateStatusState);

  const dateArr = getCalendarDates("week", selectedDateDayjs);

  const onClick = (date: number) => {
    setStudyDateStatus(undefined);
    const newDate = handleChangeDate(selectedDateDayjs, "date", date);

    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <Flex h="60px" justify="space-between">
      {dateArr.map((date) => (
        <DatePointButton
          date={date}
          func={() => onClick(date)}
          isSelected={date === selectedDateDayjs.date()}
        />
      ))}
    </Flex>
  );
}

export default StudyControllerDates;
