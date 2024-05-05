export const POINT_SYSTEM_PLUS = {
  STUDY_ATTEND: { value: 5, message: "스터디 출석" },
  STUDY_PRIVATE_ATTEND: { value: 2, message: "개인 스터디 인증" },
  STUDY_VOTE: {
    first: { value: 10, message: "스터디 투표" },
    second: { value: 5, message: "스터디 투표" },
    third: { value: 2, message: "스터디 투표" },
  },
  STUDY_INVITE: { value: 2, message: "친구 초대 보너스" },
  DAILY_ATTEND: { value: 3, message: "일일 출석" },
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
