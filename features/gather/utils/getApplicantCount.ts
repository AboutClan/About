export const getApplicantCount = (
  participantsCnt: number,
  waitingCnt: number,
  gatherId: number,
) => participantsCnt * 2 + waitingCnt + (gatherId % 10);
