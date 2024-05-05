import { atom } from "recoil";

import { IPostThumbnailCard } from "../components/molecules/cards/PostThumbnailCard";
import { IParticipation } from "../types/models/studyTypes/studyDetails";
import { StudyDateStatus } from "../types/models/studyTypes/studyInterActions";

export const studyDateStatusState = atom<StudyDateStatus>({
  key: "StudyDateStatus",
  default: "today",
});

export const myStudyState = atom<IParticipation | null>({
  key: "MyStudy",
  default: undefined,
});

export const sortedStudyCardListState = atom<IPostThumbnailCard[]>({
  key: "SortedStudyCardList",
  default: undefined,
});
