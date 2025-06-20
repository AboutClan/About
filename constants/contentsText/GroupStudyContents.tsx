import { IRuleModalContent } from "../../modals/RuleModal";

export const GROUP_STUDY_CATEGORY_ARR_ICONS = {
  // "시험 스터디": (
  //   <i className="fa-regular fa-file-certificate" style={{ color: `${TABLE_COLORS[0]}` }} />
  // ),
  // "성장 스터디": (
  //   <i className="fa-regular fa-user-graduate" style={{ color: `${TABLE_COLORS[1]}` }} />
  // ),
  // 자기계발: <i className="fa-regular fa-book-user" style={{ color: `${TABLE_COLORS[2]}` }} />,
  // 취미: <i className="fa-regular fa-champagne-glasses" style={{ color: `${TABLE_COLORS[3]}` }} />,
  // 운동: <i className="fa-regular fa-person-running" style={{ color: `${TABLE_COLORS[4]}` }} />,
  // 기타: <i className="fa-regular fa-atom" style={{ color: `${TABLE_COLORS[6]}` }} />,
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
