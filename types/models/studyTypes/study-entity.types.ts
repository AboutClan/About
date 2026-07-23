import { STUDY_CREW } from "../../../constants/service/study/place";
import { LocationProps, TimeRangeProps } from "../../common";
import { StringTimeProps, TimeStampProps } from "../../utils/timeAndDate";
import { CommentProps } from "../commonTypes";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceRegisterProps, PlaceReviewProps } from "./entityTypes";
import { StudyAttendanceProps } from "./requestTypes";

/**
 * study entry detail types
 */

export interface StudyParticipationProps {
  user: UserSimpleInfoProps;
  location: LocationProps;
  isBeforeResult: boolean;
  times: TimeRangeProps;
  dates?: string[];
}

export interface StudyConfirmedProps {
  place: StudyPlaceProps;
  members: StudyConfirmedMemberProps[];
  status: StudyStatus;
}

/**
 * study status
 */

export type StudyStatus = RealTimesStudyStatus | VoteStudyStatus;
export type VoteStudyStatus = "open" | "expected";
export type RealTimesStudyStatus = "open" | "participation" | "solo" | "pending";
export type MyStudyStatus = "pending" | "participation" | "otherParticipation";

export type StudyCrew = (typeof STUDY_CREW)[number];
/**
 * study member (participation 제외)
 */

export interface StudyConfirmedMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time?: StringTimeProps;
  attendance?: StudyAttendanceProps;
  heartCnt?: number;
  comment?: CommentProps;
  status?: RealTimesStudyStatus;
}

export type StudyPlaceFilter = "all" | "about" | "good";

// 장소 유형 필터(전체/일반 카페/카공족). 별점·편의시설 등 "품질" 축인 StudyPlaceFilter와는
// 완전히 다른 축이라 별도 타입으로 분리한다.
export type PlaceTypeFilter = "all" | "cafe" | "kagongjok";

// 장소가 일반 카페인지, 카공을 목적으로 설계된 전문 공간인지. 없으면 "cafe"로 취급한다.
export type PlaceSpaceType = "cafe" | "study_space";
// 공식 협업 파트너 브랜드. 현재는 카공족 하나뿐이라 유니언으로 시작하고, 추후 다른 브랜드가
// 입점하면 값을 추가한다.
export type PlaceBrand = "kagongjok";

export interface StudyRatingProps {
  comment?: string;
  etc: number;
  mood: number;
  space: number;
  power: number;
  user?: string;
  createdAt?: string;
  name?: string;
}
export interface StudyPlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate?: string;
  prefCnt?: number;
  reviews?: PlaceReviewProps[];
  image?: string;
  coverImage?: string;
  ratings?: StudyRatingProps[];
  // 실제 운영시간 데이터는 [["평일", "09:00 - 22:00"], ...] 형태의 2차원 배열로 내려오며,
  // PlaceInfoCard/CafeCompactCard가 operatingHours?.[0]?.[1]로 시간대 문자열을 꺼내 쓴다.
  operatingHours?: string[][];
  pick?: string;
  likes?: string[];
  studyCafeMeta?: StudyCafeMetaProps;
  spaceType?: PlaceSpaceType;
  brand?: PlaceBrand;
}

export interface StudyCafeMetaProps {
  is24Hours: boolean;
  hasParking: boolean;
  hasGroupSeats: boolean;
  hasComfortableSeats: boolean;
  hasCleanRestroom: boolean;
  hasGoodWifi: boolean;
  hasGoodValueDrinks: boolean;
  hasTimeLimit: boolean;
}

// export interface RealTimeMemberProps extends StudyConfirmedMemberProps {
//   place: PlaceInfoProps;
//   status: StudyStatus;
// }
// export interface RealTimesToResultProps extends StudyConfirmedProps {
//   status?: StudyStatus2;
