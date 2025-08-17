import { Dayjs } from "dayjs";
import { atom } from "recoil";

import { SummaryBlockProps } from "../components/molecules/SummaryBlock";
import { IDailyCheckWinList } from "../constants/serviceConstants/dailyCheckConstatns";
import { IGiftEntry } from "../pages/store";
import { CollectionProps } from "../types/models/collections";
import { IGather } from "../types/models/gatherTypes/gatherTypes";
import { IGroup } from "../types/models/groupTypes/group";
import { MemberGroup } from "../types/models/member";
import { RealTimesDirectAttendanceProps } from "../types/models/studyTypes/requestTypes";
import { IUser } from "../types/models/userTypes/userInfoTypes";

export const transferStudyRewardState = atom<number>({
  key: "StudyReward",
  default: null,
});

export const transferCollectionState = atom<CollectionProps>({
  key: "transferCollection",
  default: null,
});

export const transferStudyVoteDateState = atom<Dayjs>({
  key: "transferStudyVoteCompleteState",
  default: null,
});

export const transferDailyCheckWinState = atom<IDailyCheckWinList>({
  key: "TransferDailyCheckWin",
  default: null,
});
export const transferShowDailyCheckState = atom<boolean>({
  key: "TransferShowDailyCheck",
  default: true,
});

export const transferUserName = atom<string>({
  key: "transferUserName",
  default: null,
});

export const transferGatherDataState = atom<IGather>({
  key: "transferGatherDataState",
  default: null,
});

export const transferGroupDataState = atom<IGroup>({
  key: "transferGroupDataState",
  default: null,
});

export interface TransferFeedSummaryProps extends Omit<SummaryBlockProps, "text"> {
  subCategory: string;
}

export const transferFeedSummaryState = atom<TransferFeedSummaryProps>({
  key: "transferFeedSummary",
  default: null,
});

export const transferMemberDataState = atom<{
  section: MemberGroup | "all";
  members: IUser[];
}>({
  key: "transferMemberDataState",
  default: null,
});
interface ItransferStoreGiftData {
  data: IGiftEntry;
  isActive: boolean;
}

export const transferStoreGiftDataState = atom<ItransferStoreGiftData>({
  key: "transferStoreGiftDataState",
  default: null,
});

export const transferStudyAttendanceState = atom<RealTimesDirectAttendanceProps>({
  key: "TransferStudyAttendance",
  default: null,
});
