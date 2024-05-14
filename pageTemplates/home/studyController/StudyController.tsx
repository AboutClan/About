import { Box, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import Slide from "../../../components/layouts/PageSlide";
import Calendar from "../../../components/molecules/Calendar";
import DateCalendarModal from "../../../modals/aboutHeader/DateCalendarModal";
import StudyAttendCheckModal from "../../../modals/study/StudyAttendCheckModal";
import { studyDateStatusState } from "../../../recoils/studyRecoils";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
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

dayjs.locale("ko");

function StudyController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");

  const [selectedDate, setSelectedDate] = useState<string>();
  const [modalType, setModalType] = useState<VoteType>(null);

  const setStudyDateStatus = useSetRecoilState(studyDateStatusState);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const selectedDateDayjs = dayjs(selectedDate);

  const onClick = (date: number) => {
    setStudyDateStatus(undefined);
    const newDate = handleChangeDate(selectedDateDayjs, "date", date);
    newSearchParams.set("date", newDate);
    router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <>
      <Slide>
        <OuterContainer className="about_calendar">
          <ControllerHeader selectedDateDayjs={selectedDateDayjs} setModalType={setModalType} />
          <InnerContainer>
            {selectedDate && (
              <>
                <Box px="20px" borderBottom="var(--border)">
                  <Calendar type="week" selectedDate={selectedDateDayjs} func={onClick} />
                </Box>
                <StudyControllerVoteButton setModalType={setModalType} />
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

interface ControllerHeaderProps {
  selectedDateDayjs: Dayjs;
  setModalType: Dispatch<VoteType>;
}

const ControllerHeader = ({ selectedDateDayjs, setModalType }: ControllerHeaderProps) => {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <Flex p="0 20px" justify="space-between" h="58px" alignItems="center">
        <Box fontSize="20px" fontWeight={600}>
          {selectedDateDayjs.month() + 1}월
        </Box>
        <Box onClick={() => setIsModal(true)}>버튼</Box>
      </Flex>
      {isModal && (
        <DateCalendarModal
          setIsModal={setIsModal}
          setModalType={setModalType}
          selectedDate={selectedDateDayjs}
        />
      )}
    </>
  );
};

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

  border-radius: 12px;

  position: relative;
`;

const InnerContainer = styled.div`
  position: relative;
`;

export default StudyController;
