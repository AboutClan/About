import dayjs from "dayjs";

import { StudyMemberProps } from "../../types/models/studyTypes/baseTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

export const getStudyTime = (users: StudyMemberProps[]): { start: string; end: string } => {
  if (!users) return null;
  let startTime = dayjs();
  let endTime = dayjs();

  users.forEach((user) => {
    const userStart = dayjs(user.time.start);
    const userEnd = dayjs(user.time.end);
    if (!startTime) startTime = userStart;
    if (!endTime) endTime = userEnd;
    if (userStart.isBefore(startTime)) startTime = userStart;
    if (userEnd.isAfter(endTime)) endTime = userEnd;
  });

  return { start: dayjsToFormat(startTime, "HH:mm"), end: dayjsToFormat(endTime, "HH:mm") };
};
