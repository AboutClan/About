import dayjs from "dayjs";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import { StudySetProps, StudyType } from "../../types/models/studyTypes/study-set.types";
import { getRandomImage } from "../../utils/imageUtils";
import { shortenParticipations } from "./studyConverters";

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
  func?: () => void,
  pathHome?: boolean,
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
        address: "공부 인증하면, 돈이 쌓인다!",
        date: null,
        imageProps: {
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.%EC%8B%A4%EC%8B%9C%EA%B0%84+%EA%B3%B5%EB%B6%80+%EC%9D%B8%EC%A6%9D.png",
          isPriority: true,
        },
        _id: "",
      },
      participants: soloRealTimes?.flatMap((par) => par.study.members.map((member) => member.user)),
      url: `/study/realTime/${date}?type=soloRealTimes` + (pathHome ? "&path=home" : ""),
      studyType: "soloRealTimes",
      isMyStudy: false,
      func,
    });
  }
  if (!isPassedDate) {
    basicThumbnailCard.push({
      place: {
        name: "카공 스터디 라운지",
        branch: "위치 선정 중...",
        address: "가까운 인원들과 카공 스터디를 매칭하고 있어요",
        date: null,
        imageProps: {
          image:
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.%EC%8A%A4%ED%84%B0%EB%94%94+%EB%A7%A4%EC%B9%AD+%EB%9D%BC%EC%9A%B4%EC%A7%80_%EC%B1%85ver.png",
          isPriority: true,
        },
        _id: "",
      },
      participants: shortenParticipations(participations).map((par) => par.user),
      url: `/study/participations/${date}?type=participations` + (pathHome ? "&path=home" : ""),
      studyType: "participations",
      isMyStudy: false,
      func,
    });
  }

  const hasStatus = (x) => x?.status != null || x?.study?.status != null;

  const temp1 = [...openRealTimes].map((real) => ({
    ...real,
    study: { ...real.study, status: "openRealTimes" as StudyType },
  }));

  const temp2 = [...results].map((result) => ({
    ...result,
    study: { ...result.study, status: "results" as StudyType },
  }));

  const merged = [...temp1, ...temp2].sort((a, b) => {
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
    const placeInfo = study.place;
    const textArr = placeInfo.location?.address.split(" ");
    console.log(25, study);
    return {
      place: {
        name: placeInfo.location.name,
        branch: textArr?.[0] + " " + textArr?.[1],
        address: placeInfo.location?.address,
        date: dayjs(data.date),
        imageProps: {
          image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),

          isPriority: idx < 4,
        },
        _id: placeInfo._id,
      },
      participants: study.members.map((att) => att.user),
      url:
        `/study/${placeInfo._id}/${data.date}?type=${data.study.status}` +
        (pathHome ? "&path=home" : ""),
      studyType: data.study.status,
      isMyStudy: study.members.map((member) => member.user._id).includes(myId),
      isFutureDate: dayjs(data.date).hour(9).isAfter(dayjs()),
      func,
    };
  });

  return [...basicThumbnailCard, ...cardColData];
};

export const sortThumbnailCardInfoArr = (
  sortedOption: "날짜순" | "거리순" | "인원순",
  arr: StudyThumbnailCardProps[],
  userId: string,
) => {
  if (sortedOption === "날짜순") {
    return [...arr].sort((a, b) => {
      // 1️⃣ date가 없는 경우가 가장 앞
      if (!a.place.date && b.place.date) return -1;
      if (a.place.date && !b.place.date) return 1;

      // 2️⃣ 둘 다 date가 있는 경우 날짜순
      if (a.place.date && b.place.date) {
        if (a.place.date.isBefore(b.place.date)) return -1;
        if (a.place.date.isAfter(b.place.date)) return 1;
      }

      // 3️⃣ 날짜가 같다면 인원 많은 순
      return b.participants.length - a.participants.length;
    });
  }

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
