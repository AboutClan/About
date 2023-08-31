import styled from "styled-components";
import { IAccordionContent } from "../components/ui/Accordion";
export const ACCOUNT = "1002-364-221277 우리은행 이승주(어바웃)";
export const ACCOUNT_SHORT = "1002-364-221277 우리은행 어바웃";

export const REGISTER_AGE_MIN = 12;

export const PromotionComponent = () => <P>{PROMOTION_TEXT}</P>;

const P = styled.p`
  padding: var(--padding-md);
  border-radius: var(--border-radius-sub);
  height: 240px;
  overflow-x: auto;
  overflow-y: auto;
  font-size: 12px;
  background-color: var(--input-bg);
`;

export const OPEN_KAKAO_LINK = "https://open.kakao.com/o/sjDgVzmf";

export const PROMOTION_TEXT = `안녕하세요! 카공 및 친목 동아리 ABOUT입니다!

공부를 목적으로 하시는 분도, 카공과 함께 동네 친구를 만들고 싶은 분들도 모두 환영해요!😊

☕️동아리 소개☕️
✔개인 공부에 집중도 할 수 있고, 소소하게 얘기도 할 수 있는 분위기의 스터디
✔ 지역별로 장소가 분류되어 있어 쉽게 참여할 수 있는 스터디
✔원하는 날짜와 시간에 자유롭게 투표하고 참여하는 스터디
✔같은 지역, 비슷한 또래, 비슷한 전공이나 관심사를 가진 친구를 만날 수 있는
✔카공뿐만 아니라 다양한 오프라인 모임도 진행하는 동아리
✔다양한 동아리 내 컨텐츠와 항시 진행중인 이벤트
✔체계적으로 관리하고 운영되는 동아리
✔열심히 공부한 후에 밥 한끼 같이 먹을 수 있는 그런 동아리 !

☕️모임 장소☕️
1. 수원: 아주대/수원역/경희대/수원시청역/상현역/광교역/송죽동/구운동
2. 양천＆영등포: 당산역/오목교역/영등포구청역/등촌역/까치산역/화곡동
3. 안양: 안양역/인덕원역/범계역/금정역
4. 강남: 강남역/논현역/양재역/선릉역/강남구청역/신논현역/교대역

☕️가입 조건☕️
1. 한 달에 최소 1회 이상 카공 스터디에 참여 가능한 인원
2. 만 19~26세의 대학생(졸업생)
3. 불온한 목적의 가입자를 엄격하게 금지함(진짜 가만 안둠)
4. 타인에게 피해나 불쾌감을 주는 행위는 발각시 즉각 추방 !

☕️회비☕️
2000원의 가입비 + 3000원의 보증금(환급 가능)
안양 지역은 가입비/보증금 무료
보증금은 동아리 규칙에 의거하여 100원 ~ 1000원 사이의 벌금이 부여될 수
있습니다.

☕️가입 신청 및 동아리 구경☕️
아래 링크에서 '게스트 로그인'을 통해 구경하거나,
'카카오 로그인'을 통해 가입 신청이 가능합니다.

https://studyabout.club


☕️관련문의☕️
https://open.kakao.com/o/sjDgVzmf

✔혹시하는 마음에 한번 더 언급하자면 신천지아니고, 웹 사이트 상에서의 프로필도 모두 오픈되어 있어요! 관련해서 문의하지 말아주세요...🥲

`;

export const ACCORDION_CONTENT_FEE: IAccordionContent[] = [
  {
    title: "저희 지역 스터디는 언제 오픈하나요?",
    content:
      " 신청 인원이 30명 정도 모이면 오픈합니다! 신청 현황은 가입 첫 페이지에서 언제든 확인할 수 있어요!",
  },
  {
    title: "신청 후에 어떻게 하나요?",
    content:
      "신청을 완료하시면 관리자가 확인하는대로 가입 승인과 단톡방 초대를 해 드립니다! 빠르면 당일이 될 수도 있고 늦어지면 최대 3~4일 정도 소요될 수 있습니다. 또한 마음이 바뀌어 참여를 안하게 되는 경우에도 가입 후 일주일 이내에는 가입비와 보증금 전액 환급해드립니다.",
  },
  {
    title: "스터디 벌금이 궁금해요!",
    content: [
      "1시간 이상 지각 -100원",
      "스터디 당일 불참 -200원",
      "스터디 당일 잠수 -1000원",
      "한 달에 1회 미만 참여 - 1000원",
      "가입한 달에는 참여 정산 벌금이 없습니다.",
      "보증금은 언제든 환급받을 수 있습니다.",
    ],
  },
  {
    title: "가입비와 벌금은 어디에 사용되나요?",
    content:
      "동아리 내에서는 다양한 이벤트와 컨텐츠를 항시 진행하고 있습니다. 동아리원 분들은 직접 이벤트에 침여할 수도 있고, 스터디에 참여하면 적립 받는 포인트를 사용해서 추첨 컨텐츠에 응모할 수도 있습니다. 모인 금액의 일부는 서비스 향상과 마케팅에도 사용됩니다.",
  },
  {
    title: "추가적으로 궁금한 내용이 있어요!",
    content: "",
  },
  {
    title: "가입 신청이 안돼요 ㅠㅠ",
    content: "",
  },
];
