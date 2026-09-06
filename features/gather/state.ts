import { atom } from "recoil";

import { IGather, IGatherWriting } from "@/types/models/gatherTypes/gatherTypes";

export const isGatherEditState = atom({
  key: "isGatherEdit",
  default: false,
});

export const sharedGatherWritingState = atom<Partial<IGatherWriting>>({
  key: "sharedGatherWritingState",
  default: null,
});

export const transferGatherDataState = atom<IGather>({
  key: "transferGatherDataState",
  default: null,
});
