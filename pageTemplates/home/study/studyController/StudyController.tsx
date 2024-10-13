import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import WeekSlideCalendar from "../../../../components/molecules/WeekSlideCalendar";
import { studyDateStatusState } from "../../../../recoils/studyRecoils";
import { StudyParticipationProps } from "../../../../types/models/studyTypes/studyDetails";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";

interface StudyControllerProps {
  studyVoteData: StudyParticipationProps[];
  // voteCntArr: VoteCntProps[];
  selectedDate: string;

  handleChangeDate: (date: string) => void;
}

function StudyController({ selectedDate, handleChangeDate }: StudyControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");

  const setStudyDateStatus = useSetRecoilState(studyDateStatusState);

  const selectedDateDayjs = dayjs(selectedDate);

  const handleSelectDate = (moveDate: string) => {
    if (date === moveDate) return;
    setStudyDateStatus(undefined);
    handleChangeDate(moveDate);
    newSearchParams.set("date", moveDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <>
      <>
        <OuterContainer>
          <Box>
            {selectedDate && (
              <>
                <WeekSlideCalendar
                  // voteCntArr={voteCntArr}
                 date={selectedDateDayjs}
                  func={handleSelectDate}
                />
              </>
            )}
          </Box>
        </OuterContainer>
      </>
    </>
  );
}

export const getTextSwitcherProps = (
  selectedDateDayjs: Dayjs,
  onClick: (month: number) => void,
) => {
  const leftMonth = selectedDateDayjs.subtract(1, "month").month() + 1;
  const rightMonth = selectedDateDayjs.add(1, "month").month() + 1;

  const textSwitcherProps = {
    left: {
      text: `${leftMonth}월`,
      func: () => onClick(leftMonth),
    },
    right: {
      text: `${rightMonth}월`,
      func: () => onClick(rightMonth),
    },
  };
  return textSwitcherProps;
};

export const handleChangeDate = (
  selectedDateDayjs: Dayjs,
  type: "month" | "date",
  num: number,
): string => {
  let year = selectedDateDayjs.year();
  let month = selectedDateDayjs.month() + 1;
  let date = selectedDateDayjs.date();

  if (type === "month") {
    if (month === num) date = dayjs().date();
    year += handleYearMoveByMonth(num);
    month = num;
  } else {
    month += handleMonthMoveByDate(num, selectedDateDayjs.date());
    date = num;
  }

  const newDate = dayjsToStr(
    dayjs()
      .year(year)
      .month(month - 1)
      .date(date),
  );
  return newDate;
};

const handleYearMoveByMonth = (month: number) => {
  const currentMonth = dayjs().month() + 1;
  if (currentMonth === 1 && month === 12) return -1;
  else if (currentMonth === 12 && month === 1) return 1;
  return 0;
};

const handleMonthMoveByDate = (date: number, currentDate: number) => {
  if (currentDate < 10 && date > 20) return -1;
  else if (currentDate > 20 && date < 10) return 1;
  return 0;
};

const OuterContainer = styled.div`
  background-color: white;
  border-radius: var(--rounded-lg);
  border: var(--border);
  margin-top: 16px;
  padding: 16px;

  padding-right: 8px;
  padding-top: 12px;
  padding-bottom: 16px;
  position: relative;
`;

export default StudyController;
