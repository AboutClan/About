import { atom } from "recoil";

import { IParticipation, IStudy } from "../types/models/studyTypes/studyDetails";
import { StudyDateStatus } from "../types/models/studyTypes/studyInterActions";

export const studyPairArrState = atom<IStudy[]>({
  key: "StudyPairArr",
  default: null,
});

export const studyDateStatusState = atom<StudyDateStatus>({
  key: "StudyDateStatus",
  default: "today",
});

export const myStudyState = atom<IParticipation | null>({
  key: "MyStudy",
  default: undefined,
});
