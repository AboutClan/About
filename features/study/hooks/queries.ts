import axios, { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, UseQueryOptions } from "react-query";

import {
  STUDY_ARRIVED_CNT,
  STUDY_PLACE,
  STUDY_PREFERENCE,
  STUDY_RECORD_MODAL_AT,
  STUDY_VOTE,
  STUDY_VOTE_CNT,
} from "@/constants/keys/queryKeys";
import { SERVER_URI } from "@/constants/system";
import {
  injectPromoLastWeek,
  injectPromoPassedDay,
  injectPromoWeek,
  IS_PROMO_STUDY_MOCK,
  maskPromoName,
  toPromoRealDate,
  toPromoUser,
} from "@/features/study/lib/promoStudyMock";
import { setStudyOneDayData, setStudyWeekData } from "@/features/study/lib/studyConverters";
import { CoordinatesProps, TimeRangeProps } from "@/types/common";
import { QueryOptions } from "@/types/hooks/reactTypes";
import { PlaceProps } from "@/types/models/studyTypes/entityTypes";
import {
  RealTimesStudyStatus,
  StudyPlaceFilter,
  StudyPlaceProps,
  StudyRatingProps,
} from "@/types/models/studyTypes/study-entity.types";
import {
  StudySetProps,
  StudyWeekSetProps,
} from "@/types/models/studyTypes/study-set.types";
import { IStudyVotePlaces } from "@/types/models/studyTypes/studyInterActions";
import {
  IArrivedInfoList,
  VoteCntProps,
} from "@/types/models/studyTypes/studyRecords";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "@/utils/dateTimeUtils";

export interface StudySetInitialDataProps {
  date: string;
  realTimes: InitialRealTimesProps[];
  participations: InitialParticipationsProps[];
  results: {
    center?: CoordinatesProps;
    members: { time: TimeRangeProps; user: UserSimpleInfoProps }[];
    place: StudyPlaceProps;
  }[];
  unmatchedUsers: UserSimpleInfoProps[];
  status: "expected" | "open";
}

export interface InitialParticipationsProps {
  start: string;
  end: string;
  locationDetail: string;
  latitude: number;
  longitude: number;
  user: UserSimpleInfoProps;
  isBeforeResult: boolean;
  /** 매칭 기준점 1~2개. 서버가 없으면 flat 좌표로 정규화해 내려준다. */
  anchors?: { latitude: number; longitude: number; locationDetail?: string }[];
  /** 매칭 반경(km). 서버 판정 반경은 여기에 +0.1km. */
  eps?: number;
}

export interface InitialRealTimesProps {
  user: UserSimpleInfoProps;
  time: TimeRangeProps;
  status: RealTimesStudyStatus;
  place: StudyPlaceProps;
  heartCnt?: number;
  attendance: {
    attendanceImage: string;
    memo: string;
    time: string;
    type: "arrived" | "absenced";
  };
  comment?: { text: string };
}

type StudyWeekQueryOptions = Omit<
  UseQueryOptions<StudySetInitialDataProps[], AxiosError, StudyWeekSetProps>,
  "queryKey" | "queryFn" | "select"
>;

const studyWeekCacheMap = new WeakMap<
  StudySetInitialDataProps[], // 서버 원본 배열 "참조" 키
  Map<string, StudyWeekSetProps> // dateKey별 결과 저장
>();

export const useStudySetQuery = (date: string, options?: StudyWeekQueryOptions) =>
  useQuery<StudySetInitialDataProps[], AxiosError, StudyWeekSetProps>(
    [STUDY_VOTE, "week"],
    async () => {
      const { data } = await axios.get<StudySetInitialDataProps[]>(`${SERVER_URI}/vote2/week`);

      return IS_PROMO_STUDY_MOCK ? injectPromoWeek(data) : data;
    },
    {
      select: (data) => {
        if (dayjs(date).startOf("day").isBefore(dayjs().startOf("day"))) return null;
        let byDate = studyWeekCacheMap.get(data);
        if (!byDate) {
          byDate = new Map();
          studyWeekCacheMap.set(data, byDate);
        }
        const cached = byDate.get(date);
        if (cached) return cached;

        // 4) 미스 시: 계산해서 캐싱 후 반환
        const dateStart = dayjs(date).startOf("day");
        const filtered = data.filter((d) => !dayjs(d.date).startOf("day").isBefore(dateStart));
        const result = setStudyWeekData(filtered);

        byDate.set(date, result);

        return result;
      },
      ...options,
    },
  );
