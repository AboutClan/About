import { useEffect, useState } from "react";

import { ITime } from "../../types/utils/timeAndDate";
import Select from "./Select";

interface ITimeSelectorUnit {
  time: ITime;
  setTime: (time: { hours: number; minutes: number }) => void;
  timeArr: string[];
}

function TimeSelectorUnit({ time, setTime, timeArr }: ITimeSelectorUnit) {
  const hourStr = String(time.hours);
  const minuteStr = time.minutes ? String(time.minutes) : String(time.minutes) + "0";

  const [text, setText] = useState(`${hourStr}:${minuteStr}`);

  useEffect(() => {
    setText(`${hourStr}:${minuteStr}`);
  }, [time]);

  useEffect(() => {
    const hours = Number(text.slice(0, 2));
    const minutes = Number(text.slice(3));
    setTime({ hours, minutes });
  }, [text]);

  return <Select defaultValue={text} options={timeArr} size="md" setValue={setText} />;
}

export default TimeSelectorUnit;
