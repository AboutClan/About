import { faChevronLeft, faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <span>{dayjsToFormat(dayjs(date), "M월 D일")}</span>
      <button onClick={increaseMonth}>
        <FontAwesomeIcon icon={faChevronRight} />
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
