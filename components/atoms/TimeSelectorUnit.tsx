import { ChangeEvent } from "react";
import styled from "styled-components";

import { ITime } from "../../types/utils/timeAndDate";

interface ITimeSelectorUnit {
  time: ITime;
  setTime: (time: { hours: number; minutes: number }) => void;
  timeArr: string[];
  disabled?: boolean;
}

function TimeSelectorUnit({ time, setTime, timeArr, disabled }: ITimeSelectorUnit) {
  const hourStr = String(time.hours);
  const minuteStr = time.minutes ? String(time.minutes) : String(time.minutes) + "0";

  const onChangeTime = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    const hours = Number(value.slice(0, 2));
    const minutes = Number(value.slice(3));
    setTime({ hours, minutes });
  };

  return (
    <Layout>
      <Select
        name="hour"
        value={`${hourStr}:${minuteStr}`}
        onChange={onChangeTime}
        disabled={disabled}
      >
        {timeArr.map((timeValue) => (
          <Option key={timeValue} value={timeValue}>
            {timeValue}
          </Option>
        ))}
      </Select>
    </Layout>
  );
}

const Select = styled.select`
  font-weight: 600;
  color: var(--gray-800);
`;

const Layout = styled.div`
  display: flex;
  align-items: center;

  > select {
    color: var(--gray-200);
    width: 68px;
    height: 36px;
    padding-left: 6px;
    margin-right: 6px;
    margin-left: 6px;
    border: 1.5px solid var(--gray-400);
    border-radius: var(--rounded-lg);
    font-size: 12px;

    :focus {
      outline: none;
      border: 1 5px solid var(--gray-200);
    }
  }
`;

const Option = styled.option``;

export default TimeSelectorUnit;
