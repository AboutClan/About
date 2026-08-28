export type ActivityCategory = "공부·자기계발" | "취미" | "문화·놀거리" | "친목" | "스터디 크루";

export type ActivityItem = {
  id: string;
  groupStudyId: number;
  title: string;
  mainCategory: ActivityCategory;
  subCategory?: string;
  imageSrc: string;
  activeMemberCnt?: number;
};

export const HOME_ACTIVITY_ITEMS: ActivityItem[] = [
  {
    title: "🎮 온라인 게임 소모임 🎮",
    activeMemberCnt: 120,
    id: "17",
    groupStudyId: 17,
    mainCategory: "친목",
    subCategory: "게임",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EA%B2%8C%EC%9E%84+(2).jpg",
  },
  {
    title: "💪 오늘도 오운완 💪",
    activeMemberCnt: 20,
    id: "18",
    groupStudyId: 18,
    mainCategory: "취미",
    subCategory: "운동 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%9A%B4%EB%8F%99+%EB%A9%94%EC%9D%B8...webp",
  },
  {
    title: "✅ TO DO MATE | 할 일 체크",
    activeMemberCnt: 17,
    id: "25",
    groupStudyId: 25,
    mainCategory: "공부·자기계발",
    subCategory: "습관 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%ED%88%AC%EB%91%90+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "포커스 온 📷 사진 출사 소모임 - 4기",
    activeMemberCnt: 21,
    id: "102",
    groupStudyId: 102,
    mainCategory: "취미",
    subCategory: "사진",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%B6%9C%EC%82%AC+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "🎨 문화 탐방 소모임 🎭 - 4기",
    activeMemberCnt: 20,
    id: "104",
    groupStudyId: 104,
    mainCategory: "문화·놀거리",
    subCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%AC%B8%ED%99%94%ED%83%90%EB%B0%A9.jpg",
  },
  {
    title: "🕵️‍♀️ 방탈출: 미스터리 추리반 🔓 - 9기",
    activeMemberCnt: 20,
    id: "106",
    groupStudyId: 106,
    mainCategory: "문화·놀거리",
    subCategory: "방 탈출",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B0%A9%ED%83%88%EC%B6%9C+-+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "2학기 갓생 살기! 습관 만들기 소모임",
    activeMemberCnt: 18,
    id: "107",
    groupStudyId: 107,
    mainCategory: "공부·자기계발",
    subCategory: "습관 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%8A%B5%EA%B4%80+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "Daily Blog, 왓츠인마이블로그",
    activeMemberCnt: 8,
    id: "117",
    groupStudyId: 117,
    mainCategory: "공부·자기계발",
    subCategory: "힐링",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B8%94%EB%A1%9C%EA%B7%B8+-+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "클라이밍 소모임 🧗 GRIP - 4기",
    activeMemberCnt: 27,
    id: "131",
    groupStudyId: 131,
    mainCategory: "취미",
    subCategory: "운동 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%ED%81%B4%EB%9D%BC%EC%9D%B4%EB%B0%8D+%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95.webp",
  },
  {
    title: "🌅 기상 인증 스터디, 모닝 루틴!",
    activeMemberCnt: 9,
    id: "132",
    groupStudyId: 132,
    mainCategory: "공부·자기계발",
    subCategory: "습관",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EA%B8%B0%EC%83%81+-+%EC%8A%A4%ED%80%98%EC%96%B4.jpg",
  },
  {
    title: "🎲 ROLL THE DICE 🎲 - 4기",
    activeMemberCnt: 19,
    id: "135",
    groupStudyId: 135,
    mainCategory: "문화·놀거리",
    subCategory: "보드게임",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84+%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.webp",
  },
  {
    title: "🍿씨네로그🍿 영화 같이 보는 모임 - 4기",
    activeMemberCnt: 18,
    id: "136",
    groupStudyId: 136,
    mainCategory: "문화·놀거리",
    subCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/10356714.jpg",
  },
  {
    title: "[어바웃 x 유동균컴활] 컴활 합격 스터디",
    activeMemberCnt: 8,
    id: "146",
    groupStudyId: 146,
    mainCategory: "공부·자기계발",
    subCategory: "컴활",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/ChatGPT+Image+2026%EB%85%84+8%EC%9B%94+25%EC%9D%BC+%EC%98%A4%EC%A0%84+11_35_52.png",
  },
  {
    title: "🌶 맵당 🌶 매운 음식 뿌시기🔥 - 2기",
    activeMemberCnt: 13,
    id: "148",
    groupStudyId: 148,
    mainCategory: "친목",
    subCategory: "맛집 탐방",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%A7%A4%EC%9A%B4%EC%9D%8C%EC%8B%9D+-+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "영어 회화 스터디 | 기사 읽기부터 프리토킹까지",
    activeMemberCnt: 9,
    id: "152",
    groupStudyId: 152,
    mainCategory: "공부·자기계발",
    subCategory: "회화",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%98%81%ED%9A%8C%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "⚾ 만루청춘 | 야구 직관 소모임",
    activeMemberCnt: 55,
    id: "162",
    groupStudyId: 162,
    mainCategory: "취미",
    subCategory: "운동",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%95%BC%EA%B5%AC+%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95.jpg",
  },
  {
    title: "2026-2nd Semester Book Club",
    activeMemberCnt: 10,
    id: "176",
    groupStudyId: 176,
    mainCategory: "공부·자기계발",
    subCategory: "독서",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%8F%85%EC%84%9C%EC%A0%95%EC%82%AC2.png",
  },
  {
    title: "🎯버킷랩, 함께 이루는 버킷리스트",
    activeMemberCnt: 7,
    id: "219",
    groupStudyId: 219,
    mainCategory: "친목",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%B2%84%ED%82%B72.webp",
  },
  {
    title: "🍸 한 잔의 이야기",
    activeMemberCnt: 27,
    id: "230",
    groupStudyId: 230,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%85%8C%EC%9D%B4%EC%8A%A4%ED%8C%85.jpg",
  },
  {
    title: "🎭 뮤지컬  관람 소모임 - 2기",
    activeMemberCnt: 10,
    id: "234",
    groupStudyId: 234,
    mainCategory: "취미",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%97%B0%EA%B7%B9%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "퇴사하고 싶다 - 2기",
    activeMemberCnt: 53,
    id: "235",
    groupStudyId: 235,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%A7%81%EC%9E%A5%EC%9D%B8%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "🍳 요리조리 소모임 🍳 - 2기",
    activeMemberCnt: 9,
    id: "245",
    groupStudyId: 245,
    mainCategory: "취미",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9A%94%EB%A6%AC%EC%A1%B0%EB%A6%AC_%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "[TREND LAB] 유행하는 그거, 같이 할 사람?",
    activeMemberCnt: 11,
    id: "255",
    groupStudyId: 255,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8A%B8%EB%A0%8C%EB%93%9C+%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "코노 한 판 🎤 노래방 X 맛집 - 2기",
    activeMemberCnt: 24,
    id: "256",
    groupStudyId: 256,
    mainCategory: "친목",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/ChatGPT+Image+2026%EB%85%84+8%EC%9B%94+25%EC%9D%BC+%EC%98%A4%ED%9B%84+01_39_22.png",
  },
  {
    title: "K-POP 커버 댄스 소모임 - 2기",
    activeMemberCnt: 7,
    id: "262",
    groupStudyId: 262,
    mainCategory: "취미",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%8C%84%EC%8A%A4.jpg",
  },
  {
    title: "[수원/용인] 카공 스터디 크루",
    activeMemberCnt: 20,
    id: "270",
    groupStudyId: 270,
    mainCategory: "스터디 크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "🌃 Admin Night 🌃 - 2기",
    activeMemberCnt: 14,
    id: "271",
    groupStudyId: 271,
    mainCategory: "공부·자기계발",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%96%B4%EB%93%9C%EB%AF%BC%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "[강남/서초] 카공 스터디 크루",
    activeMemberCnt: 23,
    id: "272",
    groupStudyId: 272,
    mainCategory: "스터디 크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[성수/왕십리/건대] 카공 스터디 크루",
    activeMemberCnt: 19,
    id: "273",
    groupStudyId: 273,
    mainCategory: "스터디 크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[마포/당산/영등포] 카공 스터디 크루",
    activeMemberCnt: 33,
    id: "274",
    groupStudyId: 274,
    mainCategory: "스터디 크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[성북/동대문/노원] 카공 스터디 크루",
    activeMemberCnt: 34,
    id: "275",
    groupStudyId: 275,
    mainCategory: "스터디 크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "냠냠즈 x 20대 초반 친구 모임! - 2기",
    activeMemberCnt: 17,
    id: "277",
    groupStudyId: 277,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%83%A0%EB%83%A0%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "코미디 같이 볼 사람?",
    activeMemberCnt: 5,
    id: "310",
    groupStudyId: 310,
    mainCategory: "친목",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%A9%94%ED%83%80%EC%BD%94%EB%AF%B8%EB%94%94.png",
  },
  {
    title: "AI 학습 · 인사이트 공유 스터디",
    activeMemberCnt: 8,
    id: "319",
    groupStudyId: 319,
    mainCategory: "공부·자기계발",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%A0%9C%EB%AA%A9%EC%9D%84+%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94.+(22).png",
  },
  {
    title: " 💕체험단 & 릴스 소모임 💕",
    activeMemberCnt: 6,
    id: "320",
    groupStudyId: 320,
    mainCategory: "친목",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/ChatGPT+Image+2026%EB%85%84+8%EC%9B%94+28%EC%9D%BC+%EC%98%A4%ED%9B%84+02_43_24.png",
  },
];
