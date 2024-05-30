import dayjs from "dayjs";

import { STUDY_VOTING_TABLE } from "../../../constants/keys/localStorage";
import {
  STUDY_DATE_END_HOUR,
  STUDY_DATE_START_HOUR,
} from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { StudyVotingSave } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

export const getStudyStandardDate = () => {
  const currentHour = dayjs().hour();

  const studyVotingTable =
    (JSON.parse(localStorage.getItem(STUDY_VOTING_TABLE)) as StudyVotingSave[]) || [];

  const hasTodayStudy = studyVotingTable.find((obj) => obj.date === dayjsToStr(dayjs())).isVoting;

  if (currentHour <= STUDY_DATE_START_HOUR) {
    return dayjsToStr(dayjs());
  } else {
    if (hasTodayStudy && currentHour <= STUDY_DATE_END_HOUR) {
      return dayjsToStr(dayjs());
    } else return dayjsToStr(dayjs().add(1, "day"));
  }
};
