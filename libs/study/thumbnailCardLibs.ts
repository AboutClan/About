import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import { CoordinatesProps } from "../../types/common";
import { StudyParticipationProps } from "../../types/models/studyTypes/baseTypes";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { getRandomImage } from "../../utils/imageUtils";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { convertMergePlaceToPlace } from "./studyConverters";

export const setStudyThumbnailCard = (
  date: string,
  participations: StudyParticipationProps[],
  studyResults: StudyMergeResultProps[],
  currentLocation: CoordinatesProps,
  isShort: boolean = false,
): StudyThumbnailCardProps[] => {
  const participationThumbnailCard: StudyThumbnailCardProps[] = participations
    ? [
        {
          place: {
            name: "카공 스터디 자동 매칭",
            branch: "위치 선정 중",
            address: "가까운 인원들과 스터디를 매칭하고 있어요",
            distance: null,
            imageProps: {
              image:
                "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%85%B8%ED%8A%B8%EB%B6%81_100px_%ED%88%AC%EB%AA%85.png",
              isPriority: true,
            },
            _id: "",
          },
          participants: participations.map((par) => par.user),
          url: `/study/participations/${date}`,
          status: "recruiting",
        },
      ]
    : [];

  // 카드 데이터 생성
  const cardColData: StudyThumbnailCardProps[] = studyResults.map((data, idx) => {
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
      status: participations ? "expected" : data?.status || "open",
    };
  });

  return [...participationThumbnailCard, ...cardColData].filter((props) =>
    isShort
      ? true
      : props.status === "expected" || props.status === "recruiting" || props.status === "open",
  );
};

export const sortThumbnailCardInfoArr = (
  sortedOption: "거리순" | "인원순",
  arr: StudyThumbnailCardProps[],
  userId: string,
) => {
  return [...arr].sort((a, b) => {
    const aIsRecruiting = a.status === "recruiting";
    const bIsRecruiting = b.status === "recruiting";

    if (aIsRecruiting && !bIsRecruiting) return -1;
    if (!aIsRecruiting && bIsRecruiting) return 1;

    const aIsJoined = a.participants.some((par) => par._id === userId);
    const bIsJoined = b.participants.some((par) => par._id === userId);

    if (aIsJoined && !bIsJoined) return -1;
    if (!aIsJoined && bIsJoined) return 1;
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
