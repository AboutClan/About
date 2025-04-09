import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import { CoordinatesProps } from "../../types/common";
import {
  StudyMergeResultProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/studyDetails";
import { getRandomImage } from "../../utils/imageUtils";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { convertMergePlaceToPlace } from "./convertMergePlaceToPlace";

export const setStudyThumbnailCard = (
  date: string,
  participations: StudyParticipationProps[],
  studyResults: StudyMergeResultProps[],
  currentLocation: CoordinatesProps,
  isThreeSize: boolean,
): StudyThumbnailCardProps[] => {
  const participationThumbnailCard: StudyThumbnailCardProps[] = participations
    ? [
        {
          place: {
            name: "집계중",
            branch: "테스트",
            address: "집계중",
            distance: 24,
            imageProps: {
              image:
                "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%B9%B4%ED%8E%98+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%9E%9C%EB%8D%A4/%EA%B7%B8%EB%A6%BC3.png",
              isPriority: true,
            },
            _id: "",
          },
          participants: participations.map((par) => par.user),
          url: "",
          status: "recruiting",
        },
      ]
    : [];

  // 카드 데이터 생성
  const cardColData: StudyThumbnailCardProps[] = studyResults
    .slice(0, isThreeSize ? (participations ? 2 : 3) : studyResults.length)
    .map((data, idx) => {
      const placeInfo = convertMergePlaceToPlace(data.place);

      // const image = imageCache?.get(placeInfo?.id);

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
            image: placeInfo.image || getRandomImage(),
            isPriority: idx < 4,
          },
          _id: data.place._id,
        },
        participants: data.members.map((att) => att.user),
        url: `/study/${data.place._id}/${date}`,
        status: data?.status || "open",
      };
    });

  return [...participationThumbnailCard, ...cardColData];
};

export const sortThumbnailCardInfoArr = (
  sortedOption: "거리순" | "인원순",
  arr: StudyThumbnailCardProps[],
) => {
  return [...arr].sort((a, b) => {
    if (sortedOption === "거리순") {
      if (a.place.distance > b.place.distance) return 1;
      else if (a.place.distance < b.place.distance) return -1;
      else return 0;
    }
    if (sortedOption === "인원순") {
      if (a.participants.length > b.participants.length) return -1;
      if (a.participants.length < b.participants.length) return 1;
      return 0;
    }
  });
};
