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
        <i className="fa-solid fa-chevron-left" />
      </button>
      <span>{dayjsToFormat(dayjs(date), "M월 D일")}</span>
      <button onClick={increaseMonth}>
        <i className="fa-solid fa-chevron-right" />
      </button>
    </CalendarCustomHeader>
  );
}
const CalendarCustomHeader = styled.div`
  margin: 10px;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--gap-1);
`;
