import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import {
  StudyMergeParticipationProps,
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm, getRandomIdx } from "../../utils/mathUtils";

export const setStudyToThumbnailInfo = (
  studyData: StudyParticipationProps[] | StudyMergeParticipationProps[],
  currentLocation: { lat: number; lon: number },
  urlDateParam: string,
  location?: ActiveLocation,
): StudyThumbnailCardProps[] => {
  if (!studyData) return;
  const cardColData: StudyThumbnailCardProps[] = [...studyData]?.map((data) => {
    const placeInfo = data.place;
    const studyPlace = data.place as StudyPlaceProps;
    const realTimePlace = data.place as PlaceInfoProps;
    return {
      place: {
        fullname: studyPlace?.fullname || realTimePlace?.name,
        branch: studyPlace?.branch || realTimePlace?.name.split(" ")?.[1] || "알수없음",
        address: studyPlace?.locationDetail || realTimePlace?.address,
        distance: currentLocation
          ? getDistanceFromLatLonInKm(
              currentLocation.lat,
              currentLocation.lon,
              placeInfo.latitude,
              placeInfo.longitude,
            )
          : undefined,
        imageProps: {
          image: studyPlace?.image || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)],
          isPriority: true,
        },
      },
      participants: data.members.map((att) => att.user),
      url: `/study/${data.place._id}/${urlDateParam}?location=${convertLocationLangTo(studyPlace?.location || location, "en")}`,
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
