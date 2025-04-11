import { StudyResultProps, StudyStatus } from "./baseTypes";

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
}
