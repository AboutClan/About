import { RealTimesToResultProps } from "../../../libs/study/studyConverters";
import {
  RealTimeMemberProps,
  StudyParticipationProps,
  StudyResultProps,
  StudyStatus,
} from "./baseTypes";
import { PlaceReviewProps } from "./entityTypes";

export interface StudySetProps {
  participations: StudyParticipationProps[];
  soloRealTimes: RealTimeMemberProps[];
  openRealTimes: { date: string; study: RealTimesToResultProps }[];
  results: { date: string; study: StudyResultProps }[];
}

export interface StudyMergeResultProps extends Omit<StudyResultProps, "place"> {
  place: MergeStudyPlaceProps;
  status: StudyStatus;
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
