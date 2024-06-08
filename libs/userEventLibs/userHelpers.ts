import { IUserRankings } from "../../types/models/ranking";
import { IUser, IUserSummary } from "../../types/models/userTypes/userInfoTypes";
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

interface RankingUserProp extends IUserSummary {
  cnt: number;
}

export const sortUserRanking = (
  users: RankingUserProp[],
  type: "score" | "monthScore" | "cnt",
  uid: string,
): IUserRankings => {
  let myValue = null;
  const compareRanking = (a: RankingUserProp, b: RankingUserProp) => {
    const firstValue = type === "score" ? a.score : type === "monthScore";

    if (!myValue && (a.uid === uid || b.uid === uid)) {
      myValue = a.cnt;
    }
    if (a.cnt > b.cnt) return -1;
    else if (a.cnt < b.cnt) return 1;
    return 0;
  };

  let myRankNum = 0;

  users.sort(compareRanking);

  if (myValue !== 0)
    users.forEach((user) => {
      if (user.cnt > myValue) myRankNum++;
    });

  return {
    users: users,
    mine: {
      rankNum: myValue === 0 ? -1 : myRankNum,
      isRank: true,
      value: myValue,
    },
  };
};

export const sortUserScoreRanking = (users: IUser[], myScore: number): IUserRankings => {
  const compareRanking = (a: IUser, b: IUser) => {
    if (a.score > b.score) return -1;
    else if (a.score < b.score) return 1;
    return 0;
  };

  let myRankNum = 0;

  users.sort(compareRanking);

  if (myScore !== 0)
    users.forEach((user) => {
      if (user.score > myScore) myRankNum++;
    });

  return {
    users: users.map((user) => ({
      uid: user.uid,
      cnt: user.score,
      userSummary: user,
    })),
    mine: {
      rankNum: myScore === 0 ? -1 : myRankNum,
      isRank: true,
      value: myScore,
    },
  };
};
