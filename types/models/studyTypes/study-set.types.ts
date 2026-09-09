import { StudyConfirmedProps, StudyParticipationProps } from "@/types/models/studyTypes/study-entity.types";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

/**
 * Collection of two types of study sets
 */
export type StudyType = "participations" | "soloRealTimes" | "openRealTimes" | "results";

type StudyValueMap = {
  [K in StudyType]: K extends "participations"
    ? StudyParticipationsSetProps
    : StudyConfirmedSetProps;
};

export type StudySetProps = { [K in keyof StudyValueMap]: StudyValueMap[K][] };

/**
 * 주간 응답 전용. StudySetProps는 매핑 타입이라 여기에 필드를 직접 넣으면
 * StudySetEntry까지 오염되므로 상속으로만 얹는다.
 */
export interface StudyWeekSetProps extends StudySetProps {
  /** 매칭에 실패한 사람들. 결과가 확정된 날짜에만 채워진다. */
  unmatched: { date: string; users: UserSimpleInfoProps[] }[];
}

/**
 * study entry types
 */

export type StudySetEntry = StudySetProps[keyof StudySetProps][number];

export interface StudyParticipationsSetProps {
  date: string;
  study: StudyParticipationProps[];
}

export interface StudyConfirmedSetProps {
  date: string;
  study: StudyConfirmedProps;
}

// export interface StudyMergeResultProps extends Omit<StudyConfirmedProps, "place"> {
//   place: MergeStudyPlaceProps;
//   status: StudyStatus2;
// }

// export interface MergeStudyPlaceProps {
//   name: string;
//   image: string;
//   coverImage: string;
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
//   _id: string;
//   reviews?: PlaceReviewProps[];
// }
