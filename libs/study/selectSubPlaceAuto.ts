import { STUDY_RECOMMENDATION_DISTANCE } from "../../constants/settingValue/study/study";
import {
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/studyDetails";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";

export const selectSubPlaceAuto = (
  myVotePlace: StudyPlaceProps,
  studyVoteData: StudyParticipationProps[],
): string[] => {
  if (!myVotePlace || !studyVoteData) return;
  const subPlace = [];
  studyVoteData
    .filter((par) => par.place._id !== myVotePlace._id)
    .forEach((item) => {
      const distance = getDistanceFromLatLonInKm(
        myVotePlace.latitude,
        myVotePlace?.longitude,
        item.place.latitude,
        item.place.longitude,
      );
      if (distance < STUDY_RECOMMENDATION_DISTANCE) subPlace.push(item.place._id);
    });
  return subPlace;
};
