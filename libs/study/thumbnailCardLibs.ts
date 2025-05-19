import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import { CoordinatesProps } from "../../types/common";
import {
  RealTimeMemberProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/baseTypes";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { getRandomImage } from "../../utils/imageUtils";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { convertMergePlaceToPlace } from "./studyConverters";

export const setStudyThumbnailCard = (
  date: string,
  participations: StudyParticipationProps[],
  studyResults: StudyMergeResultProps[],
  realTimes: RealTimeMemberProps[],
  currentLocation: CoordinatesProps,
  locationMapping: { branch: string; id: string }[],
  myId: string,
): StudyThumbnailCardProps[] => {
  const basicThumbnailCard: StudyThumbnailCardProps[] = participations
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
          isMyStudy: false,
        },
      ]
    : realTimes
    ? [
        {
          place: {
            name: "개인 스터디 인증",
            branch: "자유 카페",
            address: "개인 공부 인증하고, 혜택 받아 가세요",
            distance: null,
            imageProps: {
              image:
                "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%BA%90%EB%A6%AD%ED%84%B0/%EC%95%84%EB%B0%94%ED%83%80/%EB%B3%91%EC%95%84%EB%A6%AC_%EC%B1%85.png",
              isPriority: true,
            },
            _id: "",
          },
          participants: realTimes?.map((par) => par.user),
          url: `/study/realTime/${date}`,
          status: "solo",
          isMyStudy: false,
        },
      ]
    : [];

  // 카드 데이터 생성
  const cardColData: StudyThumbnailCardProps[] = studyResults
    .filter((result) => result.status !== "solo")
    .map((data, idx) => {
      const placeInfo = convertMergePlaceToPlace(data.place);
      const isMyStudy = data.members.map((member) => member.user._id).includes(myId);

      // const image = imageCache?.get(placeInfo?.id);

      return {
        place: {
          name: placeInfo.name,
          branch:
            locationMapping === null
              ? placeInfo?.branch
              : locationMapping?.find((mapping) => mapping.id === placeInfo._id)?.branch,
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
            image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),
            isPriority: idx < 4,
          },
          _id: data.place._id,
        },
        participants: data.members.map((att) => att.user),
        url: `/study/${data.place._id}/${date}`,
        status: participations ? "expected" : data?.status || "open",
        isMyStudy,
      };
    });

  return participations
    ? [...basicThumbnailCard, ...cardColData]
    : [...cardColData, ...basicThumbnailCard];
};

export const sortThumbnailCardInfoArr = (
  sortedOption: "거리순" | "인원순",
  arr: StudyThumbnailCardProps[],
  userId: string,
) => {
  const statusPriority = { recruiting: 1, join: 2, open: 3, solo: 4, free: 5 };
  return [...arr].sort((a, b) => {
    const aPriority = statusPriority[a.status] || 99;
    const bPriority = statusPriority[b.status] || 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    const aIsJoined = a.participants.some((par) => par._id === userId);
    const bIsJoined = b.participants.some((par) => par._id === userId);

    if (aIsJoined !== bIsJoined) {
      return aIsJoined ? -1 : 1;
    }

    if (sortedOption === "거리순") {
      return a.place.distance - b.place.distance;
    }

    if (sortedOption === "인원순") {
      return b.participants.length - a.participants.length;
    }

    return 0;
  });
};
