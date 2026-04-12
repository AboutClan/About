import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";

import { STUDY_RESULT_HOUR } from "../../../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { CalendarHeader } from "../../../../../modals/aboutHeader/DateCalendarModal";
import { dayjsToStr, getHour, getMonth } from "../../../../../utils/dateTimeUtils";
import PageIntro from "../../../../atoms/PageIntro";
import MonthCalendar from "../../../../molecules/MonthCalendar";

interface FirstPageSectionProps {
  date: Dayjs;
  changeDate: (date: Dayjs) => void;
  canChange: boolean;
  selectedDates: string[];
  beforeMyDates: string[];
  selectDates: (dates: string[]) => void;
  defaultDate: string;
}

function FirstPageSection({
  date,
  changeDate,
  canChange,
  selectedDates,
  selectDates,
  beforeMyDates,
  defaultDate,
}: FirstPageSectionProps) {

  
  useEffect(() => {
    if (!canChange) {
      const date =
        getHour() < STUDY_RESULT_HOUR ? defaultDate : dayjsToStr(dayjs(defaultDate).add(1, "day"));
      if (!beforeMyDates.includes(date) && date) {
        selectDates([date]);
      }
    } else {
      selectDates([...selectedDates, ...beforeMyDates]);
    }
  }, [defaultDate, canChange]);

  const handleClickDate = (date: string) => {
    let newDates = [...selectedDates]; // 복사

    if (newDates.includes(date)) {
      newDates = newDates.filter((d) => d !== date);
    } else {
      newDates.push(date);
    }

    selectDates(newDates);
  };

  return (
    <>
      <PageIntro
        main={{
          first: "스터디 희망 날짜를 선택해 주세요.",
        }}
        sub="여러 날짜를 한번에 선택할 수 있습니다."
      />
      <Box fontSize="20px" mb={4} pb={3} px={2} borderBottom="var(--border)">
        <CalendarHeader
          goNext={() => changeDate(date.add(1, "month"))}
          goPrev={() => changeDate(date.subtract(1, "month"))}
          leftDisabled={date.month() === getMonth()}
          rightDisabled={date.month() === getMonth() + 1}
          date={dayjsToStr(date)}
        />
      </Box>
      <MonthCalendar
        standardDate={dayjsToStr(date)}
        selectedDates={selectedDates}
        func={handleClickDate}
        passedDisabled
        mintDateArr={canChange ? [] : beforeMyDates}
      />
      <Box h={5} />
      {canChange ? (
        <>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            스터디를 취소하는 경우 선택된 날짜를 해제해 주세요.
          </Box>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            스터디 매칭은 전날 오후 9시까지만 신청 가능합니다.
          </Box>
        </>
      ) : !canChange && beforeMyDates.length ? (
        <>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            <Box as="span" color="mint">
              민트색
            </Box>{" "}
            숫자는 이미 참여중인 스터디 날짜입니다.
          </Box>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            스터디 매칭은 전날 오후 9시까지만 신청 가능합니다.
          </Box>
        </>
      ) : (
        <>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            매일 <b>오후 9시</b>에 다음날 스터디 신청이 마감됩니다.
          </Box>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            매일 <b>오전 9시</b>에 그날의 스터디 결과가 확정됩니다.
          </Box>
          <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
            최대 일주일 이내의 스터디 신청이 가능합니다.
          </Box>
        </>
      )}
    </>
  );
}

export default FirstPageSection;
