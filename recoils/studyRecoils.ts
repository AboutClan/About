import { atom } from "recoil";
import { MyStudyParticipationProps } from "../types/models/studyTypes/studyDetails";

import { StudyDateStatus } from "../types/models/studyTypes/studyInterActions";

export const myStudyParticipationState = atom<MyStudyParticipationProps>({
  key: "MyStudyParticipation",
  default: undefined,
});

export const studyDateStatusState = atom<StudyDateStatus>({
  key: "StudyDateStatus",
  default: "today",
});

// export const myStudyInfoState = atom<StudyParticipationProps | null>({
//   key: "MyStudyInfo",
//   default: undefined,
// });
// export const myRealStudyInfoState = atom<RealTimeInfoProps>({
//   key: "MyRealStudyInfo",
//   default: null,
// });

// export const studyAttendInfoState = atom<RealTimeInfoProps>({
//   key: "StudyAttendInfo",
//   default: null,
// });
