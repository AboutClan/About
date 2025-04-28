export const USER_SCORE_BADGE_ARR = [
  "아메리카노",
  "망고",
  "그린티",
  "블루레몬",
  "라즈베리",
  "페퍼민트",
  "홍차",
  "에스프레소",
] as const;

export const USER_BADGE_ARR = [
  ...USER_SCORE_BADGE_ARR,
  "라벤더",
  "딸기스무디",
  "코코아",
  "모히또",
  "민트초코",
  "슈팅스타",
  "바닐라",
] as const;

export const BADGE_SCORE_MAPPINGS: {
  [key in (typeof USER_SCORE_BADGE_ARR)[number]]: number;
} = {
  아메리카노: 0,
  망고: 30,
  그린티: 60,
  블루레몬: 90,
  라즈베리: 120,
  페퍼민트: 150,
  홍차: 180,
  에스프레소: 210,
};
export const BADGE_COLOR_MAPPINGS: {
  [key in (typeof USER_BADGE_ARR)[number]]: string;
} = {
  아메리카노: "gray",
  코코아: "badgeBrown",
  망고: "orange",
  그린티: "green",
  블루레몬: "blue",
  라즈베리: "red",
  페퍼민트: "teal",
  홍차: "pink",
  에스프레소: "purple",
  바닐라: "yellow",
  라벤더: "facebook",
  딸기스무디: "badgePink",
  민트초코: "badgeMint",
  슈팅스타: "badgeOcean",
  모히또: "badgeMojito",
};

export const BADGE_INFO = Object.entries(BADGE_SCORE_MAPPINGS).map(([badge, minScore]) => ({
  badge,
  minScore,
}));
