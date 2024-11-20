export interface PointSystemProp {
  value: number;
  message: string;
}

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
