import { atom } from "recoil";
import { StudyMergeParticipationProps } from "../types/models/studyTypes/studyDetails";

import { StudyDateStatus } from "../types/models/studyTypes/studyInterActions";

export const myStudyParticipationState = atom<StudyMergeParticipationProps>({
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
