import { IParticipation, StudyStatus } from "../../types/models/studyTypes/studyDetails";

export const sortStudyVoteData = (participations: IParticipation[], isConfirmed?: boolean) => {
  const getCount = (participation: IParticipation) => {
    if (!isConfirmed) return participation.attendences.length;
    return participation.attendences.filter((who) => who.firstChoice).length;
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

  const sortedData = participations
    .map((par) => ({
      ...par,
      attendences: par.attendences.filter((who) => (isConfirmed ? who.firstChoice : true)),
    }))
    .sort((a, b) => {
      const aStatusPriority = getStatusPriority(a.status);
      const bStatusPriority = getStatusPriority(b.status);
      if (aStatusPriority !== bStatusPriority) return aStatusPriority - bStatusPriority;

      return getCount(b) - getCount(a);
    });

  return isConfirmed ? sortedData : sortedData.filter((par) => par.place.brand !== "자유 신청");
};