export const useLastStudySetQuery = (idx: number, options?: StudyWeekQueryOptions) =>
  useQuery<StudySetInitialDataProps[], AxiosError, StudySetProps>(
    [STUDY_VOTE, "lastWeek", idx],
    async () => {
      const { data } = await axios.get<StudySetInitialDataProps[]>(
        `${SERVER_URI}/vote2/${idx}/lastWeek`,
      );
      return IS_PROMO_STUDY_MOCK ? injectPromoLastWeek(data) : data;
    },
    {
      select: (data) => {
        let byDate = studyWeekCacheMap.get(data);
        if (!byDate) {
          byDate = new Map();
          studyWeekCacheMap.set(data, byDate);
        }

        const result = setStudyWeekData(data);

        return result;
      },
      ...options,
    },
  );

export interface InitialStudyPassedDayProps {
  realTimes: {
    userList: InitialStudyPassedDayUserProps[];
  };
  results: {
    center?: CoordinatesProps;
    members: { time: TimeRangeProps; user: UserSimpleInfoProps }[];
    place: StudyPlaceProps;
  }[];
}

export interface InitialStudyPassedDayUserProps {
  attendance: {
    attendanceImage: string;
    memo: string;
    time: string;
    type: "arrived" | "absenced";
  };
  place: StudyPlaceProps;
  comment?: { text: string };
  heartCnt: number;
  status: RealTimesStudyStatus;
  time: TimeRangeProps;
  user: UserSimpleInfoProps;
}

export const useStudyPassedDayQuery = (date: string, options?: QueryOptions<StudySetProps>) =>
  useQuery<StudySetProps, AxiosError, StudySetProps>(
    [STUDY_VOTE, date],
    async () => {
      const realDate = toPromoRealDate(date);
      const { data } = await axios.get<InitialStudyPassedDayProps>(
        `${SERVER_URI}/vote2/${realDate}/info`,
      );

      return setStudyOneDayData(
        IS_PROMO_STUDY_MOCK ? await injectPromoPassedDay(data, realDate) : data,
        date,
      );
    },
    options,
  );

interface StudyMineProps {
  date: string;
  results: {
    members: {
      userId: UserSimpleInfoProps;
      arrived?: string;
    }[];
    placeId: StudyPlaceProps;
    reviewers: string[];
  }[];
}

export const useStudyMineQuery = (options?: QueryOptions<StudyMineProps[]>) =>
  useQuery<StudyMineProps[], AxiosError, StudyMineProps[]>(
    [STUDY_VOTE, "mine"],
    async () => {
      const { data } = await axios.get<StudyMineProps[]>(`${SERVER_URI}/vote2/mine`);

      return data;
      // return setStudyOneDayData(data, date);
    },
    options,
  );

export interface StudyBadgeRankProps {
  rank: number;
  user: UserSimpleInfoProps;
  badgeCnt: number;
}

export interface StudyBadgeRankingProps {
  ranking: StudyBadgeRankProps[];
  /** 배지가 0개면 null. 목록(50명) 밖이어도 계산돼 온다. */
  myRank: number | null;
  myBadgeCnt: number;
}

/** 이번 달 스터디 배지 랭킹. 상품 구간이 50등까지라 서버 기본값도 50명이다. */
export const useStudyBadgeRankingQuery = (
  options?: QueryOptions<StudyBadgeRankingProps>,
) =>
  useQuery<StudyBadgeRankingProps, AxiosError, StudyBadgeRankingProps>(
    [STUDY_VOTE, "badgeRanking"],
    async () => {
      const { data } = await axios.get<StudyBadgeRankingProps>(
        `${SERVER_URI}/vote2/badge-ranking`,
      );
      return data;
    },
    options,
  );

export interface StudyRegionMemberProps {
  user: Pick<UserSimpleInfoProps, "_id" | "name" | "avatar" | "profileImage" | "role" | "uid"> & {
    nickname?: string;
  };
  /** 이번 주(오늘 이후)에 신청이 있다. */
  isApplying: boolean;
}

