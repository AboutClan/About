export interface CalendarContentProps {
  content: string;
  start: number;
  end: number;
  type?: "event" | "schedule" | "main";
  text?: string;
  blockIdx?: number;
  color?: string;
}

export const EVENT_CONTENT_2023: Record<string, CalendarContentProps[]> = {
  10: [
    {
      content: "[10월] 에타 홍보 이벤트 추첨",
      start: 22,
      end: 24,
      type: "event",
      text: "에타에 동아리 홍보글을 올려주시면 100 포인트와 추첨을 통해 치킨 기프티콘을 드려요!",
    },
    {
      content: "[시험기간] 랜덤선물 이벤트",
      start: 16,
      end: 22,
      type: "event",
      text: "항상 돌아오는 시험기간 파이팅 이벤트... 매일 단톡방에서 랜덤한 선착순 선물을 뿌립니다!",
    },
    {
      content: "[시험기간] 스터디 투표 2배 이벤트 ",
      start: 16,
      end: 22,
      type: "event",
      text: "시험 기간에 스터디에 투표하면 점수를 2배로 받아요!",
    },
    {
      content: "[오프라인] 번개 이벤트",
      start: 29,
      end: 31,
      type: "event",
      text: "진행 예정",
    },
  ],
  11: [
    {
      content: "수원/안양 정기모임",
      start: 17,
      end: 18,
      type: "schedule",
      text: "정기모임",
    },
    {
      content: "양천/강남",
      start: 18,
      end: 18,
      type: "schedule",
      text: "정기모임",
    },
    {
      content: "정기 모임",
      start: 19,
      end: 19,
      type: "schedule",
      text: "정기모임",
      blockIdx: 1,
    },
    {
      content: "11월 홍보 이벤트 당첨자 선별",
      start: 26,
      end: 30,
      type: "event",
      text: "11월 홍보 이벤트 당첨자 선별",
    },
  ],
  12: [
    {
      content: "시험 기간 이벤트",
      start: 4,
      end: 8,
      type: "event",
      text: "이벤트",
    },
    {
      content: "홍보 이벤트 추첨",
      start: 22,
      end: 24,
      type: "event",
      text: "이벤트",
    },
    {
      content: "수원/강남 펭귄 핫팩",
      start: 17,
      end: 31,
      type: "event",
      text: "이벤트",
    },
  ],
};

