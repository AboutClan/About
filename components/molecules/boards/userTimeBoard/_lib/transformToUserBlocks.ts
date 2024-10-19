import dayjs from "dayjs";

import { ITimeBoardParticipant } from "../UserTimeBoard";

export const transformToUserBlocks = (participants: ITimeBoardParticipant[]) => {
  return participants.map((par) => {
    const start = dayjs(par.time.start);
    const end = dayjs(par.time.end);
    const startTime = start.hour() + start.minute() / 60;
    const endTime = end.hour() + end.minute() / 60;
    const startToEndInterval = endTime - startTime;
    return {
      name: par.name,
      start: start.format("HH:mm"),
      end: end.format("HH:mm"),
      startInterval: startTime - 10,
      startToEndInterval,
    };
  });
  // if (studyDateStatus === "not passed") setUserArr((old) => [...old, temp]);
  // else if (att.firstChoice) setUserArr((old) => [...old, temp]);
};
