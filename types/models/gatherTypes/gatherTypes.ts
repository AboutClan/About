import { GatherCategoryMain } from "@/constants/contentsText/GatherContents";
import { UserCommentProps } from "@/types/components/propTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { Location } from "@/types/services/locationTypes";
import { TimeStampProps } from "@/types/utils/timeAndDate";

export interface IGather extends Omit<IGatherWriting, "date">, TimeStampProps {
  date: string;
  participants: IGatherParticipants[];
  id: number;
  status: GatherStatus;
  comments: UserCommentProps[];
  reviewers: string[];
  hasReview: boolean;
  waiting: {
    user: UserSimpleInfoProps;
    phase: "first" | "second";
    createdAt?: string;
  }[];
}

/**
 * 상시 행사(regularGather)의 일정. 매주 반복이면 weekday, 특정 날짜면 date.
 * contentKey가 있으면 그 콘텐츠 전용 일정이다. key는 formStats.byOption의 키와 같다.
 */
export interface IRegularSlot {
  key: string;
  /** 0(일) ~ 6(토) */
  weekday?: number;
  /** "YYYY-MM-DD" */
  date?: string;
  /** "19:00" */
  time: string;
  contentKey?: string;
}

/** 상시 행사의 콘텐츠 라인업(수시 교체). location이 없으면 행사 공통 location을 쓴다. */
export interface IRegularContent {
  key: string;
  title: string;
  description?: string;
  url?: string;
  /** "제휴 할인 가능" 같은 짧은 배지 */
  badge?: string;
  location?: IGatherLocation;
}

/** 상시 행사 구글폼 신청 집계. roundKey는 그 주 월요일(KST) "YYYY-MM-DD", byOption은 slot·content key별 선택 수. */
export interface IRegularFormStats {
  roundKey: string;
  total: number;
  byOption: Record<string, number>;
  /** 이번 주 구글폼 신청자(익명). 이름·연락처는 없다. */
  applicants?: IRegularFormApplicant[];
  updatedAt: string;
}

export interface IRegularFormApplicant {
  gender: "남성" | "여성" | null;
  birthYear: number | null;
  /** 고른 slot·content key */
  keys: string[];
  submittedAt: string | null;
  uid?: string | null;
  /** 앱 신청 기록과 짝지어 연결된 회원(집계 시점 스냅샷). 외부 신청자는 null */
  user?: IRegularApplicantUser | null;
}

export interface IRegularApplicantUser {
  _id: string;
  uid: string;
  nickname?: string;
  avatar?: { type: number; bg: number };
  profileImage?: string;
}

export interface IGatherDateOption {
  date: string;
  voters: UserSimpleInfoProps[] | string[];
}

export interface IGatherWriting {
  type: IGatherType;
  place: Location | "전체";
  genderCondition: boolean;
  title: string;
  content: string;
  gatherList: IGatherListItem[];
  date: string;
  location: IGatherLocation;
  memberCnt: IGatherMemberCnt;
  password?: string;
  age: number[];
  preCnt?: number;
  user: string | UserSimpleInfoProps;
  isAdminOpen?: boolean;
  image?: string;
  coverImage?: string;
  kakaoUrl?: string;
  googleFormUrl?: string;
  isApprovalRequired?: boolean;
  category?: GatherCategory;
  groupId?: string;
  postImage?: string;
  dateOptions?: IGatherDateOption[];
  slots?: IRegularSlot[];
  contents?: IRegularContent[];
  formStats?: IRegularFormStats | null;
  /** 상시 행사에서 확정돼 따로 만든 모임이면 부모 gather id */
  parentGatherId?: number | null;
}

export type GatherCategory =
  | "gather"
  | "event"
  | "group"
  | "official"
  | "openGather"
  | "secretGather"
  | "officialGather"
  | "regularGather";
export type IGatherType = { title: GatherCategoryMain; subtitle?: string };

export type GatherStatus = "open" | "close" | "end" | "pending" | "planned" | "expired" | "today";

export type IGatherLocation = {
  main: string;
  sub: string;
  latitude: number;
  longitude: number;
};

export type IGatherMemberCnt = {
  min: number;
  max: number;
};

export interface IGatherListItem {
  text: string;
  time: {
    hours?: number;
    minutes?: number;
  };
}

/** 모임장이 불참 인원을 체크할 때 고르는 유형. 서버의 GatherAbsenceType과 같다. */
export type GatherAbsenceType = "normal" | "noshow" | "nomanner";

export interface IGatherParticipants {
  user?: UserSimpleInfoProps;
  phase?: "first" | "second";
  reviewed?: boolean;
  absence?: boolean;
  absenceType?: GatherAbsenceType;
  withCompanion?: boolean;
  isDummy?: boolean;
  dummyId?: string;
  dummyName?: string;
  dummyGender?: string;
  dummyBirth?: string;
}

// export interface IGatherHeader {
//   title: string;
//   date: Dayjs | string | "미정";
//   locationMain: string;
// }

export interface GatherRequestWritingProps {
  title: string;
  content: string;
  isAnonymous: boolean;
}

export interface GatherRequestProps extends GatherRequestWritingProps, TimeStampProps {
  writer: UserSimpleInfoProps;
  like: string[];
  pirze: number;

  status: "pending" | "completed";
  _id: string;
}
