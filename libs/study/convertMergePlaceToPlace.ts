import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import { StudyPlaceProps } from "../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { getRandomIdx } from "../../utils/mathUtils";

export const convertMergePlaceToPlace = (mergePlace: StudyPlaceProps | PlaceInfoProps) => {
  if (!mergePlace) return;
  const studyPlace = mergePlace as StudyPlaceProps;
  const realTimePlace = mergePlace as PlaceInfoProps;

  return {
    name: studyPlace?.fullname || realTimePlace?.name,
    branch: studyPlace?.branch || realTimePlace?.name.split(" ")?.[1] || "알수없음",
    address: studyPlace?.locationDetail || realTimePlace?.address,
    brand: studyPlace?.brand || realTimePlace?.name.split(" ")?.[0] || "",
    image: studyPlace?.image || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)],
    coverImage:
      studyPlace?.coverImage || STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length)],
    latitude: studyPlace.latitude,
    longitude: studyPlace.longitude,
    time: studyPlace?.time || null,
  };
};
