import { atom } from "recoil";

import { StudyMergeParticipationProps } from "../types/models/studyTypes/studyDetails";

export const myStudyParticipationState = atom<StudyMergeParticipationProps>({
  key: "MyStudyParticipation",
  default: undefined,
});

// export const myStudyInfoState = atom<StudyParticipationProps | null>({
//   key: "MyStudyInfo",
//   default: undefined,
// });
// export const myRealStudyInfoState = atom<RealTimeInfoProps>({
//   key: "MyRealStudyInfo",
//   default: null,
// });