export interface StudyRegionMembersProps {
  /** 멤버가 많은 순. 구마다 앞쪽 일부 멤버만 온다(count가 전체 인원). */
  regions: {
    name: string;
    count: number;
    applyingCount: number;
    members: StudyRegionMemberProps[];
  }[];
}

/** 라운지 "지역 멤버" 탭: 구마다 스터디를 신청해 본 멤버(미니 프로필). */
export const useStudyRegionMembersQuery = (options?: QueryOptions<StudyRegionMembersProps>) =>
  useQuery<StudyRegionMembersProps, AxiosError, StudyRegionMembersProps>(
    [STUDY_VOTE, "regionMembers"],
    async () => {
      const { data } = await axios.get<StudyRegionMembersProps>(
        `${SERVER_URI}/vote2/region-members`,
      );
      if (!IS_PROMO_STUDY_MOCK) return data;
      return {
        ...data,
        regions: data.regions.map((region) => ({
          ...region,
          members: region.members.map((member) => ({
            ...member,
            user: {
              ...toPromoUser(member.user, true),
              nickname: maskPromoName(member.user.nickname),
            },
          })),
        })),
      };
    },
    options,
  );

export interface StudyCrewMemberStatsProps {
  userId: string;
  lastVoteDate: string | null;
  lastParticipationDate: string | null;
  voteCount: number;
  participationCount: number;
}

export const useStudyCrewStatsQuery = (
  userIds: string[],
  options?: QueryOptions<StudyCrewMemberStatsProps[]>,
) =>
  useQuery<StudyCrewMemberStatsProps[], AxiosError>(
    [STUDY_VOTE, "crewStats", userIds],
    async () => {
      const { data } = await axios.post<StudyCrewMemberStatsProps[]>(
        `${SERVER_URI}/vote2/crew-stats`,
        { userIds, days: 30 },
      );
      return data;
    },
    options,
  );

export const useStudyNearPlaceQuery = (
  placeId: string,
  options?: QueryOptions<StudyPlaceProps[]>,
) =>
  useQuery<StudyPlaceProps[], AxiosError, StudyPlaceProps[]>(
    [STUDY_PLACE, placeId],
    async () => {
      const res = await axios.get<StudyPlaceProps[]>(`${SERVER_URI}/place/one`, {
        params: {
          placeId,
        },
      });

      return res.data;
    },
    options,
  );
export const useStudyPlacesQuery = (
  status: StudyPlaceFilter,
  options?: QueryOptions<StudyPlaceProps[]>,
) =>
  useQuery<StudyPlaceProps[], AxiosError, StudyPlaceProps[]>(
    [STUDY_PLACE, status],
    async () => {
      const res = await axios.get<StudyPlaceProps[]>(`${SERVER_URI}/place`, {
        params: {
          status,
        },
      });

      return res.data;
    },
    options,
  );
export const useStudyPlacesCursorQuery = (
  cursor: number,
  options?: QueryOptions<StudyPlaceProps[]>,
) =>
  useQuery<StudyPlaceProps[], AxiosError, StudyPlaceProps[]>(
    [STUDY_PLACE, "cursor", cursor],
    async () => {
      const res = await axios.get<StudyPlaceProps[]>(`${SERVER_URI}/place/cursor`, {
        params: { cursor },
      });

      return res.data;
    },
    options,
  );

export interface StudyReviewProps {
  placeInfo: StudyPlaceProps;
  rating: StudyRatingProps;
}

export const useStudyReviewsQuery = (cursor: number, options?: QueryOptions<StudyReviewProps[]>) =>
  useQuery<StudyReviewProps[], AxiosError, StudyReviewProps[]>(
    [STUDY_PLACE, "review", cursor],
    async () => {
      const res = await axios.get<StudyReviewProps[]>(`${SERVER_URI}/place/ratings`, {
        params: { cursor },
      });
      return res.data;
    },
    options,
  );

export const useStudyNewPlacesQuery = (cursor: number, options?: QueryOptions<StudyPlaceProps[]>) =>
  useQuery<StudyPlaceProps[], AxiosError, StudyPlaceProps[]>(
    [STUDY_PLACE, "new", cursor],
    async () => {
      const res = await axios.get<StudyPlaceProps[]>(`${SERVER_URI}/place/new`, {
        params: { cursor },
      });
      return res.data;
    },
    options,
  );

