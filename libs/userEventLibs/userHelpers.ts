import { IScore } from "../../types/services/pointSystem";

export const myScoreRank = (scoreArr: IScore[], myScore: number) => {
  let highCnt = 0;
  const total = scoreArr.length;
  scoreArr.forEach((user) => {
    if (user.score >= myScore) highCnt++;
  });
  const rate = (highCnt / total) * 100;
  if (rate < 1) return 1;
  if (rate < 5) return 5;
  if (rate < 10) return 10;
  else return Math.ceil(rate / 10) * 10;
};

export const getUserMonthTicket = (
  temperature: number,
): { gatherTicket: number; groupStudyTicket: number } => {
  let gather = 0;
  let group = 0;

  if (temperature < 36.5) {
    gather = 1;
    group = 2;
  } else if (temperature < 38) {
    gather = 2;
    group = 3;
  } else if (temperature < 40) {
    gather = 2;
    group = 4;
  } else if (temperature < 42) {
    gather = 4;
    group = 5;
  } else {
    gather = 4;
    group = 6;
  }
  return { gatherTicket: gather, groupStudyTicket: group };
};
