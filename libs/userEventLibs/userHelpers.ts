import { RankingCategorySource } from "../../pages/ranking";
import { IMyRank } from "../../types/models/ranking";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
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

export interface RankingUserProp extends IUserSummary {
  cnt: number;
}
export interface IUserRankings {
  mine: IMyRank;
  users: RankingUserProp[] | IUserSummary[];
}

export const sortUserRanking = (
  users: RankingUserProp[] | IUserSummary[],
  type: RankingCategorySource,
  uid: string,
): IUserRankings => {
  let myValue = null;

  const compareRanking = (a: RankingUserProp, b: RankingUserProp) => {
    const firstValue = a[type];
    const secondValue = b[type];

    if (myValue === null) {
      if (a.uid === uid) myValue = firstValue;
      if (b.uid === uid) myValue = secondValue;
    }
    if (firstValue > secondValue) return -1;
    else if (firstValue < secondValue) return 1;
    return 0;
  };

  let myRankNum = 1;

  users.sort(compareRanking);

  if (myValue)
    users.forEach((user) => {
      if (user[type] > myValue) myRankNum++;
    });

  return {
    users: users,
    mine: {
      rankNum: !myValue ? -1 : myRankNum,
      value: myValue,
    },
  };
};