// export const useStudyVoteOneQuery = (
//   date: string,
//   options?: QueryOptions<{
//     data: StudyParticipationProps;
//     rankNum: number;
//   }>,
// ) =>
//   useQuery<
//     { data: StudyParticipationProps; rankNum: number },
//     AxiosError,
//     { data: StudyParticipationProps; rankNum: number }
//   >(
//     [STUDY_VOTE, date, "one"],
//     async () => {
//       const res = await axios.get<{
//         data: StudyParticipationProps | any[];
//         rankNum: number;
//       }>(`${SERVER_URI}/vote2/${date}/one`, {});
//       return res.data;
//     },
//     options,
//   );

/** `GET /vote2/record` 응답. `date`는 `YYYY-MM-DD` 문자열이다. */
export interface StudyAttendRecordProps {
  date: string;
  arrivedInfoList: IArrivedInfoList[];
}

export const useStudyAttendRecordQuery = (
  startDay: Dayjs,
  endDay: Dayjs,
  options?: QueryOptions<StudyAttendRecordProps[]>,
) =>
  useQuery(
    [STUDY_RECORD_MODAL_AT, dayjsToStr(startDay), dayjsToStr(endDay)],
    async () => {
      // 예전 경로는 `GET /vote/arrived`였는데 백엔드에 `vote` 컨트롤러가 없어 항상 실패했다.
      const res = await axios.get<StudyAttendRecordProps[]>(`${SERVER_URI}/vote2/record`, {
        params: {
          startDay: dayjsToStr(startDay),
          endDay: dayjsToStr(endDay),
        },
      });
      return res.data;
    },
    options,
  );

interface IArrivedTotal {
  [key: string]: number;
}
export const useStudyArrivedCntQuery = (uid: string, options?: QueryOptions<number>) =>
  useQuery(
    [STUDY_ARRIVED_CNT, uid],
    async () => {
      if (!uid) return;
      const res = await axios.get<IArrivedTotal>(`${SERVER_URI}/vote/arriveCnt`);
      return res.data?.[uid];
    },
    options,
  );

export interface MyCafePlaceProps {
  registeredPlaces: PlaceProps[];
  myRatings: { rating: StudyRatingProps }[];
}

export const useMyPlaceQuery = (options?: QueryOptions<MyCafePlaceProps>) =>
  useQuery(
    ["place", "mine"],
    async () => {
      const res = await axios.get<MyCafePlaceProps>(`${SERVER_URI}/place/my`);
      return res.data;
    },
    options,
  );
export const usePlaceRankingQuery = (
  options?: QueryOptions<{ place: PlaceProps; totalScore: number }[]>,
) =>
  useQuery(
    ["place", "ranking"],
    async () => {
      const res = await axios.get<{ place: PlaceProps; totalScore: number }[]>(
        `${SERVER_URI}/place/ranking`,
      );
      return res.data;
    },
    options,
  );

export interface MyPlaceFavoritesProps {
  likes: StudyPlaceProps[];
  picks: StudyPlaceProps[];
}

export const useMyPlaceFavoritesQuery = (options?: QueryOptions<MyPlaceFavoritesProps>) =>
  useQuery<MyPlaceFavoritesProps, AxiosError, MyPlaceFavoritesProps>(
    ["place", "my-favorites"],
    async () => {
      const res = await axios.get<MyPlaceFavoritesProps>(`${SERVER_URI}/place/my-favorites`);
      return res.data;
    },
    options,
  );

export const useStudyPreferenceQuery = (options?: QueryOptions<IStudyVotePlaces>) =>
  useQuery(
    [STUDY_PREFERENCE],
    async () => {
      const res = await axios.get<{ studyPreference: IStudyVotePlaces }>(
        `${SERVER_URI}/user/preference`,
      );
      return res.data?.studyPreference;
    },
    options,
  );

export const useStudyDailyVoteCntQuery = (
  location,
  startDay,
  endDay,
  options?: QueryOptions<VoteCntProps[]>,
) =>
  useQuery(
    [STUDY_VOTE_CNT, location, dayjsToStr(startDay), dayjsToStr(endDay)],
    async () => {
      const res = await axios.get<VoteCntProps[]>(`${SERVER_URI}/vote/participationCnt`, {
        params: {
          location,
          startDay: dayjsToStr(startDay),
          endDay: dayjsToStr(endDay),
        },
      });
      return res.data;
    },
    options,
  );
