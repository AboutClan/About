import dayjs from "dayjs";
import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyResultProps } from "../../types/models/studyTypes/baseTypes";
import { StudySetProps } from "../../types/models/studyTypes/derivedTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
import { RealTimesToResultProps } from "./studyConverters";

export const setStudyThumbnailCard = (
  date: string,
  studySet: StudySetProps,

  myId: string,
): StudyThumbnailCardProps[] => {
  const { participations, openRealTimes, soloRealTimes, results } = studySet;
  const isPassedDate = date ? dayjs(date).isBefore(dayjs(), "day") : false;

  const basicThumbnailCard: StudyThumbnailCardProps[] = !isPassedDate
    ? [
        {
          place: {
            name: "카공 스터디 매칭 신청",
            branch: "위치 선정 중",
            address: "가까운 인원들과 스터디를 매칭하고 있어요",
            date: "",
            imageProps: {
              image:
                "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%85%B8%ED%8A%B8%EB%B6%81_100px_%ED%88%AC%EB%AA%85.png",
              isPriority: true,
            },
            _id: "",
          },
          participants: Array.from(
            new Map(participations.map((par) => [par.study.user._id, par.study.user])).values(),
          ),
          url: `/study/participations/${date}?type=participations`,
          status: "participations",
          isMyStudy: false,
        },
      ]
    : soloRealTimes
    ? [
        {
          place: {
            name: "개인 스터디 인증",
            branch: "자유 카페",
            address: "개인 공부 인증하고, 혜택 받아 가세요",
            date: "",
            imageProps: {
              image:
                "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%BA%90%EB%A6%AD%ED%84%B0/%EC%95%84%EB%B0%94%ED%83%80/%EB%B3%91%EC%95%84%EB%A6%AC_%EC%B1%85.png",
              isPriority: true,
            },
            _id: "",
          },
          participants: soloRealTimes?.map((par) => par.study.user),
          url: `/study/realTime/${date}?type=soloRealTimes`,
          status: "soloRealTimes",
          isMyStudy: false,
        },
      ]
    : [];

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
      const study1 = study as RealTimesToResultProps;
      const placeInfo = study1.place;

      const textArr = placeInfo.address.split(" ");
      return {
        place: {
          name: placeInfo.name,
          branch: textArr?.[0] + " " + textArr?.[1],
          // locationMapping === null
          //   ? placeInfo?.branch
          //   : locationMapping?.find((mapping) => mapping.id === placeInfo._id)?.branch,
          address: placeInfo.address,
          date: dayjsToFormat(dayjs(data.date).locale("ko"), "M.D(ddd)"),
          imageProps: {
            image: getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),
            isPriority: idx < 4,
          },
          _id: placeInfo._id,
        },
        participants: study1.members.map((att) => att.user),
        url: `/study/${placeInfo._id}/${data.date}?type=openRealTimes`,
        status: "openRealTimes",
        isMyStudy: study1.members.map((member) => member.user._id).includes(myId),
      };
    } else {
      const study2 = study as StudyResultProps;
      const placeInfo = study2.place;
      console.log(52, study2);
      return {
        place: {
          name: placeInfo.fullname,
          branch: placeInfo.branch || "23",
          address: placeInfo.locationDetail,
          date: dayjsToFormat(dayjs(data.date).locale("ko"), "M.D(ddd)"),
          imageProps: {
            image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["스터디"]),
            isPriority: idx < 4,
          },
          _id: placeInfo._id,
        },
        participants: study2.members.map((att) => att.user),
        url: `/study/${placeInfo._id}/${data.date}?type=${
          data.date === dayjsToStr(dayjs()) ? "voteResult" : "expectedResult"
        }`,
        status: data.date === dayjsToStr(dayjs()) ? "voteResult" : "expectedResult",
        isMyStudy: study2.members.map((member) => member.user._id).includes(myId),
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
