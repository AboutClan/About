import dayjs from "dayjs";
import styled from "styled-components";

import { dayjsToFormat } from "../../../utils/dateTimeUtils";

export const PICKER_DATE_AND_TIME = {
  timeFormat: "HH:mm",
  timeIntervals: 30,
  timeCaption: "시간",
  dateFormat: "M월 d일 p",
  onFocus: (e) => e.target.blur(),
  showTimeSelect: true,
};

export function PickerDateAndTimeHeader({ date, decreaseMonth, increaseMonth }) {
  return (
    <CalendarCustomHeader>
      <button onClick={decreaseMonth}>
        <LeftIcon />
      </button>
      <span>{dayjsToFormat(dayjs(date), "M월 D일")}</span>
      <button onClick={increaseMonth}>
        <RightIcon />
      </button>
    </CalendarCustomHeader>
  );
}
const CalendarCustomHeader = styled.div`
  margin: 0 4px;
  margin-top: 4px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--gap-1);
`;

const LeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="var(--gray-800)"
  >
    <path d="M526-314 381-459q-5-5-7-10t-2-11q0-6 2-11t7-10l145-145q3-3 6.5-4.5t7.5-1.5q8 0 14 5.5t6 14.5v304q0 9-6 14.5t-14 5.5q-2 0-14-6Z" />
  </svg>
);

const RightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="28px"
    viewBox="0 -960 960 960"
    width="28px"
    fill="var(--gray-800)"
  >
    <path d="M420-308q-8 0-14-5.5t-6-14.5v-304q0-9 6-14.5t14-5.5q2 0 14 6l145 145q5 5 7 10t2 11q0 6-2 11t-7 10L434-314q-3 3-6.5 4.5T420-308Z" />
  </svg>
);
