import { StudyConfirmedProps, StudyParticipationProps } from "./study-entity.types";

/**
 * Collection of two types of study sets
 */
export type StudyType = "participations" | "soloRealTimes" | "openRealTimes" | "results";
export type StudyPageType = StudyType | "expectedResults";

type StudyValueMap = {
  [K in StudyType]: K extends "participations"
    ? StudyParticipationsSetProps
    : StudyConfirmedSetProps;
};

export type StudySetProps = { [K in keyof StudyValueMap]: StudyValueMap[K][] };
export type StudyOneDayProps = StudyValueMap;

/**
 * study entry types
 */

export type StudySetEntry = StudySetProps[keyof StudySetProps][number];

interface StudyParticipationsSetProps {
  date: string;
  study: StudyParticipationProps;
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
