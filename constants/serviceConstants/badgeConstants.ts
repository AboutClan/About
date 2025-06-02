export const USER_BADGE_ARR = [
  "뉴비",
  "대학생",
  "휴학생",
  "졸업생",
  "열공러",
  "칠가이",
  "프로참석러",
  "슈퍼스타",
  "공주",
  "HOT",
  "서포터즈",
  "운영진",
] as const;

export const BADGE_COLOR_MAPPINGS: {
  [key in (typeof USER_BADGE_ARR)[number]]: string;
} = {
  뉴비: "yellow",
  대학생: "green",
  휴학생: "blue",
  졸업생: "orange",
  열공러: "purple",
  칠가이: "badgeBrown",
  공주: "badgePink",
  프로참석러: "badgeMojito",
  슈퍼스타: "badgeOcean",
  HOT: "red",
  서포터즈: "badgeSunset",
  운영진: "badgeMint",
};
