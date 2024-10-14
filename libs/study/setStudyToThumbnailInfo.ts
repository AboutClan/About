import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import {
  StudyMergeParticipationProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/studyDetails";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { convertMergePlaceToPlace } from "./convertMergePlaceToPlace";

export const setStudyToThumbnailInfo = (
  studyData: StudyParticipationProps[] | StudyMergeParticipationProps[],
  currentLocation: { lat: number; lon: number },
  urlDateParam: string,
  location: ActiveLocation,
): StudyThumbnailCardProps[] => {
  if (!studyData) return;
  const cardColData: StudyThumbnailCardProps[] = [...studyData]?.map((data, idx) => {
    const placeInfo = convertMergePlaceToPlace(data.place);

    return {
      place: {
        name: placeInfo.name,
        branch: placeInfo.branch,
        address: placeInfo.address,
        distance: currentLocation
          ? getDistanceFromLatLonInKm(
              currentLocation.lat,
              currentLocation.lon,
              placeInfo.latitude,
              placeInfo.longitude,
            )
          : undefined,
        imageProps: {
          image: placeInfo.image,
          isPriority: true,
        },
      },
      participants: data.members.map((att) => att.user),
      url: `/study/${data.place._id}/${urlDateParam}?location=${convertLocationLangTo(location, "en")}`,
      status: data.status,

      id: data.place._id,
    };
  });

  return [...cardColData].sort((a, b) => {
    if (a.place.distance > b.place.distance) return 1;
    else if (a.place.distance < b.place.distance) return -1;
    else return 0;
  });
};
