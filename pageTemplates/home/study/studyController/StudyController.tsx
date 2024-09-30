import { Box, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import ColorLabelRow from "../../../../components/molecules/rows/ColorLabelRow";

import WeekSlideCalendar from "../../../../components/molecules/WeekSlideCalendar";
import { getStudyVoteCnt } from "../../../../libs/study/getStudyVoteCnt";
import DateCalendarModal from "../../../../modals/aboutHeader/DateCalendarModal";
import StudyAttendCheckModal from "../../../../modals/study/StudyAttendCheckModal";
import StudySimpleVoteModal from "../../../../modals/study/StudySimpleVoteModal";
import { studyDateStatusState } from "../../../../recoils/studyRecoils";
import { IParticipation } from "../../../../types/models/studyTypes/studyDetails";
import { VoteCntProps } from "../../../../types/models/studyTypes/studyRecords";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";
import StudyControllerVoteButton from "./StudyControllerVoteButton";

export type VoteType =
  | "vote"
  | "voteChange"
  | "attendCheck"
  | "attendCompleted"
  | "absent"
  | "expired"
  | "attendPrivate"
  | "todayVote"
  | "monthCalendar";

dayjs.locale("ko");

interface StudyControllerProps {
  studyVoteData: IParticipation[];
  voteCntArr: VoteCntProps[];
  selectedDate: string;

  handleChangeDate: (date: string) => void;
}

function StudyController({
  studyVoteData,
  voteCntArr,
  selectedDate,
  handleChangeDate,
}: StudyControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");

  const [modalType, setModalType] = useState<VoteType>(null);

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
          <Flex justify="space-between" align="center" mb="16px" mr="12px">
            <Box fontSize="16px" fontWeight={600}>
              날짜 선택
            </Box>

            <ColorLabelRow
              props={[
                { text: "오픈 확정", color: "mint" },
                { text: "오픈 예정", color: "gray" },
              ]}
            />
          </Flex>
          <Box>
            {selectedDate && (
              <>
                <Flex align="center">
                  <Flex pr="4px" flex={1} minW="48px" justify="center" pb={3}>
                    <MonthButton
                      onClick={() => setModalType("monthCalendar")}
                      className="about_calendar_month"
                    >
                      <span>{selectedDateDayjs.month() + 1}월</span>
                      <i className="fa-regular fa-chevron-down fa-xs" />
                    </MonthButton>
                  </Flex>
                  <Flex flex={0.6} h="32px" justify="center" pb={3}>
                    <Box h="100%" bg="var(--gray-300)" w="1px" />
                  </Flex>
                  <WeekSlideCalendar
                    voteCntArr={voteCntArr}
                    selectedDate={selectedDateDayjs}
                    func={handleSelectDate}
                  />
                </Flex>
                <StudyControllerVoteButton
                  memberCnt={getStudyVoteCnt(studyVoteData)}
                  setModalType={setModalType}
                />
              </>
            )}
          </Box>
        </OuterContainer>
      </>
      {modalType === "attendCheck" && (
        <StudyAttendCheckModal setIsModal={() => setModalType(null)} />
      )}
      {modalType === "monthCalendar" && (
        <DateCalendarModal selectedDate={selectedDateDayjs} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "todayVote" && (
        <StudySimpleVoteModal studyVoteData={studyVoteData} setIsModal={() => setModalType(null)} />
      )}
    </>
  );
}

const MonthButton = styled.button`
  width: 44px;

  text-align: start;
  padding: 8px 0px;
  font-size: 16px;
  > span {
    margin-right: 8px;
  }
`;

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
  padding-bottom: 0px;
  position: relative;
`;

export default StudyController;
