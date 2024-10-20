import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import {
  StudyMergeParticipationProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { convertMergePlaceToPlace } from "./convertMergePlaceToPlace";

export const setStudyToThumbnailInfo = (
  studyData: StudyParticipationProps[] | StudyMergeParticipationProps[],
  myPrefer: IStudyVotePlaces,
  currentLocation: { lat: number; lon: number },
  urlDateParam: string | null,
  imagePriority: boolean,
  location?: ActiveLocation,
  votePlaceProps?: { main: string; sub: string[] },
  // imageCache?: Map<string, string>,
): StudyThumbnailCardProps[] => {
  if (!studyData) return [];

  // 카드 데이터 생성
  const cardColData: StudyThumbnailCardProps[] = studyData.map((data, idx) => {
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
          isPriority: imagePriority === false ? false : idx < 4 ? true : false,
        },
      },
      participants: data.members.map((att) => att.user),
      url:
        urlDateParam &&
        `/study/${data.place._id}/${urlDateParam}?location=${convertLocationLangTo(location, "en")}`,
      status: data.status,
      id: data.place._id,
    };
  });

  // 정렬 로직 개선
  const sorted = [...cardColData].sort((a, b) => {
    // 1. main 장소 우선 정렬
    if (votePlaceProps) {
      if (a.id === votePlaceProps.main) return -1;
      if (b.id === votePlaceProps.main) return 1;

      // 2. sub 장소들 정렬
      const aIsSub = votePlaceProps.sub.includes(a.id);
      const bIsSub = votePlaceProps.sub.includes(b.id);
      if (aIsSub && !bIsSub) return -1;
      if (!aIsSub && bIsSub) return 1;
    }
    if (a.participants.length !== b.participants.length) {
      return b.participants.length - a.participants.length;
    }
    if (myPrefer) {
      if (a.id === myPrefer.place) return -1;
      if (b.id === myPrefer.place) return 1;

      const aIsMySub = myPrefer?.subPlace?.includes(a.id);
      const bIsMySub = myPrefer?.subPlace?.includes(b.id);
      if (aIsMySub && !bIsMySub) return -1;
      if (!aIsMySub && bIsMySub) return 1;
    }

    // 3. 거리순 정렬
    if (a.place.distance !== undefined && b.place.distance !== undefined) {
      return a.place.distance - b.place.distance;
    }

    return 0;
  });

  return sorted;
};
