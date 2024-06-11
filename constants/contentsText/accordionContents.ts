import { IAccordionContent } from "../../components/molecules/Accordion";
import { EVENT_ALWAYS, EVENT_CONTENT_2024 } from "../../constants/settingValue/eventContents";

//회원가입 질문 컨텐츠
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

export const ACCORDION_CONTENT_FAQ: IAccordionContent[] = [
  {
    title: "[스터디] 스터디는 어떻게 참여하나요?",
    content:
      "원하는 날짜, 원하는 시간, 원하는 장소에 투표해서 신청하시면 돼요! 매일 오후 11시에 다음 날의 스터디 결과가 발표됩니다.(3명 이상 겹치는 경우 OPEN) 결과가 확정되면 신청하신 시간에 해당 장소로 가시면 돼요!",
  },
  {
    title: "[스터디] 스터디 투표 기능에 대해 설명해 주세요!",
    content:
      "메인 페이지 중앙의 투표 버튼 또는 각 카페 상세 페이지에서 투표가 가능합니다. 기본적으로는 1지망 장소를 선택하면 2지망 장소도 자동 선택되는 구조입니다. 또한 선택한 장소에 비례해서 포인트를 획득할 수 있습니다. 투표 지도에서 우측 상단의 아이콘을 통해 이러한 2지망 추천 장소 선택을 조정할 수 있고, 좌측 하단에서는 마이페이지에서 등록할 수 있는 스터디 프리셋을 바로 불러와 적용할 수 있습니다.",
  },
  {
    title: "[스터디] 스터디는 어떻게 진행되나요?",
    content:
      "처음 오시는 분들은 어떻게 진행되는지도 모르고, 아는 사람도 없다보니 이 부분 걱정을 많이 하시는 거 같아요. 스터디에 도착하면 출석체크를 통해 본인의 위치나 인상착의를 간단하게 적게됩니다. 또한 다른 사람들이 적은 내용도 확인할 수 있어서 누군지 알아볼 수 있어요!",
  },
  {
    title: "[스터디] 스터디 분위기는 어떤가요? 같이 모여서 진행하나요?",
    content:
      "스터디 분위기는 매번 다른거 같아요. 모여서 쉬엄쉬엄 얘기하면서 공부할 때도 있고, 공부에만 집중할 때도 있어요. 보통 자주 나오는 인원들끼리는 어느정도 안면이 있다보니, 같이 얘기도 하면서 카공하는 편이에요! 처음 오시는 분 있으면 같이 인사도 하고. 그런데 혼자 공부만 하다가 가시는 분들도 있어요 ㅎㅎ 편하신대로 하셔도 됩니다!",
  },
  {
    title: "[스터디] 시간을 변경하거나 불참해야 하는 일이 생기면 어떻게 하나요?",
    content:
      "전날 11시에는 결과가 발표되다 보니, 가능하면 그 전에 일정을 조정해주시는게 좋아요. 하지만 당일에도 어쩔 수 없는 상황을 늘 생기잖아요? 지각 기준은 코리안타임을 열심히 실천하시는 분들이 많아서 투표했던 시간부터 1시간까지 입니다. 어쩔 수 없는 사정이 있는 경우 당일 불참도 가능한데 이유랑 같이 적어주시면 돼요! 지각과 불참 모두 벌금이 존재하고, 메인 페이지의 '포인트 가이드'에서 확인해주세요!",
  },
  {
    title: "[스터디] FREE 오픈은 뭔가요?",
    content:
      "스터디가 열리지 않은 장소에 본인이 직접 스터디를 오픈 할 수 있어요! 원하는 시간에 참여하면 되고, 소수 또는 혼자라도 가서 공부하고 싶을 때 주로 사용됩니다. 일반 스터디랑 마찬가지로 점수랑 포인트를 획득할 수 있고, 벌금이 발생하지 않습니다! 또한 정규 스터디 장소는 아니지만, FREE 오픈을 통해서만 오픈할 수 있는 카페들도 있어요!",
  },
  {
    title: "[스터디] 친구 초대가 뭔가요?",
    content:
      "스터디 페이지에서 해당 스터디에 다른 친구를 초대할 수 있어요. 이를 통해 참여하면 양쪽 모두 포인트를 획득해요! 친한 사이라면 가끔 납치해 와도 좋아요.",
  },
  {
    title: "[시스템] 웹사이트 이용 TIP",
    content: [
      "메인페이지에서 날짜 이동은 스와이프를 통해 쉽게 할 수 있어요.",
      "이용 오류는 관리자에게 문의하면 금방 해결돼요.",
    ],
  },
  {
    title: "[포인트] 포인트가 뭔가요?",
    content:
      "동아리 활동을 하다보면 다양한 컨텐츠에서 포인트를 얻을 수 있어요. 100포인트는 현금 1000원과 같다고 생각하시면 됩니다! 획득한 포인트로는 스토어에서 상품 구매에 응모할 수 있어요. 자세한 내용은 '스토어' 가이드를 참고해주세요!",
  },
  {
    title: "[배지] 배지가 뭔가요?",
    content:
      "획득한 포인트는 본인의 동아리 점수로도 누적 합산돼요. 누적 점수에 따라서 배지를 획득할 수 있습니다. 또한 출석체크나 이벤트로만 얻을 수 있는 이벤트 배지도 존재해요!",
  },
  {
    title: "[컨텐츠] 트레이드 게시판",
    content:
      "동아리 점수와 포인트를 확인할 수 있고, 랭킹 페이지와 스토어 페이지가 존재합니다. 랭킹 페이지에서는 매월 스터디 참여 랭킹과, 누적 점수 랭킹을 확인할 수 있습니다. 스토어에서는 포인트를 통해 상품을 획득할 수 있습니다. ",
  },
  {
    title: "[컨텐츠] 모임 게시판",
    content:
      "저희 동아리는 스터디 겸 친목 동아리입니다. 번개모임, 정기모임, 조모임 등의 오프라인 모임이 이루어지고 있어요. 해당 페이지에서 누구나 모임을 주최할 수 있습니다. 그런데 게시글 쓰기 솔직히 귀찮잖아요? 그리고 어떤 사람들이 올지도 모르는데 부담감도 있고요. 컨텐츠, 장소 선택, 시간 등 모두 간단하게 입력할 수 있도록 만들어져 있고, 모집 인원 설정, 성별 조건, 나이 조건, 지역 조건 등 여러가지를 설정할 수 있습니다. 또한 다른 사람이 올린 모임에 참여를 할 수도 있고, 이전에 진행했던 모임들에 대한 후기도 확인할 수 있습니다.",
  },
  {
    title: "[컨텐츠] 캘린더 게시판",
    content:
      "월별로 스터디가 열린 지역과 날짜, 참여인원을 한 눈에 확인할 수 있습니다. 또한 내 스터디 참여 기록을 상세하게 확인할 수 있습니다.",
  },
  {
    title: "[컨텐츠] 캘린더 게시판",
    content:
      "월별로 스터디가 열린 지역과 날짜, 참여인원을 한 눈에 확인할 수 있습니다. 또한 내 스터디 참여 기록을 상세하게 확인할 수 있습니다. ",
  },
  {
    title: "[컨텐츠] 멤버 게시판",
    content:
      "같은 지역의 동아리원 정보를 확인할 수 있습니다. 활동 멤버/수습 멤버/휴식 멤버/생일인 멤버로 분류되어 있고, 나이나 MBTI, 전공, 관심사 등 나와 잘 맞는 친구를 추천해줍니다.",
  },
  {
    title: "[지역] 다른 지역 스터디나 모임에도 참여할 수 있나요?",
    content:
      "메인페이지에서 지역을 변경하면 다른 지역 스터디에도 참여할 수 있습니다. 또한 모임 같은 경우에는 기본적으로는 본인 지역만 참여할 수 있도록 설정되어 있고, 주최자가 '전체' 지역으로 설정된 경우에는 지역에 상관없이 참여할 수 있습니다. ",
  },
  {
    title: "[지역] 다른 지역으로 이동하고 싶어요.",
    content: "운영진에게 말씀해주시면 다른 지역으로 언제든 이동할 수 있습니다.",
  },
  {
    title: "[신고] 이상한 사람이 있어요.",
    content:
      "유저 프로필로 들어가면 거리두기 기능과 신고 기능이 존재합니다. 개인적인 만남을 요구하거나, 종교 포교 목적, 모임에서의 불쾌한 언행 등의 경우처럼 명확하게 이유가 있는 경우 신고하기를 해주시면 되고, 그냥 좀 안맞는 사람인거 같다 라는 경우에는 거리두기를 이용해주시면 됩니다. 거리두기의 경우 스터디나 모임에서 겹치는 일이 없도록 필터가 적용됩니다. 익명성이 보장되니까 너무 부담갖지 말고 신청해주세요.",
  },
];

export const ACCORDION_CONTENT_EVENT = (month: number) => {
  return [
    ...EVENT_CONTENT_2024[month].map((item) => ({
      title: `[${month}/${item.start}~${month}/${item.end}] ${item.content}`,
      content: item.text,
    })),
    ...EVENT_ALWAYS.map((item) => ({
      title: item.title,
      content: item.content,
    })),
  ];
};
