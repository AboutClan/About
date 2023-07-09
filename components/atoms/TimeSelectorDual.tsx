import { Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import styled from "styled-components";
import { TIME_SELECTOR_MINUTES } from "../../constants/study";
import { ITime } from "../../types/utils";

interface ITimeSelectorDual {
  time: ITime;
  setTime: ({ hours, minutes }) => void;
  timeArr: number[];
}

function TimeSelectorDual({ time, setTime, timeArr }: ITimeSelectorDual) {
  const changeHour = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.currentTarget.value);

    setTime({ hours: value, minutes: time.minutes });
  };

  const changeMinute = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.currentTarget.value);
    setTime({ hours: time.hours, minutes: value });
  };
  return (
    <Layout>
      <Select
        mr="var(--margin-md)"
        name="hour"
        value={time.hours}
        placeholder="시간"
        onChange={changeHour}
      >
        {timeArr.map((h) => (
          <Option key={h} value={h}>
            {h}
          </Option>
        ))}
      </Select>
      :
      <Select
        ml="var(--margin-md)"
        name="minute"
        defaultValue={String(time.minutes).padStart(2, "0")}
        placeholder="분"
        onChange={changeMinute}
      >
        {TIME_SELECTOR_MINUTES.map((m) => (
          <Option key={m} value={m}>
            {m}
          </Option>
        ))}
      </Select>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  align-items: center;
`;

const Option = styled.option``;

export default TimeSelectorDual;
