export const getApplicantCount = (
  participantsCnt: number,
  waitingCnt: number,
  gatherId: number,
) => Math.ceil(participantsCnt / 2) + waitingCnt + (gatherId % 10);
