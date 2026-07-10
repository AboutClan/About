export type ActivityCategory = "study" | "hobby" | "social";

export type ActivityItem = {
  id: string;
  groupStudyId: number;
  title: string;
  mainCategory: string;
  subCategory?: string;
  imageSrc: string;
  activeMemberCnt?: number;
};

export const HOME_ACTIVITY_ITEMS: ActivityItem[] = [
  {
    title: "🎮 온라인 게임 소모임 🎮",
    activeMemberCnt: 106,
    id: "17",
    groupStudyId: 17,
    mainCategory: "친목",
    subCategory: "게임",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EA%B2%8C%EC%9E%84+(2).jpg",
  },
  {
    title: "💪 오운완 💪 꾸준히 운동 인증하는 모임!",
    activeMemberCnt: 17,
    id: "18",
    groupStudyId: 18,
    mainCategory: "취미",
    subCategory: "운동 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%9A%B4%EB%8F%99+%EB%A9%94%EC%9D%B8...webp",
  },
  {
    title: "✅ TO DO MATE | 매일 할 일 체크",
    activeMemberCnt: 16,
    id: "25",
    groupStudyId: 25,
    mainCategory: "자기계발",
    subCategory: "습관 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%ED%88%AC%EB%91%90+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "포커스 온 📷 사진 출사 소모임",
    activeMemberCnt: 31,
    id: "102",
    groupStudyId: 102,
    mainCategory: "힐링",
    subCategory: "사진",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%B6%9C%EC%82%AC+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "🎨 문화 탐방 소모임 🎭",
    activeMemberCnt: 26,
    id: "104",
    groupStudyId: 104,
    mainCategory: "감상",
    subCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%AC%B8%ED%99%94%ED%83%90%EB%B0%A9.jpg",
  },
  {
    title: "🕵️‍♀️ 방탈출: 미스터리 추리반 🔓",
    activeMemberCnt: 33,
    id: "106",
    groupStudyId: 106,
    mainCategory: "소셜 게임",
    subCategory: "방 탈출",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B0%A9%ED%83%88%EC%B6%9C+-+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "여름 방학 갓생 사는 방법. 습관 만들기 소모임",
    activeMemberCnt: 18,
    id: "107",
    groupStudyId: 107,
    mainCategory: "자기계발",
    subCategory: "습관 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%8A%B5%EA%B4%80+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "우당탕탕 토론 대소동",
    activeMemberCnt: 5,
    id: "110",
    groupStudyId: 110,
    mainCategory: "말하기",
    subCategory: "말하기",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%ED%86%A0%EB%A1%A0+-+%EB%A9%94%EC%9D%B8.jpg",
  },
  {
    title: "🎳 Strike Club 🎳 볼링 소모임",
    activeMemberCnt: 12,
    id: "116",
    groupStudyId: 116,
    mainCategory: "취미",
    subCategory: "운동 인증",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B3%BC%EB%A7%81+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "Daily Blog, 왓츠인마이블로그",
    activeMemberCnt: 10,
    id: "117",
    groupStudyId: 117,
    mainCategory: "친목",
    subCategory: "힐링",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B8%94%EB%A1%9C%EA%B7%B8+-+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "☕ 오늘의 카페 | 카공 + 카페 탐방",
    activeMemberCnt: 70,
    id: "118",
    groupStudyId: 118,
    mainCategory: "스터디",
    subCategory: "카페 탐방",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/cozy-room-morning+(1).jpg",
  },
  {
    title: "클라이밍 소모임 🧗 GRIP",
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
    activeMemberCnt: 7,
    id: "132",
    groupStudyId: 132,
    mainCategory: "자기계발",
    subCategory: "습관",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EA%B8%B0%EC%83%81+-+%EC%8A%A4%ED%80%98%EC%96%B4.jpg",
  },
  {
    title: "🎲 보드게임 소모임 🎲",
    activeMemberCnt: 54,
    id: "135",
    groupStudyId: 135,
    mainCategory: "소셜 게임",
    subCategory: "보드게임",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%B3%B4%EB%93%9C%EA%B2%8C%EC%9E%84+%EB%A9%94%EC%9D%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.webp",
  },
  {
    title: "영화 감상 소모임 🍿 씨네로그 🍿 - Fresh",
    activeMemberCnt: 16,
    id: "136",
    groupStudyId: 136,
    mainCategory: "감상",
    subCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/10356714.jpg",
  },
  {
    title: "컴활 합격 스터디",
    activeMemberCnt: 1,
    id: "146",
    groupStudyId: 146,
    mainCategory: "스터디",
    subCategory: "컴활",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%BB%B4%ED%99%9C+%EC%A0%95%EC%82%AC%EA%B0%81.png",
  },
  {
    title: "🌶 맵당 🌶 매운 음식 뿌시기🔥",
    activeMemberCnt: 13,
    id: "148",
    groupStudyId: 148,
    mainCategory: "푸드",
    subCategory: "맛집 탐방",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%A7%A4%EC%9A%B4%EC%9D%8C%EC%8B%9D+-+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "💥 서바이벌 액션: 액티비티 소모임",
    activeMemberCnt: 14,
    id: "149",
    groupStudyId: 149,
    mainCategory: "운동",
    subCategory: "액티비티",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%98%A4%ED%94%84%EB%9D%BC%EC%9D%B8+%ED%99%9C%EB%8F%99+%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95.webp",
  },
  {
    title: "🎵 썰플리 | 음악으로 나누는 내 얘기",
    activeMemberCnt: 26,
    id: "150",
    groupStudyId: 150,
    mainCategory: "친목",
    subCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%9D%8C%EC%95%85+%EB%A9%94%EC%9D%B8.webp",
  },
  {
    title: "영어 회화 스터디 | 기사 읽고 토론, 프리토킹까지!",
    activeMemberCnt: 27,
    id: "152",
    groupStudyId: 152,
    mainCategory: "스터디",
    subCategory: "회화",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%98%81%EC%96%B4%ED%9A%8C%ED%99%94-%EB%A9%94%EC%9D%B8.png",
  },
  {
    title: "⚾ 만루청춘 | 야구 직관 소모임",
    activeMemberCnt: 51,
    id: "162",
    groupStudyId: 162,
    mainCategory: "운동",
    subCategory: "운동",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EC%95%BC%EA%B5%AC+%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95.jpg",
  },
  {
    title: "경제 기사 읽기 소모임",
    activeMemberCnt: 7,
    id: "164",
    groupStudyId: 164,
    mainCategory: "스터디",
    subCategory: "말하기",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EA%B2%BD%EC%A0%9C%EC%8B%9C%EC%82%AC%EC%8A%A4%ED%84%B0%EB%94%94+%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95.jpg",
  },
  {
    title: "Talk & Talk, 어색하지만 말해볼게요",
    activeMemberCnt: 11,
    id: "165",
    groupStudyId: 165,
    mainCategory: "말하기",
    subCategory: "말하기",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%8A%A4%ED%94%BC%EC%B9%98%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95.jpg",
  },
  {
    title: "📚 여름 방학 독서 모임 📚",
    activeMemberCnt: 27,
    id: "176",
    groupStudyId: 176,
    mainCategory: "자기계발",
    subCategory: "독서",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/%EB%8F%85%EC%84%9C+%EC%A0%95%EC%82%AC.webp",
  },
  {
    title: "여름 방학 토익 스터디 챌린지 🔥",
    activeMemberCnt: 1,
    id: "216",
    groupStudyId: 216,
    mainCategory: "스터디",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84%2B%EB%A9%94%EC%9D%B8%2B%EC%9D%B4%EB%AF%B8%EC%A7%80/8501a1d9-c510-4014-9084-e894f74d5f2f.png",
  },
  {
    title: "🎯버킷랩, 함께 이루는 버킷리스트",
    activeMemberCnt: 7,
    id: "219",
    groupStudyId: 219,
    mainCategory: "힐링",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%B2%84%ED%82%B72.webp",
  },
  {
    title: "제로칼로리",
    activeMemberCnt: 12,
    id: "221",
    groupStudyId: 221,
    mainCategory: "푸드",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%A7%9B%EC%A7%91%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "🍿 씨네로그 🍿 스탠다드",
    activeMemberCnt: 25,
    id: "224",
    groupStudyId: 224,
    mainCategory: "감상",
    subCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%A0%95%EC%82%AC%EA%B0%81%ED%98%95/10356714.jpg",
  },
  {
    title: "🍸 한 잔의 이야기",
    activeMemberCnt: 26,
    id: "230",
    groupStudyId: 230,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%85%8C%EC%9D%B4%EC%8A%A4%ED%8C%85.jpg",
  },
  {
    title: "🎨내가 그린 기린 그림🦒",
    activeMemberCnt: 13,
    id: "232",
    groupStudyId: 232,
    mainCategory: "힐링",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EA%B8%B0%EB%A6%B0%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "프론트엔드 인사이트",
    activeMemberCnt: 6,
    id: "233",
    groupStudyId: 233,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "🎭 뮤지컬  관람 소모임",
    activeMemberCnt: 9,
    id: "234",
    groupStudyId: 234,
    mainCategory: "감상",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%97%B0%EA%B7%B9%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "퇴사하고 싶다",
    activeMemberCnt: 46,
    id: "235",
    groupStudyId: 235,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%A7%81%EC%9E%A5%EC%9D%B8%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "테니스_소모임🎾🎾",
    activeMemberCnt: 1,
    id: "240",
    groupStudyId: 240,
    mainCategory: "취미",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%85%8C%EB%8B%88%EC%8A%A4_%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "About Party Lab 🤩 파티 기획 소모임",
    activeMemberCnt: 1,
    id: "241",
    groupStudyId: 241,
    mainCategory: "파티",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8C%8C%ED%8B%B0%EB%A9%94%EC%9D%B8.jpg",
  },
  {
    title: "악기 연습 소모임",
    activeMemberCnt: 18,
    id: "242",
    groupStudyId: 242,
    mainCategory: "자기계발",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%85%EA%B8%B0%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "🍳 요리조리 소모임 🍳",
    activeMemberCnt: 9,
    id: "245",
    groupStudyId: 245,
    mainCategory: "요리",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9A%94%EB%A6%AC%EC%A1%B0%EB%A6%AC_%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "사소한 독서모임",
    activeMemberCnt: 8,
    id: "246",
    groupStudyId: 246,
    mainCategory: "자기계발",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%82%AC%EC%86%8C%ED%95%9C%EB%8F%85%EC%84%9C%EC%A0%95%EC%82%AC.jpeg",
  },
  {
    title: "초보 영상 제작실",
    activeMemberCnt: 1,
    id: "248",
    groupStudyId: 248,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%98%81%EC%83%81%ED%8E%B8%EC%A7%91%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "멱살 잡고 코테 졸업",
    activeMemberCnt: 1,
    id: "250",
    groupStudyId: 250,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%BD%94%EB%94%A9%EC%A0%95%EC%82%AC2.jpg",
  },
  {
    title: "[TREND LAB] 유행하는 그거, 같이 할 사람?",
    activeMemberCnt: 10,
    id: "255",
    groupStudyId: 255,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8A%B8%EB%A0%8C%EB%93%9C+%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "코노 한 판 🎤 노래방 X 맛집",
    activeMemberCnt: 34,
    id: "256",
    groupStudyId: 256,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EA%B3%B5%EC%9C%A0+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%85%B8%EB%9E%98%EB%B0%A9%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "K-POP 커버 댄스 소모임",
    activeMemberCnt: 6,
    id: "262",
    groupStudyId: 262,
    mainCategory: "힐링",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EB%8C%84%EC%8A%A4.jpg",
  },
  {
    title: "💼 취준 메이트 | 직무 달라도 함께하는 취업 준비 모임",
    activeMemberCnt: 1,
    id: "265",
    groupStudyId: 265,
    mainCategory: "스터디",
    imageSrc:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%B7%A8%EC%A4%80%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "[수원/용인] 카공 스터디 크루",
    activeMemberCnt: 19,
    id: "270",
    groupStudyId: 270,
    mainCategory: "크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "🌃 Admin Night",
    activeMemberCnt: 58,
    id: "271",
    groupStudyId: 271,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EC%86%8C%EB%AA%A8%EC%9E%84/%EC%96%B4%EB%93%9C%EB%AF%BC%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "[강남/서초] 카공 스터디 크루",
    activeMemberCnt: 22,
    id: "272",
    groupStudyId: 272,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[성수/왕십리/건대] 카공 스터디 크루",
    activeMemberCnt: 19,
    id: "273",
    groupStudyId: 273,
    mainCategory: "크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[마포/당산/영등포] 카공 스터디 크루",
    activeMemberCnt: 25,
    id: "274",
    groupStudyId: 274,
    mainCategory: "크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[성북/동대문/노원] 카공 스터디 크루",
    activeMemberCnt: 31,
    id: "275",
    groupStudyId: 275,
    mainCategory: "크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "냠냠즈 x 20대 초반 친목 모임",
    activeMemberCnt: 10,
    id: "277",
    groupStudyId: 277,
    mainCategory: "친목",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%83%A0%EB%83%A0%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "연극, 뮤지컬 도전하고 싶은 사람?",
    activeMemberCnt: 1,
    id: "278",
    groupStudyId: 278,
    mainCategory: "취미",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%97%B0%EA%B7%B9%EC%A0%95%EC%82%AC.jpg",
  },
  {
    title: "AIDEV - 격주로 진행되는 AI/SW 세미나",
    activeMemberCnt: 8,
    id: "282",
    groupStudyId: 282,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%AA%A8%EC%9E%84+%EB%A9%94%EC%9D%B8+%EC%9D%B4%EB%AF%B8%EC%A7%80/aidev%EC%A0%95%EC%82%AC.png",
  },
  {
    title: "[인천] 카공 스터디 크루",
    activeMemberCnt: 1,
    id: "283",
    groupStudyId: 283,
    mainCategory: "스터디",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
  {
    title: "[사당/관악구] 카공 스터디 크루",
    activeMemberCnt: 1,
    id: "284",
    groupStudyId: 284,
    mainCategory: "크루",
    imageSrc:
      "https://d15r8f9iey54a4.cloudfront.net/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%97%B4%EA%B3%B5.png",
  },
];
