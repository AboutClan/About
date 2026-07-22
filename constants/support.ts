export type SupportCategory = "study" | "hobby" | "life";

export const SUPPORT_CATEGORY_ORDER: SupportCategory[] = ["hobby", "life", "study"];

export const SUPPORT_CATEGORY_LABEL: Record<SupportCategory, string> = {
  study: "[공부·취업]",
  hobby: "[취미]",
  life: "[라이프]",
};

export type SupportItem = {
  id: string;
  name: string;
  summary: string;
  category: SupportCategory;
  imageUrl: string;
  description: string;
  benefits: string[];
  link: string;
  texts: string[];
};

export const SUPPORT_LIST: SupportItem[] = [
  {
    id: "eduwill",
    name: "에듀윌",
    summary: "종합 온라인 교육",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4+%EC%97%85%EC%B2%B4+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%97%90%EB%93%80%EC%9C%8C.png",
    description:
      "공무원, 자격증, 취업 등 다양한 분야의 온라인 강의와 학습 콘텐츠를 제공하는 국내 종합 교육 플랫폼입니다.",
    benefits: ["기본 5% 할인", "어바웃 내 그룹 스터디 참여 시 추가 할인"],
    link: "https://www.eduwill.net/sites/home",
    texts: ["어바웃 멤버 및 지인 적용 가능", "어바웃 앱 [제휴 업체]에서 쿠폰 발급 가능"],
  },
  {
    id: "ringle",
    name: "링글",
    summary: "영어 스피킹",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%A7%81%EA%B8%80.png",
    description:
      "1:1 화상 영어 수업을 진행할 수 있는 영어회화 플랫폼입니다. 비즈니스 영어, 인터뷰, 유학·취업 준비, 프리토킹 등 원하는 수업을 선택해 실전 영어 회화를 공부할 수 있습니다.",
    benefits: [
      "링글 AI 스피킹 7일 무제한 무료체험",
      "링글 1:1 화상영어 무료체험 수업권 1회 제공",
      "현금처럼 사용할 수 있는 링글 1만 포인트 제공",
    ],
    link: "https://www.ringleplus.com/ko",
    texts: [
      "어바웃 멤버 및 지인 이용 가능",
      "https://link.ringleplus.com/3SpUPxf 접속 후 a5132f 입력",
    ],
  },
  {
    id: "yoodonggyun-computer",
    name: "유동균 컴활",
    summary: "컴활 온라인 교육",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9C%A0%EB%8F%99%EA%B7%A0%EC%BB%B4%ED%99%9C.png",
    description:
      "컴퓨터활용능력 자격증 시험 분야에서 높은 인지도를 보유한 유동균 강사의 온라인 강의로, 컴활 1급과 2급 단기 합격을 준비할 수 있는 교육 브랜드입니다.",
    benefits: ["수강료 20% 할인"],
    link: "https://www.itbtm.com/main2/intro.php",
    texts: ["어바웃 멤버 본인만 적용 가능", "어바웃 채널로 문의"],
  },
  {
    id: "life-mentor",
    name: "라이프멘토",
    summary: "AI 자소서",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%9D%BC%EC%9D%B4%ED%94%84%EB%A9%98%ED%86%A0.png",
    description:
      "인턴, 대외활동, 프로젝트, 직무 경험 등 구직자의 이력을 체계적으로 정리한 뒤 이를 토대로 자기소개서 작성과 면접 준비까지 연계하는 AI 기반 취업지원 플랫폼입니다.",
    benefits: ["어바웃 멤버 전용 30% 할인 쿠폰 지급"],
    link: "https://lifemento.co.kr/",
    texts: ["어바웃 멤버 및 지인 적용 가능", "라이프멘토 → 제휴 혜택 받기 → about_coupon 입력"],
  },
  {
    id: "jalbwayo",
    name: "잘봐요",
    summary: "AI 모의면접",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9E%98%EB%B4%90%EC%9A%94.png",
    description:
      "삼성, SK, LG, 현대 등 국내 다수 기업의 역량 평가 모델을 기반으로 실전 면접을 연습할 수 있는 AI 모의면접 플랫폼입니다.",
    benefits: ["20% 할인 쿠폰 제공", "선착순 100명 한정"],
    link: "https://welldone-interview.co.kr/",
    texts: ["어바웃 멤버 및 지인 이용 가능", "이용권 구매 시 PROMO-ABOUT20 입력"],
  },
  {
    id: "itgo",
    name: "아이티고",
    summary: "IT 온라인 교육",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%84%EC%9D%B4%ED%8B%B0%EA%B3%A0.png",
    description:
      "컴퓨터 자격증, 프로그래밍, 그래픽 디자인 등 다양한 IT 분야의 온라인 강의를 제공하는 교육 플랫폼입니다.",
    benefits: ["1개월 자유이용권 제공", "추후 결제 시 50% 할인 쿠폰 제공"],
    link: "https://company.itgo.co.kr/",
    texts: ["어바웃 멤버 및 지인 이용 가능", "어바웃 채널로 문의"],
  },
  {
    id: "aitgo",
    name: "에이아이티고",
    summary: "AI 온라인 교육",
    category: "study",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%95%84%EC%9D%B4%ED%8B%B0%EA%B3%A0.png",
    description:
      "AI 기초 학습부터 심화 응용까지 인공지능과 관련된 다양한 온라인 강의를 제공하는 AI 특화 교육 플랫폼입니다.",
    benefits: ["1개월 자유이용권 제공", "추후 결제 시 50% 할인 쿠폰 제공"],
    link: "https://aitgo.co.kr/education/",
    texts: ["어바웃 멤버 및 지인 이용 가능", "어바웃 채널로 문의"],
  },
  {
    id: "killed-story",
    name: "죽여주는이야기",
    summary: "대학로 연극",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%A3%BD%EC%97%AC%EC%A3%BC%EB%8A%94%EC%9D%B4%EC%95%BC%EA%B8%B0.png",
    description:
      "무거운 소재를 유쾌한 대사와 예측할 수 없는 반전, 관객 참여형 구성으로 풀어낸 18년 역사의 대학로 블랙코미디 연극입니다.",
    benefits: ["평일 관람료 50,000원 → 14,000원", "주말 관람료 50,000원 → 17,000원"],
    link: "https://nol.yanolja.com/ticket/products/26003518",
    texts: [
      "NOL 티켓에서 재관람으로 선택해 구매",
      "어바웃 멤버 본인만 적용 가능",
      "현장에서 어바웃 멤버증을 확인할 수 있음",
    ],
  },
  {
    id: "fox-store",
    name: "구미호 식당",
    summary: "대학로 연극",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4+%EC%97%85%EC%B2%B4+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EA%B5%AC%EB%AF%B8%ED%98%B8%EC%8B%9D%EB%8B%B9.jpeg",
    description:
      "무거운 소재를 유쾌한 대사와 예측할 수 없는 반전, 관객 참여형 구성으로 풀어낸 18년 역사의 대학로 블랙코미디 연극입니다.",
    benefits: ["평일 관람료 50,000원 → 14,000원", "주말 관람료 50,000원 → 17,000원"],
    link: "https://nol.yanolja.com/ticket/products/26003518",
    texts: [
      "NOL 티켓에서 재관람으로 선택해 구매",
      "어바웃 멤버 본인만 적용 가능",
      "현장에서 어바웃 멤버증을 확인할 수 있음",
    ],
  },
  {
    id: "lotte-museum",
    name: "롯데뮤지엄",
    summary: "미술 전시",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%A1%AF%EB%8D%B0%EB%AE%A4%EC%A7%80%EC%97%84%203.png",
    description:
      "롯데월드타워 7층에 위치한 컨템퍼러리 미술 전문 미술관으로, 시즌마다 새로운 주제와 작가의 전시를 선보입니다.",
    benefits: ["입장권 20,000원 → 10,000원", "입장권 50% 할인"],
    link: "https://www.lottemuseum.com/",
    texts: [
      "어바웃 멤버 및 지인 적용 가능",
      "https://ticket.interpark.com/Contents/PartnerClosure?BizCode=64533",
      "인증코드 verdystu 입력",
    ],
  },
  {
    id: "somssidang",
    name: "솜씨당",
    summary: "취미·원데이클래스",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4+%EC%97%85%EC%B2%B4+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%86%9C%EC%94%A8%EB%8B%B9.png",
    description:
      "공방과 원데이클래스, 온라인 클래스 등 다양한 취미·여가 활동을 쉽게 찾고 참여할 수 있는 온·오프라인 취미 플랫폼입니다.",
    benefits: ["10% 할인 쿠폰 제공"],
    link: "https://www.sssd.co.kr/m",
    texts: ["어바웃 멤버 본인만 적용 가능", "어바웃 앱 [제휴 업체]에서 쿠폰 발급 가능"],
  },
  {
    id: "turucar",
    name: "투루카",
    summary: "카셰어링·렌터카",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4+%EC%97%85%EC%B2%B4+%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%88%AC%EB%A3%A8%EC%B9%B4.png",
    description:
      "필요한 시간만큼 차량을 대여하고 원하는 장소에서 반납할 수 있는 실시간 카셰어링 및 렌터카 플랫폼입니다.",
    benefits: [
      "50% 할인 쿠폰 제공",
      "신규 가입자 주중 24시간 무료 제공",
      "신규 가입자 주중·주말 3시간 무료 제공",
    ],
    link: "https://turucar.com/?abx_tid=1784601023964%3Abbdbe116-5620-48f8-a6bc-34c55ec676a7",
    texts: ["하단 [제휴 쿠폰 받기] 버튼 클릭", "투루카 APP > 내정보 > 내쿠폰함 > + 쿠폰코드 등록"],
  },
  {
    id: "meta-comedy-club-hongdae",
    name: "메타코미디클럽 홍대",
    summary: "스탠드업 코미디",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4+%EC%97%85%EC%B2%B4+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%A9%94%ED%83%80%EC%BD%94%EB%AF%B8%EB%94%94.webp",
    description: "코미디 레이블 메타코미디가 운영하는 홍대 스탠드업 코미디 공연장입니다.",
    benefits: ["공연 티켓 20% 할인", "스페셜 공연 무료 초대권"],
    link: "https://www.metacomedy.net/",
    texts: ["어바웃 멤버 및 동반 1인 적용 가능", "현장에서 어바웃 멤버증 제시"],
  },
  {
    id: "musical-number-stage",
    name: "넘버스테이지",
    summary: "뮤지컬 펍",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%8D%94%EB%84%98%EB%B2%84%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%80.png",
    description:
      "음식과 술을 즐기며 현직 뮤지컬 배우들의 라이브 공연을 가까이에서 감상할 수 있는 강남역 뮤지컬 펍입니다.",
    benefits: ["입장료 15,000원 → 7,500원", "입장료 50% 할인"],
    link: "https://www.instagram.com/number_stage/",
    texts: [
      "2인당 메뉴 1개와 1인당 음료 1개 주문 필수",
      "어바웃 멤버 본인만 적용 가능",
      "방문 후 어바웃 멤버증을 보여주면 할인 적용",
    ],
  },
  {
    id: "holmes-lupin-gangnam",
    name: "홈즈앤루팡 강남",
    summary: "보드게임 카페",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%99%88%EC%A6%88%EC%95%A4%EB%A3%A8%ED%8C%A1.png",
    description:
      "모든 좌석이 독립된 개별 룸으로 구성되어 있으며, 태블릿 PC와 수백 가지의 보드게임, 다양한 스낵 메뉴를 이용할 수 있는 강남역 보드게임카페입니다.",
    benefits: ["3시간 이용료 9,000원 → 7,000원", "평일 예약 시 4인당 나쵸 또는 팝콘 증정"],
    link: "https://naver.me/GeUR0QwK",
    texts: ["어바웃 멤버만 적용 가능", "어바웃 채널로 문의"],
  },
  {
    id: "jumping-battle-kondae",
    name: "점핑배틀 건대점",
    summary: "실내 액티비티",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%A0%90%ED%95%91%EB%B0%B0%ED%8B%80.png",
    description:
      "트램펄린 위에서 뛰며 화면 속 미션을 수행하고, 제한 시간 안에 레벨을 클리어하며 점수를 경쟁하는 게임형 실내 액티비티 공간입니다.",
    benefits: ["평일 이용료 5,000원", "주말 이용료 6,000원"],
    link: "https://naver.me/GtURV3SK",
    texts: ["어바웃 멤버 본인만 적용 가능", "방문 후 어바웃 멤버증을 보여주면 할인 적용"],
  },
  {
    id: "four-seasons-water-leisure",
    name: "포시즌수상레저",
    summary: "가평 빠지",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%8F%AC%EC%8B%9C%EC%A6%8C%EC%88%98%EC%83%81%EB%A0%88%EC%A0%80.png",
    description:
      "수상 놀이기구, 워터슬라이드, 웨이크보드 등 다양한 여름 물놀이를 즐길 수 있는 가평 수상레저 공간입니다.",
    benefits: ["전체 이용 비용 10% 할인"],
    link: "",
    texts: ["어바웃 멤버 및 지인 적용 가능", "어바웃 채널로 문의"],
  },
  {
    id: "hook-climbing",
    name: "훅 클라이밍",
    summary: "왕십리 클라이밍",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%9B%85%ED%81%B4%EB%9D%BC%EC%9D%B4%EB%B0%8D.jpeg",
    description: "지구력벽과 볼더링 시설을 함께 갖추고 새롭게 리뉴얼된 왕십리 클라이밍장입니다.",
    benefits: [
      "일일 이용권 20,000원 → 15,000원 및 암벽화 무료 대여",
      "일일 체험 강습 30,000원 → 25,000원",
      "스타터 패키지 등록 시 일일 체험 강습비 전액 환급",
      "월간 이용권 130,000원 → 110,000원",
    ],
    link: "https://naver.me/FTXwcnAM",
    texts: ["어바웃 멤버 본인만 적용 가능", "방문 후 어바웃 멤버증을 보여주면 할인 적용"],
  },
  {
    id: "groot-climbing",
    name: "그루트 클라이밍",
    summary: "성수 클라이밍",
    category: "hobby",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EA%B7%B8%EB%A3%A8%ED%8A%B8%ED%81%B4%EB%9D%BC%EC%9D%B4%EB%B0%8D.png",
    description: "지구력벽과 볼더링 시설을 함께 이용할 수 있는 성수 클라이밍장입니다.",
    benefits: [
      "일일 이용권 20,000원 → 15,000원 및 암벽화 무료 대여",
      "일일 체험 강습 30,000원 → 25,000원",
      "스타터 패키지 등록 시 일일 체험 강습비 전액 환급",
      "월간 이용권 130,000원 → 110,000원",
    ],
    link: "https://naver.me/5R4yOf2G",
    texts: ["어바웃 멤버 본인만 적용 가능", "방문 후 어바웃 멤버증을 보여주면 할인 적용"],
  },
  {
    id: "in-out",
    name: "인아웃",
    summary: "다이어트 플랫폼",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9D%B8%EC%95%84%EC%9B%83.png",
    description:
      "식단, 운동, 체중 기록부터 단식 타이머, 커뮤니티, 배틀까지 체계적인 체중 관리를 지원하는 올인원 다이어트 플랫폼입니다.",
    benefits: ["인아웃 PLUS 연간 구독권 80% 할인"],
    link: "https://www.inout.team/",
    texts: ["어바웃 멤버 및 지인 이용 가능", "마이룸 → 앱 설정 → 프로모션 코드 → ABUT6622 입력"],
  },
  {
    id: "safedoc",
    name: "세이프닥",
    summary: "의료복지 플랫폼",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%84%B8%EC%9D%B4%ED%94%84%EB%8B%A5.png",
    description:
      "전국 500여 개 제휴 병원에서 의료 및 시술 혜택을 받을 수 있는 대학생 대상 의료복지 플랫폼입니다.",
    benefits: ["모든 의료 및 시술 항목에 어바웃 멤버 추가 할인"],
    link: "https://safedoc.io/sign/v6n09o",
    texts: ["어바웃 멤버 전용 링크를 통해 가입하면 혜택 자동 적용"],
  },
  {
    id: "nail-preview",
    name: "네일프리뷰",
    summary: "네일 플랫폼",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4+%EC%97%85%EC%B2%B4+%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%84%A4%EC%9D%BC%ED%94%84%EB%A6%AC%EB%B7%B0.png",
    description:
      "원하는 네일 디자인 사진을 업로드하면 주변 네일숍으로부터 가격과 예약 가능 시간을 제안받아 비교할 수 있는 네일 견적 플랫폼입니다.",
    benefits: ["네일 이용 비용 10% 할인"],
    link: "https://www.nailpreview.com/",
    texts: ["어바웃 멤버 및 지인 적용 가능", "할인코드 ABOUTPREVIEW 입력"],
  },
  {
    id: "watcha",
    name: "왓챠",
    summary: "OTT 서비스",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%99%80%EC%B1%A0.png",
    description:
      "영화, 드라마, 다큐멘터리, 애니메이션 등 다양한 콘텐츠를 감상할 수 있는 국내 OTT 서비스입니다.",
    benefits: ["왓챠 프리미엄 구독권 6개월간 15% 할인"],
    link: "https://watcha.com/browse/all",
    texts: ["어바웃 멤버 본인만 적용 가능", "쿠폰 코드 aboutwatcha26 입력"],
  },
  {
    id: "optic-life",
    name: "옵틱라이프",
    summary: "렌즈 전문 안경점",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%98%B5%ED%8B%B1%EB%9D%BC%EC%9D%B4%ED%94%84.png",
    description:
      "고객이 직접 구매해 온 안경테나 선글라스에 맞춤형 안경렌즈를 전문적으로 피팅하고 장착해 주는 프랜차이즈 안경원입니다.",
    benefits: ["안경렌즈 및 관련 비용 30% 할인"],
    link: "https://opticlife.co.kr/",
    texts: ["어바웃 멤버 본인만 적용 가능", "방문 후 어바웃 멤버증을 보여주면 할인 적용"],
  },
  {
    id: "miracle-enter-partyroom",
    name: "미라클엔터",
    summary: "교대역 파티룸",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EB%AF%B8%EB%9D%BC%ED%81%B4.png",
    description:
      "교대역 도보 3분 거리에 위치한 최대 100명 수용 규모의 파티룸으로, 대형 스크린, 조명, 라이브바, 노래방, 보드게임 등의 시설을 갖추고 있습니다.",
    benefits: ["전체 이용 비용 약 15% 할인"],
    link: "https://www.spacecloud.kr/space/60165",
    texts: ["어바웃 멤버 및 지인 적용 가능", "어바웃 채널로 문의"],
  },
  {
    id: "wing-studycafe",
    name: "윙 스터디카페",
    summary: "강남역 스터디룸",
    category: "life",
    imageUrl:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%A0%9C%ED%9C%B4%20%EC%97%85%EC%B2%B4%20%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%9C%99%EC%8A%A4%ED%84%B0%EB%94%94.png",
    description:
      "강남역에서 도보 1분 거리에 위치한 그룹 스터디룸 및 스터디카페로, 토익, 영어 회화, 자격증, 면접 준비 등 최대 10인의 모임에 이용할 수 있습니다.",
    benefits: ["4명 단위 이용 시 1명 할인", "이용료 25% 할인"],
    link: "https://naver.me/5CW7lQge",
    texts: ["어바웃 멤버 및 지인 이용 가능", "어바웃 채널로 문의"],
  },
];
