import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Slide from "../../../components/layouts/PageSlide";
import BetweenTextSwitcher from "../../../components/molecules/navs/BetweenTextSwitcher";
import StudyAttendCheckModal from "../../../modals/study/StudyAttendCheckModal";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";
import StudyControllerDate from "./StudyControllerDates";
import StudyControllerDays from "./StudyControllerDays";
import StudyControllerVoteButton from "./StudyControllerVoteButton";

export type VoteType =
  | "vote"
  | "voteChange"
  | "attendCheck"
  | "attendCompleted"
  | "absent"
  | "expired"
  | "attendPrivate"
  | "todayVote";

function StudyController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");

  const [selectedDate, setSelectedDate] = useState<string>();
  const [modalType, setModalType] = useState<VoteType>(null);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const selectedDateDayjs = dayjs(selectedDate);

  const onClick = (month: number) => {
    const newDate = handleChangeDate(selectedDateDayjs, "month", month);
    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  const textSwitcherProps = getTextSwitcherProps(selectedDateDayjs, onClick);

  return (
    <>
      <Slide>
        <OuterContainer className="about_calendar">
          <InnerContainer>
            {selectedDate && (
              <>
                <BetweenTextSwitcher
                  left={textSwitcherProps.left}
                  right={textSwitcherProps.right}
                />
                <ContentContainer>
                  <StudyControllerDays selectedDate={selectedDate} />
                  <StudyControllerDate selectedDate={selectedDate} />
                </ContentContainer>
                <Box
                  borderRadius="50%"
                  pos="absolute"
                  zIndex="5"
                  bottom="0"
                  left="50%"
                  transform="translate(-50%,50%)"
                  _after={{
                    content: `""`,
                    position: "absolute",
                    zIndex: "3",
                    backgroundColor: "white",
                    border: "var(--border)",
                    borderBottom: "none",
                    top: "0px",
                    left: "0",
                    width: "100%",
                    height: "50%",
                    borderRadius: "100px 100px 0 0",
                  }}
                >
                  <StudyControllerVoteButton setModalType={setModalType} />
                </Box>
              </>
            )}
          </InnerContainer>
        </OuterContainer>
      </Slide>

      {modalType === "attendCheck" && (
        <StudyAttendCheckModal setIsModal={() => setModalType(null)} />
      )}
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

export const getDateArr = (selectedDateDayjs: Dayjs) => {
  const temp = [];
  for (let i = -3; i <= 3; i++) {
    const dateDayjs = selectedDateDayjs.add(i, "day");
    temp.push({ day: dayjsToFormat(dateDayjs, "ddd"), date: dateDayjs.date() });
  }

  return temp;
};

// Styled component for the outer container
const OuterContainer = styled.div`
  margin: 0 16px; /* mx-4 */
  margin-top: 16px; /* mt-4 */
  background-color: white;
  height: 192px; /* h-48 */
  border-radius: var(--rounded-lg); /* rounded-lg */
  box-shadow: var(--shadow); /* shadow */
  border-bottom: var(--border); /* border-b-1.5 border-gray-7 */
  position: relative;
  border: 1px solid var(--gray-6);
`;

// Styled component for the inner container with the border
const InnerContainer = styled.div`
  border-bottom: var(--border); /* border-b-1.5 border-gray-7 */
  position: relative;
  height: 134px;
`;

// You might need to adjust the margin-top value or make it dynamic/adjustable via props
const ContentContainer = styled.div`
  margin-top: 32px; /* mt-9 */
`;
export default StudyController;
