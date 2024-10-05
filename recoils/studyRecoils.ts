import { atom } from "recoil";
import {
  IParticipation,
  IStudy,
  StudyAttendanceProps,
} from "../types/models/studyTypes/studyDetails";
import { StudyDateStatus } from "../types/models/studyTypes/studyInterActions";

export const studyPairArrState = atom<IStudy[]>({
  key: "StudyPairArr",
  default: null,
});

export const studyDateStatusState = atom<StudyDateStatus>({
  key: "StudyDateStatus",
  default: "today",
});

export const myStudyInfoState = atom<IParticipation | null>({
  key: "MyStudyInfo",
  default: undefined,
});

export const myRealStudyInfoState = atom<StudyAttendanceProps>({
  key: "MyRealStudyInfo",
  default: null,
});

export const studyAttendInfoState = atom<StudyAttendanceProps>({
  key: "StudyAttendInfo",
  default: null,
});
