import { BADGE_INFO } from "../constants/badge";
import {
  EVENT_BADGE_딸기스무디,
  EVENT_BADGE_라벤더,
} from "../storage/eventBadgeUser";
import { ISortedUserScores } from "../types/page/ranking";
import { IVoteRate } from "../types/study/studyRecord";
import { IScore } from "../types/user/pointSystem";
import { UserBadge } from "../types/user/user";

type DataArrMap = {
  score: IScore[];
  attend: IVoteRate[];
};

type SortUserScore = <T extends keyof DataArrMap>(
  scoreArr: DataArrMap[T],
  uid: string,
  type: T
) => void;

export const getUserBadge = (score: number, uid: string): UserBadge => {
  if (EVENT_BADGE_딸기스무디.includes(uid)) return "딸기스무디";
  if (EVENT_BADGE_라벤더.includes(uid)) return "라벤더";

  const { badge } = BADGE_INFO.find((_, idx) => {
    if (idx === BADGE_INFO.length - 1) return true;
    return score < BADGE_INFO[idx + 1].minScore;
  });
  return badge;
};

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
// scoreArr: IScore[] | IUser[] | IRankingUser[],
// uid: string,
// type: "score" | "attend"

//순위 백분율 반환
const setPercentRankValue = (rankNum: number, total: number) => {
  const rate = (rankNum / total) * 100;
  if (rate < 1) return 1;
  if (rate < 5) return 5;
  if (rate < 10) return 10;
  else return Math.ceil(rate / 10) * 10;
};

//유저 랭킹 정렬
export const sortUserScores = (
  scoreArr: IScore[],
  score: number
): ISortedUserScores => {
  const compare = (a: IScore, b: IScore) => {
    if (a.score > b.score) return -1;
    else if (a.score < b.score) return 1;
    return 0;
  };

  scoreArr.sort(compare);

  const rankNum =
    score !== 0 && scoreArr.findIndex((who) => who.score === score) + 1;

  if (rankNum <= 100)
    return {
      scoreArr,
      rankValue: rankNum,
      isRankNum: true,
    };
  return {
    scoreArr,
    rankValue: setPercentRankValue(rankNum, scoreArr.length),
    isRankNum: false,
  };
};

export const sortUserScore: SortUserScore = (scoreArr, uid, type) => {
  let myValue = null;

  const compareScore = (a: IScore, b: IScore) => {
    if (!myValue && a.uid === uid) myValue = a.score;
    if (a.score > b.score) return -1;
    else if (a.score < b.score) return 1;
    return 0;
  };

  const compareAttend = (a: IVoteRate, b: IVoteRate) => {
    if (!myValue && a.uid === uid) myValue = a.cnt;
    if (a.cnt > b.cnt) return -1;
    else if (a.cnt < b.cnt) return 1;
    return 0;
  };

  const total = scoreArr.length;
  let myRankNum = 0;
  let percent;

  if (type === "score") {
    (scoreArr as IScore[]).sort(compareScore);
    scoreArr.forEach((user) => {
      if (myValue !== null && user.score > myValue) myRankNum++;
    });

    if (myRankNum <= 100)
      return {
        scoreArr: scoreArr as IScore[],
        rankNum: myValue === 0 ? -1 : myRankNum,
        isRank: true,
        score: myValue,
      };
  }

  if (type === "attend") {
    (scoreArr as IVoteRate[]).sort(compareAttend);
    if (myValue !== 0)
      (scoreArr as IVoteRate[]).forEach((user) => {
        if (user.cnt > myValue) myRankNum++;
      });
    return {
      scoreArr: scoreArr as IVoteRate[],
      rankNum: myValue === 0 ? -1 : myRankNum,
      isRank: true,
      score: myValue,
    };
  }

  const rate = (myRankNum / total) * 100;
  if (rate < 1) percent = 1;
  if (rate < 5) percent = 5;
  if (rate < 10) percent = 10;
  else percent = Math.ceil(rate / 10) * 10;
  return {
    scoreArr,
    percent: myValue === 0 ? 100 : percent,
    isRank: false,
    score: myValue,
  };
};
