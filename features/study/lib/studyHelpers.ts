import dayjs from "dayjs";

import { STUDY_RESULT_HOUR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { StudyConfirmedMemberProps } from "@/types/models/studyTypes/study-entity.types";
import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudySetProps,
  StudyType,
} from "@/types/models/studyTypes/study-set.types";
import { getTodayStr } from "@/utils/dateTimeUtils";

export const getMyStudyDateArr = (
  studySet: StudySetProps,
  myId: string,
): { date: string; type: StudyType; placeId?: string }[] => {
  if (!studySet || !myId) return null;
  const dateArr: { date: string; type: StudyType; placeId?: string }[] = [];
  (["participations", "openRealTimes", "results", "soloRealTimes"] as StudyType[]).forEach(
    (key) => {
      (studySet[key] as StudyConfirmedSetProps[] | StudyParticipationsSetProps[]).forEach(
        (study) => {
          if (key === "participations") {
            const study2: StudyParticipationsSetProps = study;
            study2.study.forEach((props) => {
              if (props.user._id === myId) {
                dateArr.push({ date: study2.date, type: key });
              }
            });
          } else {
            const study2: StudyConfirmedSetProps = study;
            study2.study.members.forEach((props) => {
              if (props.user._id === myId) {
                dateArr.push({ date: study2.date, type: key, placeId: study2.study.place._id });
              }
            });
          }
        },
      );
    },
  );
  return dateArr;
};

export const getStudyBadge = (studyType: StudyType, dateStatus: "future" | "current" | "prev") => {
  switch (studyType) {
    case "participations":
      // 라운지(매칭 신청자 모음)의 상태. 동작처럼 읽히는 "신청" 대신 상태로 적는다.
      return { text: "모집중", colorScheme: "blue" };
    case "soloRealTimes":
      return { text: "공부 인증", colorScheme: "red" };
    default:
      if (dateStatus === "current") {
        return { text: "오늘의 스터디", colorScheme: "mint" };
      } else if (dateStatus === "future") {
        // 정규 매칭의 9시 전 결과는 미리보기다(확정 아님). 확정과 같은 이름을 쓰면 이미 성사된
        // 것으로 읽힌다. 직접 개설은 이미 열린 스터디라 그대로 "예정된 스터디"다.
        return studyType === "results"
          ? { text: "오픈 예정", colorScheme: "purple" }
          : { text: "예정된 스터디", colorScheme: "purple" };
      } else {
        return { text: "지난 스터디", colorScheme: "black" };
      }
  }
};

/**
 * 같은 스터디 참여자끼리는 닉네임 대신 실명을 보여 준다.
 * 확정된 장소 스터디(오픈 스터디, 결과 발표 이후의 매칭 조)에 내가 참여 중일 때만 true.
 * 라운지 신청자·오픈 예정 조·개인 공부 인증, 승인 대기(pending) 상태에서는 false.
 */
export const canSeeStudyRealName = ({
  studyType,
  date,
  members,
  myId,
}: {
  studyType: StudyType;
  date: string;
  members: StudyConfirmedMemberProps[] | null | undefined;
  myId: string | undefined;
}) => {
  if (!myId || !members?.length) return false;
  const isConfirmedStudy =
    studyType === "openRealTimes" ||
    (studyType === "results" &&
      (date < getTodayStr() || (date === getTodayStr() && dayjs().hour() >= STUDY_RESULT_HOUR)));
  if (!isConfirmedStudy) return false;
  return members.some((member) => member?.user?._id === myId && member?.status !== "pending");
};
