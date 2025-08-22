import dayjs from "dayjs";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyConfirmedProps } from "../../types/models/studyTypes/study-entity.types";
import { StudySetProps } from "../../types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
import { shortenParticipations } from "./studyConverters";

const placeImageCache = new Map<string, string>();

// function getCachedStudyImage(placeId: string, fallbackPool: string[]): string {
//   const cached = placeImageCache.get(placeId);
//   if (cached) return cached;

//   const picked = getRandomImage(fallbackPool);
//   placeImageCache.set(placeId, picked);
//   return picked;
// }

export const setStudyThumbnailCard = (
  date: string,
  studySet: StudySetProps,
  myId: string,
): StudyThumbnailCardProps[] => {
  const { participations, openRealTimes, soloRealTimes, results } = studySet;

  const isPassedDate = dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));
  const isFutureDate = dayjs(date).startOf("day").isAfter(dayjs().startOf("day"));

  const basicThumbnailCard: StudyThumbnailCardProps[] = [];
  if (soloRealTimes && !isFutureDate) {
    basicThumbnailCard.push({
      place: {
        name: "실시간 공부 인증",
        branch: "자유 장소",
        address: "공부 인증하고, 다양한 혜택 받아가세요!",
        date: "",
        imageProps: {
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.%EC%8B%A4%EC%8B%9C%EA%B0%84+%EA%B3%B5%EB%B6%80+%EC%9D%B8%EC%A6%9D.png",
          isPriority: true,
        },
        _id: "",
      },
      participants: soloRealTimes?.flatMap((par) => par.study.members.map((member) => member.user)),
      url: `/study/realTime/${date}?type=soloRealTimes`,
      studyType: "soloRealTimes",
      isMyStudy: false,
    });
  }
  if (!isPassedDate) {
    basicThumbnailCard.push({
      place: {
        name: "스터디 매칭 라운지",
        branch: "위치 선정 중...",
        address: "가까운 인원들과 스터디를 매칭하고 있어요",
        date: "",
        imageProps: {
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.%EC%8A%A4%ED%84%B0%EB%94%94+%EB%A7%A4%EC%B9%AD+%EB%9D%BC%EC%9A%B4%EC%A7%80_%EC%B1%85ver.png",
          isPriority: true,
        },
        _id: "",
      },
      participants: shortenParticipations(participations).map((par) => par.user),
      url: `/study/participations/${date}?type=participations`,
      studyType: "participations",
      isMyStudy: false,
    });
  }

  const hasStatus = (x: any) => x?.status != null || x?.study?.status != null;

  const merged = [...openRealTimes, ...results].sort((a, b) => {
    const da = dayjs(a.date);
    const db = dayjs(b.date);
    if (da.isBefore(db)) return -1;
    if (da.isAfter(db)) return 1;

    // 같은 날짜면: status 없는 항목이 먼저
    const aHas = hasStatus(a);
    const bHas = hasStatus(b);
    if (aHas === bHas) return 0;
    return aHas ? 1 : -1;
  });

  // 카드 데이터 생성
  const cardColData: StudyThumbnailCardProps[] = merged.map((data, idx) => {
    const study = data.study;

    if (hasStatus(study)) {
      const placeInfo = study.place;

      const textArr = placeInfo.location?.address.split(" ");
      return {
        place: {
          name: placeInfo.location.name,
          branch: textArr?.[0] + " " + textArr?.[1],
          // locationMapping === null
          //   ? placeInfo?.branch
          //   : locationMapping?.find((mapping) => mapping.id === placeInfo._id)?.branch,
          address: placeInfo.location?.address,
          date: dayjsToFormat(dayjs(data.date).locale("ko"), "M.D(ddd)"),
          imageProps: {
            image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),
            // getCachedStudyImage(placeInfo._id, GATHER_MAIN_IMAGE_ARR["스터디"]),
            isPriority: idx < 4,
          },
          _id: placeInfo._id,
        },
        participants: study.members.map((att) => att.user),
        url: `/study/${placeInfo._id}/${data.date}?type=openRealTimes`,
        studyType: "openRealTimes",
        isMyStudy: study.members.map((member) => member.user._id).includes(myId),
      };
    } else {
      const study2 = study as StudyConfirmedProps;
      const placeInfo = study2.place;

      const addressArr = placeInfo.location.address.split(" ");

      return {
        place: {
          name: placeInfo.location.name,
          branch: addressArr?.[0] + " " + addressArr?.[1],
          address: placeInfo.location.address,
          date: dayjsToFormat(dayjs(data.date).locale("ko"), "M.D(ddd)"),
          imageProps: {
            image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),
            isPriority: idx < 4,
          },
          _id: placeInfo._id,
        },
        participants: study2.members.map((att) => att.user),
        url: `/study/${placeInfo._id}/${data.date}?type=results`,
        studyType: "results",
        isMyStudy: study2.members.map((member) => member.user._id).includes(myId),
        isFutureDate: dayjs(data.date).hour(9).isAfter(dayjs()),
      };
    }
  });

  return [...basicThumbnailCard, ...cardColData];
};

export const sortThumbnailCardInfoArr = (
  sortedOption: "날짜순" | "거리순" | "인원순",
  arr: StudyThumbnailCardProps[],
  userId: string,
) => {
  if (sortedOption === "날짜순") return arr;

  return [...arr].sort((a, b) => {
    const aPriority = a.studyType === "results";
    const bPriority = b.studyType === "openRealTimes";

    if (aPriority !== bPriority) {
      return aPriority ? -1 : 1;
    }

    const aIsJoined = a.participants.some((par) => par._id === userId);
    const bIsJoined = b.participants.some((par) => par._id === userId);

    if (aIsJoined !== bIsJoined) {
      return aIsJoined ? -1 : 1;
    }

    // if (sortedOption === "거리순") {
    //   return a.place.distance - b.place.distance;
    // }

    if (sortedOption === "인원순") {
      return b.participants.length - a.participants.length;
    }

    return 0;
  });
};
