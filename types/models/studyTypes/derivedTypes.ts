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
  participations: { date: string; study: StudyParticipationProps }[];
  soloRealTimes: { date: string; study: RealTimeMemberProps }[];
  openRealTimes: { date: string; study: RealTimesToResultProps }[];
  results: { date: string; study: StudyResultProps }[];
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
