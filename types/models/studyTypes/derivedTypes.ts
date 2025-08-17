import { RealTimesToResultProps } from "../../../libs/study/studyConverters";
import {
  RealTimeMemberProps,
  StudyParticipationProps,
  StudyResultProps,
  StudyStatus as StudyStatus2,
} from "./baseTypes";
import { PlaceReviewProps } from "./entityTypes";

export type StudyStatus = "participations" | "soloRealTimes" | "openRealTimes" | "results";



export interface StudySetProps {
  participations: StudyParticipationsSet[];
  soloRealTimes: StudySoloRealTimesSet[];
  openRealTimes: StudyOpenRealTimesSet[];
  results: StudyResultsSet[];
}

export interface StudyParticipationsSet {
  date: string;
  study: StudyParticipationProps;
}

export interface StudySoloRealTimesSet {
  date: string;
  study: RealTimeMemberProps;
}
export interface StudyOpenRealTimesSet {
  date: string;
  study: RealTimesToResultProps;
}

export interface StudyResultsSet {
  date: string;
  study: StudyResultProps;
}

export interface StudyMergeResultProps extends Omit<StudyResultProps, "place"> {
  place: MergeStudyPlaceProps;
  status: StudyStatus2;
}

export interface MergeStudyPlaceProps {
  name: string;
  branch: string;
  brand: string;
  address: string;
  image: string;
  coverImage: string;
  time: string;
  latitude: number;
  longitude: number;
  _id: string;
  reviews?: PlaceReviewProps[];
}
