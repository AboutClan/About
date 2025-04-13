import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import {
  RealTimeMemberProps,
  RealTimesStatus,
  StudyMemberProps,
  StudyPlaceProps,
  StudyResultProps,
  StudyStatus,
  StudyVoteDataProps,
} from "../../types/models/studyTypes/baseTypes";
import {
  MergeStudyPlaceProps,
  StudyMergeResultProps,
} from "../../types/models/studyTypes/derivedTypes";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { getRandomIdx } from "../../utils/mathUtils";

export const convertStudyToMergeStudy = (
  studyVoteData: StudyVoteDataProps,
): StudyMergeResultProps[] => {
  const convertedRealTimes = studyVoteData?.realTimes
    ? convertRealTimesToMergeResult(studyVoteData.realTimes.userList)
    : [];
  const mergedResult = [...studyVoteData.results, ...convertedRealTimes].map((result) => ({
    ...result,
    place: convertMergePlaceToPlace(result.place),
    status: (result as RealTimesToResultProps)?.status || "open",
  }));
  console.log(123, mergedResult);
  return mergedResult;
};

interface RealTimesToResultProps extends Omit<StudyResultProps, "place"> {
  place: PlaceInfoProps;
  status?: StudyStatus;
}

export const convertRealTimesToMergeResult = (
  studyRealTimeArr: RealTimeMemberProps[],
): RealTimesToResultProps[] => {
  if (!studyRealTimeArr) return;
  const temp: {
    place: PlaceInfoProps;
    status: RealTimesStatus;
    members: StudyMemberProps[];
  }[] = [];
  studyRealTimeArr.forEach((props) => {
    const findParticipationIdx = temp.findIndex(
      (participation) => participation.place.name === props.place.name,
    );

    if (findParticipationIdx !== -1) {
      temp[findParticipationIdx].members.push(props);
    } else {
      temp.push({
        status: props.status,
        place: props.place,
        members: [props],
      });
    }
  });
  return [...temp].sort((a, b) => {
    const aCnt = a.members.length;
    const bCnt = b.members.length;
    if (aCnt > bCnt) return -1;
    else if (aCnt < bCnt) return 1;
    return 0;
  });
};

export const convertMergePlaceToPlace = (
  mergePlace: StudyPlaceProps | PlaceInfoProps,
): MergeStudyPlaceProps => {
  if (!mergePlace) return;
  const studyPlace = mergePlace as StudyPlaceProps;
  const realTimePlace = mergePlace as PlaceInfoProps;
  console.log(14, studyPlace, realTimePlace);
  return {
    name: studyPlace?.fullname || realTimePlace?.name,
    branch: studyPlace?.branch || realTimePlace?.name.split(" ")?.[1] || "알수없음",
    address: studyPlace?.locationDetail || realTimePlace?.address,
    brand: studyPlace?.brand || realTimePlace?.name.split(" ")?.[0] || "",
    image: studyPlace?.image || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length - 1)],
    coverImage:
      studyPlace?.coverImage || STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
    latitude: studyPlace.latitude,
    longitude: studyPlace.longitude,
    time: studyPlace?.time || "unknown",
    // type: studyPlace?.fullname
    //   ? "public"
    //   : realTimePlace?.name
    //   ? "private"
    //   : (null as "public" | "private"),

    _id: studyPlace?._id || realTimePlace?._id,
  };
};
