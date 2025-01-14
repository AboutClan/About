import { TABLE_COLORS } from "../../constants/styles";
import { IRuleModalContent } from "../../modals/RuleModal";
import { GroupCategory } from "../../types/models/groupTypes/group";

export const GROUP_STUDY_CATEGORY_ARR = [
  "전체",
  "취미",
  "시험 준비 스터디",
  "성장 스터디",
  "자기계발",
  "운동",
  "기타",
  // "자기계발",
  // "운동",
  // "프로그래밍",
  // "어학",
  // "자격증",
  // "취업준비",
  // "게임",
  // "문화탐방",
  // "피크닉",
  // "콘텐츠",
  // "기타",
] as const;

export const GROUP_STUDY_SUB_CATEGORY: { [key in GroupCategory]: string[] } = {
  전체: [],
  취미: ["보드게임", "방 탈출", "감상", "카페 탐방", "사진", "게임"],
  "시험 준비 스터디": ["토익", "컴활", "코딩테스트"],
  "성장 스터디": ["회화", "독서", "토론/이야기", "프로그래밍"],

  // 어학: ["토익", "오픽", "토플", "회화", "일본어"],
  // 자격증: ["컴활", "한국사", "정보처리기사"],
  // 프로그래밍: ["코딩테스트", "프로젝트", "언어 공부"],
  // 취업준비: ["공기업 면접", "사기업 면접", "인적성(NCS)"],
  자기계발: ["습관 인증", "블로그", "다이어리"],
  운동: ["운동 인증", "다이어트"],
  기타: [],
  // 게임: ["리그오브레전드", "오버워치", "롤토체스"],
  // 문화탐방: ["방탈출", "보드게임", "소그룹", "전시회/미술관", "카페", "영화"],
  // 운동: ["러닝", "운동 인증", "다이어트", "클라이밍"],
  // 피크닉: ["출사"],
  // 콘텐츠: [],
  // 기타: ["편입준비", "공사", "수리 통계", "노래", "친목 모임"],
};

export const GROUP_STUDY_CATEGORY_ARR_ICONS = {
  "시험 준비 스터디": (
    <i className="fa-regular fa-file-certificate" style={{ color: `${TABLE_COLORS[0]}` }} />
  ),

  "지속 성장 스터디": (
    <i className="fa-regular fa-user-graduate" style={{ color: `${TABLE_COLORS[1]}` }} />
  ),
  자기계발: <i className="fa-regular fa-book-user" style={{ color: `${TABLE_COLORS[2]}` }} />,

  취미: <i className="fa-regular fa-champagne-glasses" style={{ color: `${TABLE_COLORS[3]}` }} />,
  운동: <i className="fa-regular fa-person-running" style={{ color: `${TABLE_COLORS[4]}` }} />,

  기타: <i className="fa-regular fa-atom" style={{ color: `${TABLE_COLORS[6]}` }} />,
};

export const GROUP_STUDY_RULE_CONTENT: IRuleModalContent = {
  headerContent: {
    title: "소모임 게시판",
    text: "다양한 주제의 스터디나 공통된 관심사 소모임을 개설하거나 참여할 수 있어요!",
  },
  mainContent: [
    {
      title: "소모임에 어떻게 참여할 수 있나요?",
      texts: [
        "누구나 소모임에 참여/개설 할 수 있으나 모집 마감, 승인이 필요한 경우, 조건이 존재하는 경우 등 제한될 수도 있습니다.",
        "추가로 원하는 카테고리는 건의사항으로 요청할 수 있습니다.",
      ],
    },
    {
      title: "소모임 활동은 어떻게 진행되나요?",
      texts: [
        "대부분은 단톡방에서 주로 진행됩니다. 웹사이트는 모임의 정보와 멤버 관리 및 홍보, 출석체크, 채팅, 모임등이 가능합니다.",
      ],
    },
    {
      title: "참여비/챌린지 관련",
      texts: [
        "기본 참여비로 30 포인트(또는 200원)이 소모됩니다. 추가 참여비가 필요한 경우에는 사용 목적이 가입 신청시 공지되어 있습니다. 모인 벌금은 N빵으로 다시 돌려받고, 기본 참여비만 있는 경우에도 챌린지나, 중간에 상품을 받는 이벤트가 무조건 있습니다. (기본 가입비보다 동아리 지원금이 10배 이상임)",
      ],
    },
  ],
};
