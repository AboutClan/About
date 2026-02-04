import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../hooks/study/queries";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

export default function ShareParticipationsStudyResult() {
  const toast = useToast();
  const { data: session } = useSession();
  const { data: studySet } = useStudySetQuery(getTodayStr());

  useEffect(() => {
    if (!studySet || !session) return;
    let myStudy: StudyConfirmedMemberProps;
    let openUrl;

    studySet.results.forEach((result) => {
      if (result.date === getTodayStr()) {
        const study = result.study;
        myStudy = study.members.find((member) => member.user.uid === session?.user.uid);
        if (myStudy) {
          openUrl =
            "https://about20s.club/_open" +
            `?dl=study/${study.place._id}/${getTodayStr()}?type=results`;
        }
        return;
      }
    });
    studySet.openRealTimes.forEach((realTimes) => {
      if (realTimes.date === getTodayStr()) {
        const study = realTimes.study;
        myStudy = study.members.find((member) => member.user.uid === session?.user.uid);
        if (myStudy) {
          openUrl =
            "https://about20s.club/_open" +
            `?dl=study/${study.place._id}/${getTodayStr()}?type=openRealTimes`;
        }
        return;
      }
    });

    if (openUrl) {
      window.location.replace(openUrl);
      return;
    }

    toast("info", "오늘 참석중인 스터디가 없습니다.");

    setTimeout(() => {
      const openUrl = "https://about20s.club/_open" + `?dl=studyPage?date=${dayjsToStr(dayjs())}`;

      window.location.replace(openUrl);
    }, 1000);
  }, [studySet, session]);

  return <></>;
}
