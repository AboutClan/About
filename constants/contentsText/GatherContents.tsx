import { COLOR_400_ARR } from "../colorConstants";

export type GatherCategoryMain =
  | "푸드"
  | "소셜 게임"
  | "감상"
  | "친목"
  | "스터디"
  | "자기계발"
  | "운동"
  | "파티"
  | "힐링"
  | "말하기"
  | "기타";

//모임 카테고리
export const GATHER_TYPES: { title: GatherCategoryMain; subtitle: string }[] = [
  { title: "푸드", subtitle: "맛집탐방 · 디저트 · 요리 등" },
  { title: "감상", subtitle: "영화 · 연극 · 음악 · 전시 등" },
  { title: "친목", subtitle: "술자리 · 또래 친구 · 네트워킹 등" },
  { title: "소셜 게임", subtitle: "보드게임 · 방 탈출 · 액티비티 게임 등" },
  { title: "스터디", subtitle: "카공 · 영어 · 시험 준비 · 자격증 등" },
  { title: "운동", subtitle: "산책 · 러닝 · 헬스 · 구기종목 등 " },
  { title: "힐링", subtitle: "여행 · 출사 · 피크닉 등" },
  { title: "파티", subtitle: "파티룸 · 컨셉 파티 · 소셜 파티 등" },
  { title: "자기계발", subtitle: "독서 · 습관 · 라이프스타일 등" },
  { title: "말하기", subtitle: "토론 · 스피치 · 토크 등" },
  { title: "기타", subtitle: "그 외" },
  /**
   * 취미 1: 푸드, 감상, 소셜 게임
   * 스터디: 스터디
   * 자기계발:
   */

  // { title: "취미", subtitle: "보드게임 · 방탈출 · 볼링" },
  // { title: "맛집 탐방", subtitle: "맛집투어 · 카페 · 디저트" },
  // { title: "스터디", subtitle: "카공 · 스터디카페 · 도서관" },
  // { title: "술 번개", subtitle: "친목 & 술자리" },
  // { title: "운동", subtitle: "러닝 · 산책 · 클라이밍 · 헬스" },
  // { title: "문화·예술", subtitle: "영화 · 전시 · 연극 · 뮤지컬" },
  // { title: "게임", subtitle: "PC · 모바일 · 콘솔" },
  // { title: "힐링", subtitle: "피크닉 · 캠핑 · 드라이브" },
  // { title: "기타", subtitle: "" },
];

export const GatherCategoryIcons = [
  <i key={1} className="fa-solid fa-burger-soda" style={{ color: `${COLOR_400_ARR[0]}` }} />,
  <i key={2} className="fa-solid fa-icons " style={{ color: `${COLOR_400_ARR[1]}` }}></i>,
  <i key={3} className="fa-solid fa-dice" style={{ color: `${COLOR_400_ARR[3]}` }}></i>,
  <i key={4} className="fa-solid fa-camera-movie" style={{ color: `${COLOR_400_ARR[5]}` }}></i>,
  <i key={5} className="fa-solid fa-champagne-glasses" style={{ color: `${COLOR_400_ARR[7]}` }} />,
  <i key={6} className="fa-solid fa-graduation-cap" style={{ color: `${COLOR_400_ARR[2]}` }}></i>,
  <i key={7} className="fa-solid fa-seedling" style={{ color: `${COLOR_400_ARR[4]}` }}></i>,
  <i key={8} className="fa-solid fa-person-running" style={{ color: `${COLOR_400_ARR[6]}` }} />,
  <i key={9} className="fa-solid fa-party-horn" style={{ color: `${COLOR_400_ARR[7]}` }}></i>,
  <i key={10} className="fa-solid fa-bench-tree" style={{ color: `${COLOR_400_ARR[3]}` }}></i>,
  <i key={11} className="fa-solid fa-atom" style={{ color: `var(--color-gray)` }} />,
];
