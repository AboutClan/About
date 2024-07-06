import { TABLE_COLORS } from "../styles";

type Content = {
  content: string;
  start: number;
  end: number;
  color: string;
  text: string;
  blockIdx?: number;
};

export const EVENT_CONTENT_2023: Record<string, Content[]> = {
  10: [
    {
      content: "[10월] 에타 홍보 이벤트 추첨",
      start: 22,
      end: 24,
      color: TABLE_COLORS[2],
      text: "에타에 동아리 홍보글을 올려주시면 100 포인트와 추첨을 통해 치킨 기프티콘을 드려요!",
    },
    {
      content: "[시험기간] 랜덤선물 이벤트",
      start: 16,
      end: 22,
      color: TABLE_COLORS[0],
      text: "항상 돌아오는 시험기간 파이팅 이벤트... 매일 단톡방에서 랜덤한 선착순 선물을 뿌립니다!",
    },
    {
      content: "[시험기간] 스터디 투표 2배 이벤트 ",
      start: 16,
      end: 22,
      color: TABLE_COLORS[3],
      text: "시험 기간에 스터디에 투표하면 점수를 2배로 받아요!",
    },
    {
      content: "[오프라인] 번개 이벤트",
      start: 29,
      end: 31,
      color: TABLE_COLORS[6],
      text: "진행 예정",
    },
  ],
  11: [
    {
      content: "수원/안양 정기모임",
      start: 17,
      end: 18,
      color: TABLE_COLORS[2],
      text: "정기모임",
    },
    {
      content: "양천/강남",
      start: 18,
      end: 18,
      color: TABLE_COLORS[0],
      text: "정기모임",
    },
    {
      content: "정기 모임",
      start: 19,
      end: 19,
      color: TABLE_COLORS[0],
      text: "정기모임",
      blockIdx: 1,
    },
    {
      content: "11월 홍보 이벤트 당첨자 선별",
      start: 26,
      end: 30,
      color: TABLE_COLORS[3],
      text: "11월 홍보 이벤트 당첨자 선별",
    },
  ],
  12: [
    {
      content: "시험 기간 이벤트",
      start: 4,
      end: 8,
      color: TABLE_COLORS[0],
      text: "이벤트",
    },
    {
      content: "홍보 이벤트 추첨",
      start: 22,
      end: 24,
      color: TABLE_COLORS[1],
      text: "이벤트",
    },
    {
      content: "수원/강남 펭귄 핫팩",
      start: 17,
      end: 31,
      color: TABLE_COLORS[2],
      text: "이벤트",
    },
  ],
};

export const EVENT_CONTENT_2024: Record<string, Content[]> = {
  6: [
    {
      content: "시험기간 응원 선물 이벤트",
      start: 10,
      end: 14,
      color: "var(--color-blue)",
      text: "시험기간 응원 기념으로 매일 단톡방에서 기프티콘을 뿌립니다!",
    },
    {
      content: "동아리 1차 용인 MT",
      start: 25,
      end: 26,
      color: "var(--color-mint)",
      text: "",
    },
    {
      content: "모임 활성화 이벤트",
      start: 19,
      end: 20,
      color: "var(--color-blue)",
      text: "이제 종강하고 동아리 내에서 본격적으로 다양한 모임을 진행해보려고 하는데요! 모임을 개최하고 진행해주시는 분께는 매번 5000원의 지원금을 드립니다!",
    },
    {
      content: "소모임 개설 기간",
      start: 24,
      end: 30,
      color: "var(--color-orange)",
      text: "방학동안 스터디 뿐만 아니라 다양한 장르의 그룹을 활성화 해보려고 해요! 토익, 자격증 등의 스터디 뿐만 아니라 카페 탐방, 영화 관람, 보드게임, 러닝, 취미 활동 등 모든 모임 개설이 가능합니다. 모임장에게는 2만원씩 지원 혜택이 있습니다.",
    },
    {
      content: "홍보 이벤트",
      start: 24,
      end: 30,
      color: "var(--color-blue)",
      text: "에타 홍보에 참여하고 상품 받아가세요! 총 10만원 쏩니다!",
    },
  ],
  7: [
    {
      content: "동아리 2차 대성리 MT",
      start: 3,
      end: 4,
      color: "var(--color-mint)",
      text: "",
    },
    {
      content: "소모임 편성",
      start: 6,
      end: 7,
      color: "var(--color-orange)",
      text: "",
    },
    {
      content: "모임 활성화 이벤트",
      start: 8,
      end: 9,
      color: "var(--color-blue)",
      text: "",
    },
  ],
};

export const EVENT_ALWAYS = [
  {
    title: "[항시] 에타 홍보 이벤트",
    content:
      "이벤트 탭의 홍보게시판에 들어가서 동아리를 학교 에타에 홍보해주세요! 매번 100 POINT + 추첨을 통해 치킨 기프티콘도 드려요!",
  },
];
