import { Dayjs } from "dayjs";
import { atom } from "recoil";

import { IDailyCheckWinList } from "../constants/serviceConstants/dailyCheckConstatns";
import { IGiftEntry } from "../pages/store";
import { PointInfoProps } from "../types/common";
import { IGather } from "../types/models/gatherTypes/gatherTypes";
import { IGroup } from "../types/models/groupTypes/group";
import { MemberGroup } from "../types/models/member";
import { RealTimesDirectAttendanceProps } from "../types/models/studyTypes/requestTypes";
import { IUser } from "../types/models/userTypes/userInfoTypes";

export const transferStudyRewardState = atom<PointInfoProps>({
  key: "StudyReward",
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

// 홈 화면의 "내 취향 소모임 찾기" 버튼에서 인트로 모달 없이 바로 소모임 Drawer를 여는 트리거
export const transferHomeActivityDrawerOpenState = atom<boolean>({
  key: "transferHomeActivityDrawerOpenState",
  default: false,
});

export type HomeActivityDrawerTab = "activity" | "benefit";

// Drawer를 열 때 어떤 탭("소모임" | "제휴 혜택")을 먼저 보여줄지 지정한다. 닫힐 때 "activity"로 초기화된다.
export const transferHomeActivityDrawerTabState = atom<HomeActivityDrawerTab>({
  key: "transferHomeActivityDrawerTabState",
  default: "activity",
});

// HomeActivityDrawer의 열림 상태를 라우터 쿼리에 실어 히스토리로 관리하기 위한 쿼리 키.
// 이 값이 있으면 열림, 없으면(뒤로가기 등으로 사라지면) 닫힘으로 취급한다.
export const HOME_ACTIVITY_DRAWER_QUERY_KEY = "activityDrawer";