export const EVENT_CONTENT_2024: Record<string, CalendarContentProps[]> = {
  6: [
    {
      content: "시험기간 응원 선물 이벤트",
      start: 10,
      end: 14,
      type: "event",
      text: "시험기간 응원 기념으로 매일 단톡방에서 기프티콘을 뿌립니다!",
    },
    {
      content: "동아리 1차 용인 MT",
      start: 25,
      end: 26,
      type: "schedule",
      text: "",
    },
    {
      content: "모임 활성화 이벤트",
      start: 19,
      end: 20,
      type: "event",
      text: "이제 종강하고 동아리 내에서 본격적으로 다양한 모임을 진행해보려고 하는데요! 모임을 개최하고 진행해주시는 분께는 매번 5000원의 지원금을 드립니다!",
    },
    {
      content: "소모임 개설 기간",
      start: 24,
      end: 30,
      type: "main",
      text: "방학동안 스터디 뿐만 아니라 다양한 장르의 그룹을 활성화 해보려고 해요! 토익, 자격증 등의 스터디 뿐만 아니라 카페 탐방, 영화 관람, 보드게임, 러닝, 취미 활동 등 모든 모임 개설이 가능합니다. 모임장에게는 2만원씩 지원 혜택이 있습니다.",
    },
    {
      content: "홍보 이벤트",
      start: 24,
      end: 30,
      type: "event",
      text: "에타 홍보에 참여하고 상품 받아가세요! 총 10만원 쏩니다!",
    },
  ],
  7: [
    {
      content: "동아리 2차 대성리 MT",
      start: 3,
      end: 4,
      type: "schedule",
      text: "",
    },
    {
      content: "소모임 편성",
      start: 6,
      end: 7,
      type: "main",
      text: "",
    },
    {
      content: "모임 활성화 이벤트",
      start: 8,
      end: 9,
      type: "event",
      text: "",
    },
    {
      content: "알고리즘 공모전",
      start: 11,
      end: 12,
      type: "event",
      text: "",
    },
    {
      content: "정기모임 진행 주간",
      start: 18,
      end: 21,
      type: "schedule",
      text: "",
    },
    {
      content: "라운지 및 피드, 채팅, 인스타 기능 출시",
      start: 28,
      end: 31,
      type: "main",
      text: "",
    },
  ],

  8: [
    {
      content: "월간 체크",
      start: 1,
      end: 1,
      type: "main",
      text: "",
    },
    {
      content: "조모임 진행 주간",
      start: 8,
      end: 11,
      type: "schedule",
      text: "",
    },
    {
      content: "커뮤니티 출시",
      start: 5,
      end: 6,
      type: "main",
      text: "",
    },
    {
      content: "에브리타임 홍보 이벤트 시작 ~ ",
      start: 13,
      end: 15,
      type: "event",
      text: "",
    },
    {
      content: "지역 정기모임 주간",
      start: 14,
      end: 17,
      type: "schedule",
      text: "",
    },

    {
      content: "온라인 스터디 오픈",
      start: 20,
      end: 22,
      type: "main",
      text: "",
    },
    {
      content: "추억의 뽑기 이벤트",
      start: 22,
      end: 23,
      type: "event",
      text: "",
    },
    {
      content: "동아리 정비 기간",
      start: 26,
      end: 30,
      type: "schedule",
      text: "",
    },
    {
      content: "한줄 카피라이팅 이벤트",
      start: 28,
      end: 30,
      type: "event",
      text: "",
    },
  ],
  9: [
    {
      content: "동아리 리뉴얼 ~ ",
      start: 2,
      end: 4,
      type: "main",
      text: "에브리타임에 홍보하면 매주 2분께 올리브영 기프티콘을 드려요!",
    },
    {
      content: "에타 홍보 이벤트 ~ ",
      start: 4,
      end: 6,
      type: "event",
      text: "에브리타임에 홍보하면 매주 2분께 올리브영 기프티콘을 드려요!",
    },
    {
      content: "디스코드 오픈 이벤트 ~ ",
      start: 10,
      end: 12,
      type: "event",
      text: "동아리 스터디 디스코드 채널이 생겼습니다! 같이 공부하고 이벤트 상품 받아가세요!",
    },
    {
      content: "열공 스터디 이벤트 ~ ",
      start: 23,
      end: 24,
      type: "event",
      text: "동아리 스터디 디스코드 채널이 생겼습니다! 같이 공부하고 이벤트 상품 받아가세요!",
    },
    {
      content: "유령인원 정리 기간",
      start: 16,
      end: 17,
      type: "main",
      text: "",
    },
    {
      content: "동아리 전체 정기모임",
      start: 27,
      end: 28,
      type: "main",
      text: "",
    },
    {
      content: "지역 정기모임 주간",
      start: 13,
      end: 15,
      type: "schedule",
      text: "",
    },
    {
      content: "시험대비 스터디 집중 기간 ~ ",
      start: 29,
      end: 30,
      type: "schedule",
      text: "",
    },
    {
      content: "ABOUT 빙고판 이벤트",
      start: 17,
      end: 18,
      type: "event",
      text: "",
    },
    {
      content: "소모임 홍보/집중 기간 ~",
      start: 9,
      end: 10,
      type: "schedule",
      text: "",
    },
  ],
  10: [
    {
      content: "서비스 리뉴얼",
      start: 1,
      end: 5,
      type: "main",
      text: "",
    },
  ],
  11: [],
  12: [],
};

export const EVENT_ALWAYS = [
  {
    title: "[항시] 에타 홍보 이벤트",
    content:
      "이벤트 탭의 홍보게시판에 들어가서 동아리를 학교 에타에 홍보해주세요! 매번 100 POINT + 추첨을 통해 치킨 기프티콘도 드려요!",
  },
];
