import { atom } from "recoil";

import { IGatherWriting } from "../types/models/gatherTypes/gatherTypes";
import { IGroupWriting } from "../types/models/groupTypes/group";
import { StudyWritingProps } from "../types/models/studyTypes/studyInterActions";

export const sharedStudyWritingState = atom<StudyWritingProps>({
  key: "sharedStudyWritingState",
  default: null,
});
export const sharedGatherWritingState = atom<Partial<IGatherWriting>>({
  key: "sharedGatherWritingState",
  default: null,
});
export const sharedGroupWritingState = atom<IGroupWriting>({
  key: "sharedGroupWritingState",
  default: null,
});
