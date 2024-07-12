import { IButtonCardProps } from "../../components/molecules/cards/ButtonCard";

export interface PointSystemProp {
  value: number;
  message: string;
}

export const POINT_SYSTEM_PLUS = {
  STUDY_ATTEND_CHECK: { value: 5, message: "스터디 출석" },
  STUDY_PRIVATE_ATTEND: { value: 2, message: "개인 스터디 인증" },
  STUDY_VOTE: {
    basic: { value: 5, message: "스터디 투표" },
    first: { value: 10, message: "스터디 첫번째 투표" },
    second: { value: 5, message: "스터디 두번째 투표" },
    third: { value: 2, message: "스터디 세번째 투표" },
  },
  STUDY_VOTE_DAILY: { value: 2, message: "당일 스터디 참여" },
  STUDY_INVITE: { value: 2, message: "친구 초대 보너스" },
  DAILY_ATTEND: { value: 2, message: "일일 출석" },
  PROMOTION: { value: 100, message: "홍보 리워드" },
  LIKE: { value: 2, message: "좋아요" },
};

export const POINT_SYSTEM_DEPOSIT = {
  STUDY_TIME_CHANGE: {
    value: -100,
    message: "스터디 시작 이후 시간 변경",
  },
  STUDY_PRIVATE_ABSENT: {
    value: -100,
    message: "개인 스터디 미 인증",
  },
  STUDY_ATTEND_LATE: {
    value: -100,
    message: "스터디 지각",
  },
  STUDY_ABSENT_BEFORE: {
    value: -300,
    message: "당일 불참(스터디 시작 이전)",
  },
  STUDY_ABSENT_AFTER: {
    value: -600,
    message: "당일 불참(스터디 시작 이후)",
  },
  STUDY_MONTH_CALCULATE: {
    value: -1000,
    message: "스터디 한달 정산",
  },
};

export const POINT_GET_ACTIBITY_LIST: Omit<IButtonCardProps, "func">[] = [
  {
    title: "스터디 투표",
    subTitle: "스터디에 투표만 해도!",
    buttonText: "5 P",
  },
  {
    title: "스터디 사전 투표",
    subTitle: "먼저 투표하면 추가 포인트",
    buttonText: "10 P",
  },
  {
    title: "스터디 장소 선택",
    subTitle: "여러 장소에 투표하면 추가 포인트",
    buttonText: "10 P",
  },
  {
    title: "스터디 출석",
    subTitle: "스터디에 출석하면",
    buttonText: "5 P",
  },
  {
    title: "개인 스터디",
    subTitle: "개인 스터디 인증만 올려도",
    buttonText: "5 P",
  },
  {
    title: "FREE 스터디",
    subTitle: "자유로운 스터디 참여",
    buttonText: "5 P",
  },
];

export const POINT_GET_EVENT_LIST: Omit<IButtonCardProps, "func">[] = [
  {
    title: "친구 초대",
    subTitle: "스터디 페이지에서 친구 초대",
    buttonText: "5 P",
  },
  {
    title: "매일매일 출석체크",
    subTitle: "다양한 상품 획득 가능",
    buttonText: "100 P",
  },
  {
    title: "홍보 이벤트",
    subTitle: "100 POINT 뿐만 아니라 치킨까지 !",
    buttonText: "100 P",
  },
  {
    title: "모임 개설",
    subTitle: "재미있는 모임을 개설해봐요",
    buttonText: "50 P",
  },
  {
    title: "소그룹 개설",
    subTitle: "관심 분야 소그룹을 개설해봐요",
    buttonText: "100 P",
  },
  {
    title: "건의하기",
    subTitle: "의견은 언제나 큰 힘이 됩니다 !",
    buttonText: "10 P",
  },
  {
    title: "열활멤버",
    subTitle: "매달 열활멤버를 뽑습니다",
    buttonText: "100 P",
  },
  {
    title: "스터디 장소 추천",
    subTitle: "공부하기 좋은 장소를 추천해주세요 !",
    buttonText: "10 P",
  },
];
