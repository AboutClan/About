import {
  BookIcon,
  DiceIcon,
  ExerciseIcon,
  SeedIcon,
  SocialIcon,
} from "./GatherContents";

export type GroupCategoryMain = "공부·자기계발" | "취미" | "문화·놀거리" | "친목" | "스터디 크루";

//그룹(동아리) 카테고리
export const GROUP_TYPES: { title: GroupCategoryMain; subtitle: string }[] = [
  { title: "공부·자기계발", subtitle: "카공 · 자격증 · 독서 · 습관 등" },
  { title: "취미", subtitle: "댄스 · 출사 · 요리 · 그림 · 클라이밍 · 오운완 등" },
  { title: "문화·놀거리", subtitle: "방탈출 · 보드게임 · 볼링 등" },
  { title: "친목", subtitle: "술자리 · 또래 친구 · 네트워킹 등" },
  { title: "스터디 크루", subtitle: "동네에서 함께 카공하는 크루 모임" },
];

export const GroupCategoryIcons = [
  <BookIcon key="book" />,
  <ExerciseIcon key="exercise" />,
  <DiceIcon key="dice" />,
  <SocialIcon key="social" />,
  <SeedIcon key="seed" />,
];
