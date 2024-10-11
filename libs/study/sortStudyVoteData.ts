import { StudyParticipationProps, StudyStatus } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";

export const sortStudyVoteData = (
  participations: StudyParticipationProps[],
  preferPlaces?: IStudyVotePlaces,
  isConfirmed?: boolean,
) => {
  const getCount = (participation: StudyParticipationProps) => {
    if (!isConfirmed) return participation.members.length;
    return participation.members.filter((who) => who.firstChoice).length;
  };
  const getStatusPriority = (status: StudyStatus) => {
    switch (status) {
      case "open":
        return 1;
      case "free":
        return 2;
      default:
        return 3;
    }
  };

  const getPlacePriority = (placeId: string) => {
    if (!preferPlaces) return;
    if (placeId === preferPlaces.place) return 1; // main이면 가장 높은 우선순위
    if (preferPlaces.subPlace.includes(placeId)) return 2; // sub 배열에 있으면 그다음 우선순위
    return 3; // 그 외는 낮은 우선순위
  };

  const sortedData = participations
    .map((par) => ({
      ...par,
      members: par.members.filter((who) => (isConfirmed ? who.firstChoice : true)),
    }))
    .sort((a, b) => {
      const aStatusPriority = getStatusPriority(a.status);
      const bStatusPriority = getStatusPriority(b.status);
      if (aStatusPriority !== bStatusPriority) return aStatusPriority - bStatusPriority;
      const countDiff = getCount(b) - getCount(a);
      if (countDiff !== 0) return countDiff;
      const aPlacePriority = getPlacePriority(a.place._id);
      const bPlacePriority = getPlacePriority(b.place._id);

      return aPlacePriority - bPlacePriority;
    });

  return isConfirmed ? sortedData : sortedData.filter((par) => par.place.brand !== "자유 신청");
};
